define("wo/rank_pic_list",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","world_list_module"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var wo_config = require('wo_config')
	
	exports.route = { "rank_pic_list/:rank_id/:issue_count(/:photowall_type)": "rank_pic_list" }

	exports.new_page_entity = function()
	{
		var options = {
			manual_title : true,
			route : { "rank_pic_list": "rank_pic_list" },
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true
		}
		
		
		var request_url = ""                
		options.initialize = function()
		{
			this.render();
		}

		options.render = function()
		{		
			
			var that = this

			var init_html = '<div class="wrap-box"><header class="header tc re"><h3><span class="title"></span></h3></header><div class="content-10 main_wraper" ><div class="inside-page"  style="padding-top:45px;"><div  style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);" ></div></div><div class="actbox-item main_container pb5"></div></div></div><div class="comment-love-mod footer-rank"><ul class="clearfix"><li index_btn class="index" style="width:50%"><em class="icon icon-bg-common"></em>世界首页</li><li publish_btn class="publish" style="display:none"><em class="icon icon-bg-common"></em>精选自荐</li><li friend_btn class="friend" style="width:50%"><em class="icon icon-bg-common"></em>好友动态</li></ul></div></div>'        
							
			that.$el.append($(init_html))
			
		}
		
		
		options.events = {
					
			'tap .ui-btn-prev-wrap' : function()
			{
				page_control.back()		
			},
			'swipe' : function(ev)
			{			    
				if(ev.gesture.direction=="right"&&!common_function.get_ua().is_uc)
				{
					page_control.back()
				}
			},
			//刷新
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false				                                                                
                
				world_list_module_obj.start_reset()
			},
			'tap [index_btn]' : function()
			{
						                                                                
                			page_control.navigate_to_page('index')
			},
			'tap [publish_btn]' : function()
			{
						                                                                
                			 var login_requirement = common_function.publish_login_requirement()
				if(login_requirement)
				{
					page_control.navigate_to_page("login") 
				}
				else
				{
					page_control.navigate_to_page("publish",{ key_word : "精选自荐" , camera_sharestr : "#精选自荐#",link_type:"everyday_hot"})
				}
			},
			'tap [friend_btn]' : function()
			{
						                                                                
                page_control.navigate_to_page('friend')
			}


		}
		

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
			$(page_view.el).find('.item-act .img img').css({height:'auto'})
		}
		        
		
		var view_scroll_obj
		var rank_refresh_btn
		var _params_arr
		var _page_view
        var _params_obj
		var world_list_module_obj
        
		var keyword
		
		
		//页面初始化时
		options.page_init = function(page_view,params_arr,params_obj)
		{
			_page_view = page_view
			_params_arr = params_arr
			_params_obj = params_obj
			
			var rank_id = params_arr[0]
			var issue_count = params_arr[1]
			var photowall_type = params_arr[2]

			//刷新按钮
			rank_refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(rank_refresh_btn.$el)
			
			
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)

			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head_and_nav(),
				use_lazyload : true
			})
			
			
			if(photowall_type==0)
			{
				var force_type = "photowall"
			}
			else if(photowall_type==1)
			{
				var force_type = "big_img_list"
			}
			else
			{
				var force_type = false
			}


			var world_list_module = require('world_list_module')()
			world_list_module_obj = new world_list_module({ 
				url : wo_config.ajax_url.get_rank_list,
				data : { rank_id : rank_id , issue_count : issue_count },
				list_type : "both",
				force_type : force_type,
				main_container : $(page_view.el).find('.main_container'),
				oncomplete : function()
				{
					rank_refresh_btn.reset()
				},
				onloading : function()
				{
					rank_refresh_btn.loadding()
				},
				onreset : function(index_page)
				{
					//滚回顶部
					view_scroll_obj.scroll_to(0)
					_page_view.$el && _page_view.$el.find('header').animate({'translate3d':'0px, 0px, 0px'},0,'ease-in')
					

					//翻页PV统计 
					common_function.page_pv_stat_action()
				},
				onlisttypechange : function()
				{
					view_scroll_obj.trigger_scrollend()
				},
				parse: function(response) 
				{ 
					page_view.$el.find('.title').html(response.rank_info.rank_issue_name)

					return response.art_list
				}
			
			})
			world_list_module_obj.start_reset()
			
		}
		

		var page = require('page').new_page(options);
		
		return page;
	}
	
})

if(typeof(process_add)=="function")
{
	process_add()
}