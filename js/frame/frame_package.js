define("frame/page",["ua",'base_package'],function(require, exports)
{
	var $ = require('zepto')
	var ua = require('ua')
	
	//add by manson 2013.5.19底层事件绑定调整
	require('hammer')($)
	$(document.body).hammer({ swipe_velocity : 0.2 })

	
	exports.new_page = function(options)
	{
		var that = this;

		return {
			route : options.route,
			view : function()
			{
				return that.new_view(options)
			}
		}
	}

	exports.new_view = function(options)
	{
		var Backbone = require('backbone');
		var page_view_class = Backbone.View.extend
		({
			tagName :  "div",
			className : "apps_page",
			title : options.title,
			manual_title : options.manual_title,
			dom_not_cache : options.dom_not_cache,
			transition_type : options.transition_type,
			ignore_exist : options.ignore_exist,
			without_his : options.without_his || false,
			initialize : function()
			{
				//转场防事件穿透遮罩层  add by manson 2014.3.5
				this.$el.append('<div class="tran_cover"></div>')
				
				if(typeof(options.initialize)=="function")
				{
					options.initialize.call(this)
				}
			},
			open_cover : function()
			{
				this.$el.find('.tran_cover').show()
			},
			close_cover : function()
			{
				var that = this
				setTimeout(function(){
					that.$el.find('.tran_cover').hide()
				},300)
				
			},
			$_ : function(selector)
			{
				return this.$el.find(selector)
			},
			events : options.events,
			render : options.render,
			page_show : options.page_show,
			page_before_show : options.page_before_show,
			page_back_show : options.page_back_show,
			page_init : options.page_init,
			window_change : options.window_change,
			page_before_hide : options.page_before_hide,
			page_hide : options.page_hide,
			page_lock : false
		})

		return new page_view_class;
	}

});

/**
  *	 页面导航 + 转场控制
  */
