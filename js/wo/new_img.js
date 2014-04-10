define("wo/new_img",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","slider",'notice','world_list_module'],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var common_function = require('commom_function')
	var wo_config = require('wo_config')
	var notice = require('notice')
    var Mustache = require('mustache')
    

	exports.route = { "new_img(/:tag)(/:id)": "new_img"  }

	exports.new_page_entity = function()
	{
		var options = {
			dom_not_cache : true,
			transition_type : 'slide'
		}

		options.initialize = function()
		{
			this.render()
		}

		var footer_view_obj
		options.render = function()
		{  
			//var template_control = require('get_template')
			//var template_obj = template_control.template_obj()
			
			var init_html = '<div class="wrap-box"><header class="header fb re font_wryh"><h1 class="logo">最新照片</h1></header><div class="content-10 main_wraper"  ><div class="index-page" style="padding-top: 45px;" ><div data-pull_down><div class="pull_btn"><span data-loading style="display:none" class="icon-bg-common loading-icon"></span><label></label></div></div><!-- fixed 列表滚动闪烁bug --><div  style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);" ></div></div><!-- fixed 列表滚动闪烁bug --><div class="main_container"></div></div></div></div>'
			
			this.$el.append($(init_html))
		}
		
		
		options.events = {
			
			//后退
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
			}
		}
		
		
		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
			$(page_view.el).find('.photowall_item img').css({height:'auto'})
		}


		
		var ad_slider_obj
		var _page_view
		var view_scroll_obj
		var index_mobile_photo_collection
		var photowall_controler
		var index_refresh_btn
		var from_same_city = 0
		var _params_arr
		var location_id = 0

		//页面初始化时
		options.page_init = function(page_view,params_arr)
		{		
			_page_view = page_view
			
			_params_arr = params_arr 

			var that = this		
			
			//刷新按钮  add by manson 2013.5.7
			index_refresh_btn = require('refresh_btn')()
			//page_view.$el.find('.header').append(index_refresh_btn.$el)
			
			//返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)


			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')
			                
			var filp_tag = false;
			var filp_loading_tag = false
			var flip_value = 5
			 
			var view_scroll = require('scroll')
			var pull_down_offset = 55
			var pull_donw_obj = $(page_view.el).find('[data-pull_down]')

			var pull_refresh = false
			
		
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head(),
				use_lazyload : true,
				top_offset : pull_down_offset,
				bounce : true,
				/*scroll_refresh : function(scroll_view_obj)
                {                    
                    if (pull_donw_obj.hasClass('loading'))
                    {
                        pull_donw_obj[0].className = ' '
                        pull_donw_obj.find('[data-loading]').hide()
                        pull_donw_obj.find('label').html('拖动刷新...');
                    }
 

                },*/
				scroll_move : function(scroll_view_obj)
				{
				    var that = this
                    //var cur_scroll_y = Math.abs(that.y)
                    
					var scroll_y = that.y
                    
                    if (scroll_y > flip_value && !pull_refresh) 
                    {
						pull_refresh = true

                        //pull_donw_obj.addClass('flip')
                        pull_donw_obj.find('label').html('释放刷新...');
                        pull_donw_obj.find('[data-loading]').hide()
                        that.minScrollY = 0;                        
                        
                        console.log('释放刷新...')
                    }
                    else if ( scroll_y < flip_value && pull_refresh ) 
                    {
                        
                        pull_refresh = false
							
                        pull_donw_obj.find('label').html('拖动刷新...');
                        pull_donw_obj.find('[data-loading]').hide()
                        
                        that.minScrollY = -pull_down_offset;
                        console.log('拖动刷新...')
                    }
                    

				},				
                scroll_end : function(scroll_view_obj)
                {
                    var that = this
                    
                    if (pull_refresh) 
                    {
                        
                        pull_donw_obj.addClass('loading');
                        pull_donw_obj.find('label').html('加载中...');
                        pull_donw_obj.find('[data-loading]').show()
                        
                        /*world_list_module_obj.start_reset(function()
                        {
                            that.refresh()
 
                        })*/          
							
						
						world_list_module_obj.start_reset()
                    } 
                    
                }
                
			})
			


			var world_list_module = require('world_list_module')()
			world_list_module_obj = new world_list_module({ 
				url : wo_config.ajax_url.new_img,
				list_type : "photowall",
				main_container : $(page_view.el).find('.main_container'),
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
					pull_donw_obj.find('[data-loading]').hide()
                    pull_donw_obj.find('label').html('拖动刷新...')

					pull_refresh = false

					//滚回顶部
					view_scroll_obj.scroll_to(-pull_down_offset)
					_page_view.$el && _page_view.$el.find('header').animate({'translate3d':'0px, 0px, 0px'},0,'ease-in')
					

					//翻页PV统计  add by manson 2013.7.31
					common_function.page_pv_stat_action()
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