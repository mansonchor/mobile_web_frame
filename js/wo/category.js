define("wo/category",["base_package",'frame_package',"btn_package","wo_config","commom_function","get_template","footer_view","notice","new_alert_v2","world_list_module"],function(require, exports)
{
	var $ = require('zepto')
	var wo_config = require('wo_config')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
	var notice = require('notice')
    var cookies = require('cookies')
	
    
	exports.route = { "category/:cat_conf_id(/:art_id)(/:default_select)": "category" }

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
		
		var footer_view_obj
		

		options.render = function()
		{		
			var that = this

			var template_control = require('get_template')

			
			//var template_obj = template_control.template_obj()		        
			//var init_html = template_obj.friends;  
			
			var init_html = '<div class="wrap-box"><header class="header font_wryh tc re"><div class="tap-select-wrap"><span class="header_title"></span><div class="tab-select re bgc-fff-e2e"><ul class="clearfix" ><li hot_select_btn ><span class="one">热门</span><em class="pop-empty pop-empty-1"></em></li><li new_select_btn ><span class="two">最新</span><em class="pop-empty pop-empty-2"></em></li></ul>  </div>  </div></header><div class="content-10 main_wraper" ><!-- 内页 --><div class="inside-page font_wryh"  style="padding-top:45px;"><!-- fixed 列表滚动闪烁bug --><div  style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);" ></div></div><!-- fixed 列表滚动闪烁bug --><div class="actbox-item main_container pb5"></div></div><!-- 内页 --></div><footer class="footer" style="color:white;text-align:center;line-height:44px;font-size:14px;font-weight:900"><ul><div ><i class="icon-bg-common" style="width: 30px;height: 25px;background-position: 0 -324px;display:inline-block"></i><span data-footer_txt style="display:inline-block;vertical-align: 7px;margin-left:10px">参与此分类</span></div></ul></footer></div>'
							
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
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false				                                                                
                
                world_list_module_obj.start_reset()
			},
			'tap [hot_select_btn]' : function()
			{
				if(default_select=="hot") return 

				change_select_type("hot")
				
				world_list_module_obj.set_options({ photowall_content_type : 'normal' })
				world_list_module_obj.set_data({ select_type : "hot" , tag_name : tag_name })
				world_list_module_obj.start_reset()
			},
			'tap [new_select_btn]' : function()
			{
				if(default_select=="new") return 
				
				change_select_type("new")
				
				world_list_module_obj.set_options({ photowall_content_type : 'new' })
				world_list_module_obj.set_data({ select_type : "new" , tag_name : tag_name })
				world_list_module_obj.start_reset()
			},
			//底部发布按钮
			'tap footer' : function()
			{
				var hash = location.hash.replace("#", "") 
                
				// 进入普通发布页 hdw
				
				var stat_img = new Image()
				stat_img.src = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/publish_btn?url_hash="+hash+"&tmp="+new Date().getTime()

				var login_requirement = common_function.publish_login_requirement()
				if(login_requirement)
				{
					page_control.navigate_to_page("login") 
				}
				else
				{
					//var keyword = decodeURIComponent(_params_arr[0])
					
					page_control.navigate_to_page("publish",{ key_word : tag_name , camera_sharestr : "#"+tag_name+"#"})
				}
			},
            'tap [append_html_container]' : function()
            {
           	    page_control.navigate_to_page("dating_list",{tag_name : tag_name})
            }            
		}
		
		var tag_name
		var _page_view
		var category_refresh_btn
		var view_scroll_obj
		var default_select = "hot"							//默认看最热
        var _params_arr
		

		options.page_before_show = function()
		{
			document.title = tag_name
		}

		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			_page_view = page_view
            _params_arr = params_arr
			
			tag_name = decodeURIComponent(params_arr[0])

			document.title = tag_name
			
			var init_art_id = params_arr[1]
			if(common_function.is_empty(init_art_id)) init_art_id = 0
			
			var hash_default_select = params_arr[2]
			if(!common_function.is_empty(hash_default_select))
			{
				default_select = hash_default_select
			}

			change_select_type(default_select)


			//刷新按钮  add by manson 2013.5.7
			category_refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(category_refresh_btn.$el)
			
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
			

			if(tag_name=="心情")
			{
				var force_type = "big_img_list"
			}
			else
			{
				var force_type = false
			}

			var world_list_module = require('world_list_module')()
			world_list_module_obj = new world_list_module({ 
				url : wo_config.ajax_url.category,
				data : { select_type : default_select , tag_name : tag_name , art_id : init_art_id},
				custom_data : { category_list : true },
				force_type : force_type,
				list_type : "both",
				page_count : 20,
				main_container : $(page_view.el).find('.main_container'),
				page_view : page_view.$el.find('.wrap-box'),
				oncomplete : function()
				{
					category_refresh_btn.reset()
				},
				onloading : function()
				{
					category_refresh_btn.loadding()
				},
				onreset : function(index_page)
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
				//append_html : '<div class="icon-join-user-wrap radius-2px"><span class="icon-bg-common icon "></span></div>'
				//append_html : '<div class="icon-join-user-wrap radius-2px"><span class="icon-bg-common icon "></span></div><div class="icon-join-locat-wrap radius-2px ml10"><span class="icon-bg-common icon "></span></div>'
			})

			world_list_module_obj.start_reset()
			

			//针对第一次进入时的art_id清除处理
			world_list_module_obj.set_data({ select_type : default_select , tag_name : tag_name })
		}
		

		function change_select_type(select_type)
		{
			if(select_type=="hot")
			{
				_page_view.$el.find('[hot_select_btn]').addClass('cur')
				_page_view.$el.find('[new_select_btn]').removeClass('cur')

				default_select = "hot"
			}
			else
			{
				_page_view.$el.find('[hot_select_btn]').removeClass('cur')
				_page_view.$el.find('[new_select_btn]').addClass('cur')

				default_select = "new"
			}
		}

		var page = require('page').new_page(options);
		
		return page;
	}
});

if(typeof(process_add)=="function")
{
	process_add()
}