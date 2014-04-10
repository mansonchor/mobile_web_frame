/**
  *	 页面导航 + 转场控制
  */
define("frame/page_control",['base_package',"ua"],function(require, exports){	
	//req!!uire('page_control_css');

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
	var before_route
	var after_route
	
	var is_backward = null
	
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
		before_route = options.before_route || ""
		after_route = options.after_route || ""

		_original_container = original_container;

		
		//匹配修正跳转链接 没有带hash的情况  add by manson 2013.6.28
		app_route.route("" , "" , function()
		{
			that.navigate_to_page(default_index_route)
		})
	}
	

	exports.route_start = function()
	{
		//Backbone.history.start({ pushState:true , root: "/hotbed/bsz_frame/"})
		Backbone.history.start()
	}
	
	exports.navigate_to_page = function(page , state)
	{
		if(page_is_transit) return

		_temp_state = state

		_move = "forward"

		app_route.navigate(page ,{trigger: true, replace: false} );
	}

	exports.back = function()
	{
		if(page_is_transit) return

		if(_his_log_arr.length <= 1 )
		{
			if(default_index_route!="")
			{
				this.navigate_to_page(default_index_route)
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


	exports.add_page = function(page_controler)
	{
		var that = this;
		var route = page_controler.route || {};
		
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
					var from_view = _his_log_arr.pop();
					
					var index_view = _his_log_arr[_his_log_arr.length - 1];


					if(have_exist>0)
					{
						var transition_type = from_view.transition_type;

						_start_page_transition(from_view , index_view , transition_type , true);
						

						setTimeout(function(){
							index_view.$el.css({'top' : "0px" ,'zIndex' : 10000})
						},10)
						

						_last_page_view = index_view;
					}

					_control_history_arr.pop()
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
						var page_entity = page_controler.new_page_entity()
						var page_view = page_entity.view()

						console.log(page_view)

						page_view.$el.attr('page-url',url_hash);
						

						//新建页面
						page_view.$el.css({
							'visibility':'hidden',
							'top' : "0px",
							'zIndex' : 10000
						});

						
						$(_original_container).append(page_view.$el);

						index_view = page_view;
						
						//页面view缓存
						_page_buff_arr[url_hash] = page_view;
						
						

						if(typeof(page_view.page_init)=="function")
						{
							page_view.page_init.call(that,page_view,_page_params_arr,_temp_state);
						}
					}

					
					from_view = _last_page_view

					
					var transition_type = index_view.transition_type;

					_start_page_transition(from_view , index_view , transition_type , false);

					_last_page_view = index_view;
					
					//历史页面记录
					_his_log_arr.push(index_view);

					//辅助记录历史浏览记录  add by manson 2013.4.12
					_control_history_arr.push(url_hash)
				}
				

				if(typeof(after_route)=="function")
				{
					after_route.call(that)
				}

			})
		}
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
			to_page_view.page_before_show.call(that,to_page_view,_page_params_arr);
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

			//to_page_element.removeEventListener('webkitAnimationEnd',__tansition_end_page_dom_control,false);

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

				//from_page_element.removeEventListener('webkitAnimationEnd',__tansition_end_page_dom_control,false);
				//from_page_element.addEventListener('webkitAnimationEnd',__tansition_end_page_dom_control, false);

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
				if(typeof(TO_PAGE_VIEW.page_back_show)=="function" && is_backward)
				{
					TO_PAGE_VIEW.page_back_show.call(that,TO_PAGE_VIEW,_page_params_arr);
				}


				if(typeof(TO_PAGE_VIEW.page_show)=="function")
				{
					TO_PAGE_VIEW.page_show.call(that,TO_PAGE_VIEW,_page_params_arr,_temp_state);
				}


				__tansition_end_page_dom_control()

			},parseInt(animation_duration))
			
			/*if(to_page_element_keyframe=="none")
			{
				__tansition_end_page_dom_control()
			}*/
			
			
		}
		
	}

	function __tansition_end_page_dom_control()
	{
		
		var that = this;

		var from_page_element = FROM_PAGE_VIEW.el;
		var to_page_element = TO_PAGE_VIEW.el;
		
		
		if(from_page_element)
		{
			//from_page_element.style.visibility = 'hidden';
			
			$(from_page_element).css({'top' : "-3000px"});
			
			
			//移除页面
			if(FROM_PAGE_VIEW.dom_not_cache==true && is_backward)
			{
				
				FROM_PAGE_VIEW && FROM_PAGE_VIEW.remove()
			}
		}
	

		page_is_transit = false
		
		
		_clear_dom = null
		_move = null

		is_backward = null
	}

});