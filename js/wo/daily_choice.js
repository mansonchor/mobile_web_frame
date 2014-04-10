/**
  *	 view滚动控制
  *	 针对支持overflow:scroll和低版本系统分别处理
  *	 @author Manson
  *  @version 2013.2.16
  */
define("wo/daily_choice",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view",'world_list_module'],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	var Mustache = require('mustache')
    var new_alert_v2 = require("new_alert_v2")
    
    exports.route = { "daily_choice(/:issue_id)": "daily_choice" }

	exports.new_page_entity = function(custom_options)
	{
		var custom_options = custom_options || {}
		var options = {
			transition_type : custom_options.custom_tansition || 'slide',
			without_his : custom_options.without_his,
			dom_not_cache : true,
			ignore_exist : true
		}     
        
		options.initialize = function()
		{
			this.render();
		}
		
		options.render = function()
		{
			var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix fb"><h3 class="clearfix" style="display:inline-block;width:100%;text-align:center"><label data-everyday_title></label></h3></header><div class="content-10 main_wraper" style="padding: 0 10px;"><div class="everydat_hot_list font_wryh" style="padding-top:45px;padding-bottom:20px"></div></div><div class="comment-love-mod"><ul class="clearfix"><li pre_page_btn class="pre" style="width:30%"><em class="icon icon-bg-common" style="margin: 0px 15px -4px 0;display:inline-block"></em>上一期</li><li data-intro_ourseleves style="width:40%"><em class="icon-camera icon-bg-common"></em>自荐精华</li><li class="next" next_page_btn style="width:30%">下一期<em class="icon icon-bg-common" style="margin: 0px 0 -4px 15px;display:inline-block"></em></li></ul></div></div>'						 

			this.$el.append($(init_html))
		}
		
		options.events = {			
			'tap .ui-btn-prev-wrap' : function(ev)
			{
				page_control.back()
			},  
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{
					page_control.back()
				}
			},            			
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false

				world_list_module_obj.start_reset()
			},
            'tap [pre_page_btn]' : function(ev)
            {
                var cur_btn = $(ev.currentTarget);
                
                if(page_control.page_transit_status()) return false                                                
                
                if(pre_issue_id<=0 || !cur_btn.hasClass("click"))
                {                                           
                    return false;
                }                                
                
                page_control.navigate_to_page("daily_choice/"+pre_issue_id,{},true,"slide_reverse")
            },
            'tap [next_page_btn]' : function(ev)
            {
                var cur_btn = $(ev.currentTarget);
                
                if(page_control.page_transit_status()) return false                                
                
                if(next_issue_id<=0 || !cur_btn.hasClass("click"))
                {                                           
                    return false;
                }                                
                
                page_control.navigate_to_page("daily_choice/"+next_issue_id,{},true)
            },
            'tap [data-intro_ourseleves]' : function()
            {
                var hash = location.hash.replace("#", "")

				var stat_img = new Image()
				stat_img.src = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/publish_btn?url_hash="+hash+"&tmp="+new Date().getTime()

                
                var login_requirement = common_function.publish_login_requirement()
				if(login_requirement)
				{
					page_control.navigate_to_page("login") 
				}
				else
				{
					page_control.navigate_to_page("publish",{ key_word : "精选自荐" , camera_sharestr : "#精选自荐#",link_type:"everyday_hot"})
				}
            }
		}

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
            
            $(page_view.el).find('.photowall_item img').css({height:'auto'})            
		}
		

		//页面显示时
		options.page_before_show = function(page_view)
		{ 
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
		}

        
        var user_id        
	    var refresh_btn        
        var _params_arr 
        var _page_view
        var _state     
        var page_back_btn
        var everyday_hot_collection_obj
        var pre_issue_id
        var next_issue_id
        var cur_issue_id
		var world_list_module_obj
        
		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			var that = this;
			
			_page_view = $(page_view.el)		
			_params_arr = params_arr
            _state = state
            
            
            // 当前传入期刊数
            var issue_id = (typeof params_arr[0] == 'undefined')?"":params_arr[0]
                                    			
            //刷新按钮  add by manson 2013.5.7
			refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(refresh_btn.$el)                        
           
			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head_and_nav(),
				use_lazyload : true
			})
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
            

			var world_list_module = require('world_list_module')()
			world_list_module_obj = new world_list_module({ 
				url : wo_config.ajax_url.get_everyday_hot,
				data : { issue_count : issue_id},
				list_type : "both",
				page_view : $(page_view.el).find('.wrap-box'),
				no_more_control : true,
				main_container : $(page_view.el).find('.everydat_hot_list'),
				parse : function(response)
				{
					//榜单标题和上下一期的处理
					if(response && typeof(response.result_data)!="undefined")
    				{
						var issue_name = response.result_data.issue_name
						_page_view.find("[data-everyday_title]").html(issue_name)
						

						pre_issue_id = response.result_data.previous_issue_count
						next_issue_id = response.result_data.next_issue_count
						
						if(pre_issue_id > 0)
						{
							_page_view.find("[pre_page_btn]").addClass("click")
						}
						
						if(next_issue_id > 0)
						{
							_page_view.find("[next_page_btn]").addClass("click")
						}

    				    
    					return response.result_data.data
    				}
    				else
    				{
    					return response
    				}
				},
				oncomplete : function()
				{
					refresh_btn.reset()
				},
				onloading : function()
				{
					refresh_btn.loadding()
				},
				onreset : function()
				{
					//滚回顶部
					view_scroll_obj.scroll_to(0)
					_page_view.$el && _page_view.$el.find('header').animate({'translate3d':'0px, 0px, 0px'},0,'ease-in')
					

					//翻页PV统计  add by manson 2013.7.31
					common_function.page_pv_stat_action()
				},
				onlisttypechange : function()
				{
					view_scroll_obj.trigger_scrollend()
				}
			})

			world_list_module_obj.start_reset()
		}

		var page = require('page').new_page(options);
		
		return page;
	}
    
	
});