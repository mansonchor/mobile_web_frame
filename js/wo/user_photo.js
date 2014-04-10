define('wo/user_photo',["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","new_alert_v2","show_big_img","world_list_module"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
    var wo_config = require('wo_config')
	var new_alert_v2 = require("new_alert_v2")
    var show_big_img = require("show_big_img")
        
	exports.route = { "user_photo/:query(/:category)(/:force_type)": "user_photo" } 
            
    exports.new_page_entity = function()
	{
		
		var options = {
			manual_title : true,
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true
		}

		options.initialize = function()
		{
			this.render();
		}

		options.render = function()
		{
			var init_html = '<div class="wrap-box see-stranger"><header class="header fb re font_wryh"><h1 class="logo" data-user_name></h1></header><div class="content-10 main_wraper"><div class="index-page" style="padding-top:45px;"><div style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);"></div></div><div class="banner_tips radius-2px clearfix re" style="padding: 15px 10px;margin-bottom: -5px;display:none"><div class="txt color333"><em class="icon icon-bg-common"></em>长按照片，可以去除不符的内容</div><div class="btn-close-wrap"><span class="btn-close radius-2px"><i class="icon-close icon-bg-common"></i></span></div></div><div class="main_container"></div></div></div></div>'
            
			this.$el.append($(init_html))
		}
			
		options.events = {

			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false

				world_list_module_obj.start_reset()
			},            
            'tap .btn-close-wrap' : function()
            {
                _page_view.$el.find(".banner_tips").hide();
                window.localStorage.setItem("user_photo_pics",1);
            },
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
			'hold .item' : function(ev)
			{
				var poco_id = common_function.get_local_poco_id()

				if(user_id == poco_id && !common_function.is_empty(keyword))
				{
					if(confirm("是否排除出该分类?"))
					{
						var art_id = $(ev.currentTarget).attr('art_id')
						
						common_function.send_request
						({
							url : "http://m.poco.cn/mobile/action/del_tag.php",
							type : "GET",
							data : { keyword : keyword, art_id : art_id , is_select : 0 },
						})
						

						$(ev.currentTarget).remove()
					}
				}
			},
			'hold .item-act' : function(ev)
			{
				var poco_id = common_function.get_local_poco_id()

				if(user_id == poco_id && !common_function.is_empty(keyword))
				{
					if(confirm("是否排除出该分类?"))
					{
						var art_id = $(ev.currentTarget).attr('art_id')
						
						common_function.send_request
						({
							url : wo_config.ajax_url.update_my_life_grid_box,
							type : "GET",
							data : { tag_id : keyword, art_id : art_id , is_select : 0 },
						})
						

						$(ev.currentTarget).remove()
					}
				}
			}
		}
		

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
			$(page_view.el).find('.waterfall-item img').css({height:'auto'})
		}
        
		var _page_view
		var keyword
		var user_id
		var index_refresh_btn
        var world_list_module_obj
		var manual_title

		//页面初始化
		options.page_init = function(page_view,params_arr,state)
		{
			_page_view = page_view

			var that = this

			user_id = params_arr[0]
			
			if(params_arr[1])
			{
				keyword = decodeURIComponent(params_arr[1])
			}
			else
			{
				keyword = ""
			}
			
			var photowall_type = params_arr[2]
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
            
            //未登录处理
			var poco_id = common_function.get_local_poco_id()			
            
            if(poco_id == user_id && !common_function.is_empty(keyword))
			{
                if(window.localStorage.getItem("user_photo_pics"))
                {
                    page_view.$el.find(".banner_tips").hide();
                }
                else
                {                
                    page_view.$el.find(".banner_tips").show();
                }	
			}                        
			
       
			//刷新按钮  add by manson 2013.5.7
			index_refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(index_refresh_btn.$el)
			
			//返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)


			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')                
			
			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head(),
				use_lazyload : true
			})

			

			var world_list_module = require('world_list_module')()
			world_list_module_obj = new world_list_module({ 
				url : wo_config.ajax_url.user_photo,
				list_type : "both",
				data : { user_id : user_id , keyword : keyword },
				photowall_content_type : 'profile',
				main_container : $(page_view.el).find('.main_container'),
				force_type : force_type,
				page_view : $(page_view.el).find('.wrap-box'),
				oncomplete : function()
				{
					index_refresh_btn.reset()
				},
				onloading : function()
				{
					index_refresh_btn.loadding()
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
				},
				parse : function(response)
				{
					if(!common_function.is_empty(response.user_nickname))
					{ 
						if(common_function.is_empty(response.keyword))
						{
							manual_title = response.user_nickname
						}
						else
						{
							manual_title = response.user_nickname + " - " + response.keyword
						}
						
						document.title = manual_title

						page_view.$el.find('[data-user_name]').html(manual_title)
					}

					if(!common_function.is_empty(response.keyword))
					{
						page_view.$el.find('[data-tag_name]').html('#' + response.keyword + '#')
					}

					return response.photo_list
				},
				append_html : '<div data-tag_name style="line-height:30px;font-size:14px;height:30px;"></div>'

			})
			

			if(common_function.is_empty(keyword))
			{
				world_list_module_obj.start_reset(2)
			}
			else
			{
				world_list_module_obj.start_reset()
			}
		}
		

		options.page_before_show = function()
		{
			if(manual_title)
			{
				document.title = manual_title
			}
		}
		

		
		var page = require('page').new_page(options)
		
		return page
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}