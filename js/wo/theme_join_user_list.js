// 参与同一活动的人
// @author Manson
// @version 2013.11.7
define("wo/theme_join_user_list",["base_package",'frame_package',"btn_package","wo_config","commom_function","user_list_view","user_list_controler","user_list_collection"],function(require, exports)
{
	var $ = require('zepto')
	var wo_config = require('wo_config')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
	

	exports.route = { "theme_join_user_list/:keyword": "theme_join_user_list" }

	exports.new_page_entity = function()
	{
		var options = {
			title : '参与活动的人',
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true            
		}
		
		
		var page_count = 20 
		
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
				user_list_view_obj.more_btn_reset()
				refresh_btn.reset()
				
				if(response==null) return

				if(response==false || response.length < page_count)
				{            			    
					user_list_view_obj.hide_more_btn()
				}
                
                
                                
			},
			before_refresh : function()
			{
				refresh_btn.loadding()
			},
			before_get_more : function()
			{
				user_list_view_obj.more_btn_loading()
			}
		}
 
		//初始化数据
		var new_user_list_collection = require('user_list_collection')
		
		var user_list_collection_obj = new_user_list_collection({
			url : function()
			{
				return wo_config.ajax_url.theme_join_user_list+"?keyword=" + keyword
			},
			refresh : function()
			{
				common_function.collection_refresh_function.call(this,collection_options)
			},
			get_more_item : function()
			{
				var that = this

				collection_options.data = { order_key : that.models[that.models.length-1].attributes.order_ukey}

				common_function.collection_get_more_function.call(this,collection_options)
			}
		})

		
		// 列表子项视图
		var user_list_item_view = require('user_list_view')

		
		// 列表视图
		var user_list_view = require('user_list_controler')
		

		options.initialize = function()
		{
			this.render();
		}

		options.render = function()
		{		       
			var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><h3 class="tc" >参与活动的人</h3></header>  <div class="content-10 main_wraper"><!--关注--><div class="attention-page font_wryh" style="padding-top:45px;"><div class="list-comment-item"></div></div><!--关注end--></div></div>';
						
			this.$el.append($(init_html))
		}
		
		options.events = {
		   
			//刷新
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false

				user_list_collection_obj.refresh();
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
			//加载更多
			'tap .data-more_btn' : function()
			{
				if(page_control.page_transit_status()) return false

				user_list_collection_obj.get_more_item()		
			}
			
		}

        var user_id
		var view_scroll_obj        
		var cur_page_view
		var _params_arr
		var _state
		var user_list_view_obj
		var refresh_btn
		var keyword

		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			cur_page_view = $(page_view.el)      
			_params_arr = params_arr 
			_state = state           
			
			keyword = params_arr[0]
			
			//刷新按钮  add by manson 2013.5.7
			refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(refresh_btn.$el)


			//滚动列表
			var view_scroll = require('scroll')                    
			var list_container = $(page_view.el).find('.main_wraper');                                            
			view_scroll_obj = view_scroll.new_scroll(list_container,{
				'view_height' : common_function.container_height_with_head()
			})
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)                          
            
            user_id = common_function.get_local_poco_id();
			
			user_list_view_obj = new user_list_view
			({
				el : $(page_view.el).find('.list-comment-item')
			});
			
			// 初始化数据集
			//user_list_collection_obj = new user_list_collection                
			
			//刷新列表监听
			user_list_collection_obj.bind('reset', re_render_list , page_view)
			
			//加载更多监听
			user_list_collection_obj.bind('add', add_render_list , page_view)
			
			user_list_collection_obj.refresh()
		}
		
		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
		}
		
		function re_render_list()
		{
			var that = this;			        
			
			user_list_view_obj.clear_list()
			
			user_list_collection_obj.each(function(item_model)
			{
				var item_view = new user_list_item_view({ 
					model : item_model,
					tpl_type : "theme_join_user"                
				})			            
				
				//每次add入列表
				user_list_view_obj.add_list_item(item_view) 
								 
			})
					
			
			//滚回顶部
			view_scroll_obj.scroll_to(0)
		}
		
		function add_render_list(item_model)
		{	   

			var item_view = new user_list_item_view({ 
				model : item_model,
				tpl_type : "theme_join_user"
			})                
			
			//每次add入列表
			user_list_view_obj.add_list_item(item_view)   
	
		}
        

		var page = require('page').new_page(options);
		
		return page;
	}
	
})

if(typeof(process_add)=="function")
{
	process_add()
}