define("frame/page_control",['base_package',"ua"],function(require, exports){	
	

	var Backbone = require('backbone')
	var $ = require('zepto')
	var ua = require('ua')
	
	var _move = null
	var _clear_dom = null
	var _original_container
	var _page_buff_arr = {}
	var _his_log_arr = new Array()
	var _last_page_view = null
	var _page_params_arr = new Array()
	var _control_history_arr = new Array()
	
	var _temp_state = {}

	var TO_PAGE_VIEW = {}
	var FROM_PAGE_VIEW = {}
	var default_index_route
	var default_title
	var before_route
	var after_route
	
	var is_backward = null
	var navigate_wihtout_his = null
	var navigate_custom_tansition = null
	
	var page_is_transit = false
	var page_is_lock = false

    
	//android是否转场动画
	var android_no_transition = true
	

	//路由配置
	var app_route_class = Backbone.Router.extend
	({
		
	});
	
	var app_route = new app_route_class
	
	exports.init = function(original_container,options)
	{
		var that = this
		var options = options || {}
		default_index_route = options.default_index_route || ""
		default_title = options.default_title || ""
		before_route = options.before_route || ""
		after_route = options.after_route || ""

		_original_container = original_container;
		
		if(default_index_route)
		{
			//匹配修正跳转链接 没有带hash的情况  add by manson 2013.6.28
			app_route.route("" , "" , function()
			{
				that.navigate_to_page(default_index_route , {} , true)
			})
		}
	}
	

	exports.route_start = function()
	{
		//Backbone.history.start({ pushState:true , root: "/hotbed/bsz_frame/"})
		Backbone.history.start()
	}
	
	exports.navigate_to_page = function( page , state , replace , transition )
	{
		if(page_is_transit) return

		_temp_state = state

		_move = "forward"
		
		//window.location.hash = page
		var replace = (replace==null) ? false : replace
		var trigger = (trigger==null) ? true: trigger

		navigate_wihtout_his = replace

		navigate_custom_tansition = (transition==null) ? false : transition

		app_route.navigate(page ,{trigger: true, replace: replace} )
	}

	exports.back = function()
	{
		if(page_is_transit) return

		if(_his_log_arr.length <= 1 )
		{
			if(default_index_route!="")
			{
				this.navigate_to_page(default_index_route)

				setTimeout(function()
				{
					FROM_PAGE_VIEW.remove()
				},1000)
			}

			return false
		}
		
		_move = "backward"
		
		window.history.back()
	}
	

	exports.page_history = function()
	{
		return _control_history_arr
	}


	exports.window_change_page_triger = function()
	{
		if(typeof(TO_PAGE_VIEW.window_change)=="function")
		{
			TO_PAGE_VIEW.window_change.call(this,TO_PAGE_VIEW);
		}
	}
	

	//返回当前页面view
	exports.return_current_page_view = function()
	{
		return TO_PAGE_VIEW
	}
	

	//锁定page,只是一个变量，暴露给外面页面做逻辑控制用  add by manson 2013.5.19
	exports.lock_page = function()
	{
		page_is_lock = true
	}
	//解锁
	exports.unlock_page = function()
	{
		page_is_lock = false
	}
	//返回锁定状态
	exports.page_lock_status = function()
	{
		return page_is_lock
	}
	//返回转场状态
	exports.page_transit_status = function()
	{
		return page_is_transit
	}
	
	var zIndex = 10000

	exports.add_page = function(page_controller_arr)
	{
		var that = this
		
		
		$(page_controller_arr).each(function(i , page_string)
		{
			var page_controler = require(page_string)
			
			page_controler = page_controler || {}
			var route = page_controler.route || false
			
			if(route)
			{
				for (key in route)
				{
					app_route.route(key , route[key] , function(params,params_2,params_3)
					{
						//修正兼容用浏览器前进后退的情况  add by manson 2013.7.23
						if(page_is_transit) return

						_page_params_arr = []
						_page_params_arr.push(params)
						_page_params_arr.push(params_2)
						_page_params_arr.push(params_3)


						var url_hash = location.href
						

						if(typeof(before_route)=="function")
						{
							before_route.call(that)
						}

						
						var have_exist = false;
						var have_exist = $(_original_container).find('[page-url="'+url_hash+'"]').length;
						

						is_backward = check_route_is_backward()

						
						//是返回操作
						if(is_backward)
						{
							if(have_exist>0)
							{
								_his_log_arr.pop()
								var from_view = _last_page_view
								
								var index_view = _his_log_arr[_his_log_arr.length - 1];

								var transition_type = from_view.transition_type;

								_start_page_transition(from_view , index_view , transition_type , true);
								

								setTimeout(function(){
									index_view.$el.css({'top' : "0px" ,'zIndex' : 10000})
								},10)

								_last_page_view = index_view

								_control_history_arr.pop()
							}
							else
							{
								var page_entity = page_controler.new_page_entity({ custom_tansition : navigate_custom_tansition , without_his : navigate_wihtout_his })
								var page_view = page_entity.view()

								page_view.$el.attr('page-url',url_hash);
								

								//新建页面
								page_view.$el.css({
									'visibility':'hidden',
									'top' : "0px",
									'zIndex' : zIndex
								})
								
								zIndex++

								
								$(_original_container).prepend(page_view.$el)


								//页面view缓存
								_page_buff_arr[url_hash] = page_view
								
								
								if(typeof(page_view.page_init)=="function")
								{
									page_view.page_init.call(that , page_view,_page_params_arr,_temp_state)
								}
								

								var transition_type = page_view.transition_type

								_start_page_transition(_last_page_view , page_view , transition_type , false)

								
								_last_page_view = page_view
								
								//特殊路由
								if(page_view.without_his)
								{
									_his_log_arr[_his_log_arr.length - 1] = page_view
									_control_history_arr[_control_history_arr.length - 1] = url_hash
								}
								else
								{
									//历史页面记录
									_his_log_arr.push(page_view)

									//辅助记录历史浏览记录  add by manson 2013.4.12
									_control_history_arr.push(url_hash)
								}
							}

							
						}
						else
						{
							var index_view = _page_buff_arr[url_hash] 

							if(have_exist>0 && !index_view.ignore_exist)
							{
								index_view.$el.css({'top' : "0px"})
							}
							else
							{
								//var page_view = page_controler.view();
								
								//每个页面都形成一个实体类，操作全在自己的闭包内进行
								//更加安全，无作用域影响问题  
								//modify by manson 2013.5.25
								var page_entity = page_controler.new_page_entity({ custom_tansition : navigate_custom_tansition , without_his : navigate_wihtout_his })
								var page_view = page_entity.view()

								page_view.$el.attr('page-url',url_hash);
								

								//新建页面
								page_view.$el.css({
									'visibility':'hidden',
									'top' : "0px",
									'zIndex' : zIndex
								})
								
								zIndex++

								
								$(_original_container).prepend(page_view.$el);

								index_view = page_view;
								
								//页面view缓存
								_page_buff_arr[url_hash] = page_view;
								
								

								if(typeof(page_view.page_init)=="function")
								{
									page_view.page_init.call(that , page_view,_page_params_arr,_temp_state)
								}
							}

							
							from_view = _last_page_view

							
							var transition_type = index_view.transition_type

							_start_page_transition(from_view , index_view , transition_type , false);

							_last_page_view = index_view;
							

							//特殊路由
							if(index_view.without_his)
							{
								_his_log_arr[_his_log_arr.length - 1] = index_view
								_control_history_arr[_control_history_arr.length - 1] = url_hash
							}
							else
							{
								//历史页面记录
								_his_log_arr.push(index_view)

								//辅助记录历史浏览记录  add by manson 2013.4.12
								_control_history_arr.push(url_hash)
							}
							
						}

						if(typeof(after_route)=="function")
						{
							after_route.call(that)
						}

					})
				}
			}
		})

	}


	function check_route_is_backward()
	{
		var url_hash = location.href;

		var history_length = _control_history_arr.length
		if(history_length > 1)
		{
			var last_two_url = _control_history_arr[history_length-2]
			

			if(_move!="forward" && last_two_url==url_hash)
			{
				return true
			}
			else
			{
				return false
			}
		}
		else
		{
			return false
		}
		
	}
	
	function _start_page_transition(from_page_view,to_page_view,transition_type,is_back , transition_end_callback)
	{
		var that = this;
		var __slide_transition_time = '400ms'
		var __slideup_transition_time = '400ms'
		var __fade_transition_time = '400ms'
		var __ease_timingfunction = 'ease'
	
		var to_page_element_keyframe,from_page_element_keyframe;
		
		
		//android低版本系统忽略转场动画
		if( android_no_transition && ua.isAndroid)
		{
			transition_type = "none"
		}
		

		//页面即将进入转场前触发   add by manson 2013.5.30
		if(typeof(to_page_view.page_before_show)=="function")
		{
			to_page_view.page_before_show.call(that,to_page_view,_page_params_arr,_temp_state);
		}
		
		if(from_page_view)
		{
			from_page_view.open_cover()
		}

		//上一页面即将离开转场前触发   add by manson 2013.7.31
		if(from_page_view && typeof(from_page_view.page_before_hide)=="function")
		{
			from_page_view.page_before_hide.call(that,from_page_view);
		}
		

		switch(transition_type)
		{
			case "slide" :
				
				if(!is_back)
				{
					to_page_element_keyframe = 'slideinfromright';
					from_page_element_keyframe = 'slideoutfromleft';
				}
				else
				{
					to_page_element_keyframe = 'slideinfromleft';
					from_page_element_keyframe = 'slideoutfromright';
				}

				animation_timing_function = __ease_timingfunction;
				animation_duration = __slide_transition_time;

				break;
			case "slide_reverse" :
				
				if(!is_back)
				{
					to_page_element_keyframe = 'slideinfromleft';
					from_page_element_keyframe = 'slideoutfromright';
				}
				else
				{
					to_page_element_keyframe = 'slideinfromleft';
					from_page_element_keyframe = 'slideoutfromright';
				}

				animation_timing_function = __ease_timingfunction;
				animation_duration = __slide_transition_time;

				break;
			case "slideup" :
				
				if(!is_back)
				{
					to_page_element_keyframe = 'slideupinfrombottom';
					from_page_element_keyframe = 'slideupoutfromtop';
				}
				else
				{
					to_page_element_keyframe = 'slideupinfromtop';
					from_page_element_keyframe = 'slideupoutfrombottom';
				}

				animation_timing_function = __ease_timingfunction;
				animation_duration = __slideup_transition_time;

				break;
			case "fade" :
				
				to_page_element_keyframe = 'fadein';
				from_page_element_keyframe = 'fadeout';

				animation_timing_function = __ease_timingfunction;
				animation_duration = __fade_transition_time;

				break;
			
			default :

				to_page_element_keyframe = 'none';
				from_page_element_keyframe = 'none';
				
				animation_timing_function = __ease_timingfunction;
				animation_duration = '10ms';

				//__tansition_end_page_dom_control()
				break;
		}
		
		//正在转场
		page_is_transit = true
		
		
		if(to_page_element_keyframe)
		{
			
			var to_page_element = to_page_view.el;
			TO_PAGE_VIEW = to_page_view;


			//进场页面
			to_page_element.style.webkitAnimationDuration = animation_duration;
			to_page_element.style.webkitAnimationTimingFunction = animation_timing_function;

			to_page_element.style.visibility = 'visible';
			//$(to_page_element).css('opacity',1)

			to_page_element.style.webkitAnimationName = to_page_element_keyframe;
			

			//退场页面
			if(from_page_view)
			{
				var from_page_element = from_page_view.el;
				FROM_PAGE_VIEW = from_page_view

				from_page_element.style.webkitAnimationDuration = animation_duration;
				from_page_element.style.webkitAnimationTimingFunction = animation_timing_function;
				
				from_page_element.style.webkitAnimationName = from_page_element_keyframe;
			}
			else
			{
				page_is_transit = false
			}
			

			setTimeout(function()
			{
				TO_PAGE_VIEW.close_cover()

				if(typeof(TO_PAGE_VIEW.page_back_show)=="function" && is_backward)
				{
					TO_PAGE_VIEW.page_back_show.call(that,TO_PAGE_VIEW,_page_params_arr,_temp_state);
				}

				if(typeof(TO_PAGE_VIEW.page_show)=="function")
				{
					TO_PAGE_VIEW.page_show.call(that,TO_PAGE_VIEW,_page_params_arr,_temp_state);
				}

				__tansition_end_page_dom_control()
				
			},parseInt(animation_duration))
		}
		
	}

	function __tansition_end_page_dom_control()
	{
		page_is_transit = false

		var that = this;

		var from_page_element = FROM_PAGE_VIEW.el;
		var to_page_element = TO_PAGE_VIEW.el;
		

		//页面转换动态改变title   add by manson 2013.11.15
		if(TO_PAGE_VIEW.manual_title!=true)
		{
			if(TO_PAGE_VIEW.title)
			{
				document.title = TO_PAGE_VIEW.title
			}
			else
			{
				document.title = default_title
			}
		}
		
			
		if(from_page_element)
		{
			//from_page_element.style.visibility = 'hidden';
			
			$(from_page_element).css({'top' : "-3000px"});
			
			if(typeof(FROM_PAGE_VIEW.page_hide)=="function")
			{
				FROM_PAGE_VIEW.page_hide.call(that)
			}
			
			//移除页面
			if(FROM_PAGE_VIEW.dom_not_cache==true && is_backward)
			{
				FROM_PAGE_VIEW && FROM_PAGE_VIEW.remove()
			}
			
			if(TO_PAGE_VIEW.without_his)
			{
				FROM_PAGE_VIEW && FROM_PAGE_VIEW.remove()
			}
		}
		

		_clear_dom = null
		_move = null

		is_backward = null
	}

});


