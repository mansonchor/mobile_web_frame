/**
  *	 新版首页
  *	 @author Manson
  *  @version 2013.5.2
  *  @modify 2013.8.27
  */
define("wo/ground",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","slider",'notice','world_list_module'],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	var common_function = require('commom_function')
	var wo_config = require('wo_config')
	var notice = require('notice')
    var Mustache = require('mustache')
    var cookies = require('cookies')
	

	var page_count = 20

	exports.route = { "ground": "ground"  }

	exports.new_page_entity = function()
	{
		var options = {
			title : "广场",
			transition_type : 'none'
		}

		options.initialize = function()
		{
			this.render()
		}

		var footer_view_obj
		options.render = function()
		{  
			var template_control = require('get_template')

			var footer_view = require('footer_view')
			footer_view_obj = new footer_view({ cur : "ground" })
			
			var template_obj = template_control.template_obj()
			
			var init_html = template_obj.ground;

			this.$el.append($(init_html))
		   
			//底部
			this.$el.find('.footer').append(footer_view_obj.$el)

			
		}
		
		
		options.events = {
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false
				
				world_list_module_obj.start_reset()
			},
            'tap [data-top_select_nav_to]' : function(ev)
            {
               var nav_to_address = $(ev.currentTarget).attr("data-top_select_nav_to");
               
               page_control.navigate_to_page(nav_to_address)     
            }
		}
		
		
		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
			$(page_view.el).find('.photowall_item img').css({height:'auto'})

            
            setup_top_item()
		}


		//页面显示时
		options.page_before_show = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())

			notice.footer_notice_ui_refresh()

		}


		var _page_view
		var view_scroll_obj
		var ground_mobile_photo_collection
		var photowall_controler
		var ground_refresh_btn
		var world_list_module_obj

		//页面初始化时
		options.page_init = function(page_view)
		{		
			_page_view = page_view

			
			var that = this
			
            
			//刷新按钮  add by manson 2013.5.7
			ground_refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(ground_refresh_btn.$el)
			

			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')                
			
			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head_and_nav(),
				use_lazyload : true
			})
			

			var world_list_module = require('world_list_module')()
			world_list_module_obj = new world_list_module({ 
				url : wo_config.ajax_url.index,
				list_type : "photowall",
				no_more_control : true,
				main_container : $(page_view.el).find('.main_container'),
				oncomplete : function()
				{
					ground_refresh_btn.reset()
				},
				onloading : function()
				{
					ground_refresh_btn.loadding()
				},
				onreset : function()
				{
					_page_view.$el.find('.hot_img_nav_btn').show()

					//滚回顶部
					view_scroll_obj.scroll_to(0)
					_page_view.$el && _page_view.$el.find('header').animate({'translate3d':'0px, 0px, 0px'},0,'ease-in')
					

					//翻页PV统计  add by manson 2013.7.31
					common_function.page_pv_stat_action()
				}
			})

			world_list_module_obj.start_reset()
			
            
            // 初始化导航放图高度
            setup_top_item()
            
           
		}
		

        
        function setup_top_item()
        {
            var area_height = parseInt((window.innerWidth-(4*10))/3); // 屏宽-页面边距-每个小方图的边距
            
            $(_page_view.el).find('.top-select-item li .item').width(area_height).height(area_height)
        }
                
		var page = require('page').new_page(options);
		
		return page;
	}	
})