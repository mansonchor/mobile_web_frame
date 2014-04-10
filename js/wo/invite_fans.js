// 邀请好友列表
// hudw 2013.5.22
define("wo/invite_fans",["base_package","btn_package",'frame_package',"wo_config","commom_function","user_list_view","user_list_controler","user_list_collection"],function(require, exports)
{
	var $ = require('zepto')
	var wo_config = require('wo_config')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
	
	exports.route = { "invite_fans/:query": "invite_fans" }

	exports.new_page_entity = function()
	{
		var options = {
			route : { "invite_fans/:query": "invite_fans" },		
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true            
		};
		
		
		var page_count = 50 
		
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
				user_list_view_obj.more_btn_reset()
				refresh_btn.reset()

				if(response==null) return
                
                
                var account_type = _params_arr[0];                                
                
                if(account_type == 'sina')
                {
                    if(response.over_time&&response.over_time == 1)
                    {                    
                        _page_view.find(".over_time_sina div").html("此新浪微博账号已过期，请点击进行重新绑定。")
                        
                        show_no_bind_or_over()
                        
                        return;
                    }
                    else if(response.length <= 0)
                    {
                        _page_view.find(".over_time_sina div").html("尚未绑定新浪微博账号，请点击进行绑定。")
                        
                        show_no_bind_or_over()
                        
                        return;
                    }
                    else
                    {
                        _page_view.find(".main_wraper").show();
                        _page_view.find(".over_time_sina").hide();
                    }     
                }
                else
                {
                    if(response.length <= 0)
                    {
                        _page_view.find(".over_time_sina div").html("尚未绑定腾讯微博账号，请点击进行绑定。")
                        
                        show_no_bind_or_over()
                        
                        return;
                    }
                    else if(!response)
                    {
                        _page_view.find(".over_time_sina div").html("您的腾讯微博尚未有好友。")
                        
                        show_no_bind_or_over()
                        
                        return;
                    }
                    else
                    {
                        _page_view.find(".main_wraper").show();
                        _page_view.find(".over_time_sina").hide();
                    } 
                                  
                }
                
                                
				
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
				return wo_config.ajax_url.invite_friend_list+"?account_type="+_params_arr[0]
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
			//loading.show_loading();

			this.render();
		}

		options.render = function()
		{		       
			var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><h3 class="tc" ><span class="fwn">邀请好友</span></h3></header><div class="over_time_sina font_wryh" style="font-size: 14px; text-align: center; display: none; width: 100%; height: 95%;"><div style="display: table-cell;padding:0 20px;text-align: center;vertical-align: middle;"></div></div><div class="content-padding0 main_wraper" style="display:none"><div class="request-firend font_wryh" style="padding-top:45px"><div class="title" data-title_txt>邀请新浪微博的好友加入</div><div class="list-comment-item"></div></div></div></div>'
						
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
			},
            //新浪微博过期后直接跳转到绑定页面
			'tap .over_time_sina' : function()
			{
				if(page_control.page_transit_status()) return false

				page_control.navigate_to_page("setup")	
			}
			
		}

		
		//页面显示时
		options.page_show = function(page_view,params_arr)
		{	                 			        
			_page_view = $(page_view.el)
		}
			
		var view_scroll_obj        
		var _page_view
		var _params_arr
		var _state
		var user_list_view_obj
		var refresh_btn
		var poco_id

		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			_page_view = $(page_view.el);        
			_params_arr = params_arr; 
			_state = state;              
			
			poco_id = common_function.get_local_poco_id();
			
			var title = (params_arr[0] == 'sina')?"邀请新浪微博的好友加入":"邀请腾讯微博的好友加入"
			_page_view.find("[data-title_txt]").html(title);
			
			//刷新按钮  add by manson 2013.5.7
			refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(refresh_btn.$el)
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)

			//滚动列表
			var view_scroll = require('scroll')                    
			var list_container = $(page_view.el).find('.main_wraper');                                            
			view_scroll_obj = view_scroll.new_scroll(list_container,{
				'view_height' : common_function.container_height_with_head()
			})                          
			
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
			user_list_view_obj.clear_list()
			
			user_list_collection_obj.each(function(item_model)
			{
				if(item_model.attributes.is_open_wo == "1")
				{
					return false;
				}   
				
				var item_view = new user_list_item_view({ 
					model : item_model,
					tpl_type : "invite",
					poco_id : poco_id                
				})			            
				
				//每次add入列表
				user_list_view_obj.add_list_item(item_view) 
								 
			})
					
			
			//滚回顶部
			view_scroll_obj.scroll_to(0)
		}
		
		function add_render_list(item_model)
		{	   

			if(item_model.attributes.is_open_wo == "1")
			{
				return false;
			}   
			
			var item_view = new user_list_item_view({ 
				model : item_model,
				tpl_type : "invite",
				poco_id : poco_id            
			})                
			
			
			//每次add入列表
			user_list_view_obj.add_list_item(item_view)   
						  
		}
        
        function show_no_bind_or_over()
        {
            _page_view.find(".main_wraper").hide();
            _page_view.find(".over_time_sina").css("display","table");
            user_list_view_obj.hide_more_btn()
            refresh_btn.$el.hide();            
        }
		

		var page = require('page').new_page(options);
		
		return page;
	}
});