define("frame/view_scroll",["base_package","ua"],function(require, exports){

	var $ = require('zepto')
	var ua = require('ua')
	

	//lazyload属性暂时统一用 lazyload_src，不做传参，模板需按格式整合  add by manson 2013.10.23
	function lazyload_control(scroll_view_obj)
	{
		var trigger_range = 200			//触发lazyload的增加范围

		var that = this
		var cur_scroll_y = Math.abs(that.y)
		var scroll_view_height = $(scroll_view_obj).height()

		//console.log("scroll_view_height : " + scroll_view_height)
		
		$(scroll_view_obj).find('[lazyload_src]').each(function(i,img_obj)
		{
			var jq_img_obj = $(img_obj)
			
			var position = jq_img_obj.position()
			var position_top = position.top
			var img_height = jq_img_obj.height()
			
			//console.log(position_top)

			if(position_top + img_height > 0 && position_top < scroll_view_height + trigger_range)
			{
				var img_url = jq_img_obj.attr('lazyload_src')
				jq_img_obj.attr('src',img_url).removeAttr('lazyload_src')
			}
		})
	}


	exports.new_scroll = function(scroll_view_obj,options)
	{
		var that = this
		that.options = options
		var options = that.options || {}
		var view_height = options.view_height || "100%"
        var use_lazyload = options.use_lazyload || false
        var bounce = options.bounce || false

        var scroll_end = options.scroll_end || function(){}
		var scroll_start = options.scroll_start || function(){}
		    
        var hideScrollbar = options.hideScrollbar==null ? true : options.hideScrollbar

		$(scroll_view_obj).css('height' , view_height+'px')

		
		//针对高版本系统ios
		if( ua.ios_version<"6" || ua.isAndroid || true )
		{
			var iscroll_class = require('iScroll')

			$(scroll_view_obj).css({'position':'relative'})
			
			var myScroll = new iscroll_class($(scroll_view_obj)[0],{
				checkDOMChanges : true,
				bounce : bounce,
				hideScrollbar : hideScrollbar,
                useTransform: true,
				useTransition : false,
                zoom: false,
				onScrollEnd : function()
				{
				    if(typeof scroll_end == 'function')
                    {
                        scroll_end.call(this,scroll_view_obj)
                    }
				    
					if(use_lazyload)
					{
						lazyload_control.call(this,scroll_view_obj)
					}
				},
				onScrollStart : function()
				{
					
					if(typeof scroll_start == 'function')
                    {
                        scroll_start.call(this,scroll_view_obj)
                    }
				}
			})		  			
		}
		else
		{
			//req!!uire('view_scroll_css')                        
            
			$(scroll_view_obj).addClass('touch_scroll_css')
		}

		
		

		
		//返回的对象
		var scroll_obj = {}

		scroll_obj.scroll_to = function(top)
		{
			if(myScroll)
			{
				myScroll.scrollTo(0,top,0)
			}
			else
			{
				scroll_view_obj[0].scrollTop = top
			}
		}
		
		scroll_obj.trigger_scrollend = function()
		{
			if(myScroll)
			{
				myScroll.options.onScrollEnd()
			}
		}

		return scroll_obj
	}


})

if(typeof(process_add)=="function")
{
	process_add()
}