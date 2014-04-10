/*
    hdw 评论列表
*/
define("wo/cmt_notice",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","notice","message_nav","user_list_view","user_list_controler","user_list_collection","system_notice_view","no_login"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var wo_config = require('wo_config')
    var notice = require('notice')
	var new_alert_v2 = require("new_alert_v2")
    
	exports.route = { "cmt_notice": "cmt_notice" }

	exports.new_page_entity = function()
	{
		var options = {		
			title : "评论通知",
			route : { "cmt_notice": "cmt_notice" },
			transition_type : 'none'
		}
        
        var view_scroll_obj		
		var _params_arr
		var _page_view
        var _params_obj
		var message_nav_view_obj
        var message_nav_view
		var alert_tips
        var page_count = 20
		var last_is_unread_data
        var user_list_view_obj
        var no_login_view   
        var no_login_view_obj

		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
			    alert_tips.close();  
                         
				var data = [];                        
				
				var is_unread_data = false

				// 过滤请求数据
				$(response).each(function(i,item)
				{					
					if(item.have_unread_before == 1)
					{
						is_unread_data = true
					}
				})
				
				
				user_list_view_obj.cmt_more_btn_reset()							            
				
				if( (response==false || response.length < page_count) && !is_unread_data)
				{            
					user_list_view_obj.hide_more_btn()
				}
                
                message_nav_view_obj.clear_num();
                
                
			},
			before_refresh : function()
			{				
				user_list_view_obj.more_btn_loading()
                
                alert_tips = new_alert_v2.show({text:"加载中",type : "loading",append_target : _page_view.$el,is_cover : false ,auto_close_time:false});
			},
			before_get_more : function()
			{				
				user_list_view_obj.more_btn_loading()
			}
		}
		


		//初始化数据
		var new_user_list_collection = require('user_list_collection')
		
		var user_list_collection_obj = new_user_list_collection({
			url : wo_config.ajax_url.my_cmt_list,
			refresh : function()
			{
				collection_options.data = { get_read_status : "unread" }
				
				common_function.collection_refresh_function.call(this,collection_options)
			},
			get_more_item : function()
			{
				var that = this
				
				
				collection_options.data = { get_read_status : "all" }

				if(that.models.length>0 && that.models[that.models.length-1].attributes.have_unread_before==1)
				{
					common_function.collection_refresh_function.call(this,collection_options)
				}
				else
				{
					common_function.collection_get_more_function.call(this,collection_options)
				}

			}
		})
		
        
        var user_list_item_view = require("user_list_view")
		
		// 列表视图
		var user_list_view = require('user_list_controler')
		    
		options.initialize = function()
		{
			this.render();
		}

		options.render = function()
		{		
			var template_control = require('get_template')
			
			var template_obj = template_control.template_obj()
			
			var footer_view = require('footer_view')
            
			footer_view_obj = new footer_view({ cur : "message_port" })
            
            var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><div class="tab-select_container"></div></header><div id="noLogin"></div><div class="content-10 main_wraper"><div class="give-comment-page font_wryh" style="padding-top:45px;"><div class="main_container"><div class="list-comment-item list-comment-item-padding0"></div></div><div class="no_data" style="display:none;"><div class="me-page-nologin font_wryh"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div style="text-align:left;line-height: 26px;width: 100%;text-align: center;"><p>暂时没有任何消息通知</p></div></td></tr></tbody></table></div></div></div></div><footer class="footer"></footer></div>'

			this.$el.append($(init_html))
            
            //底部
			this.$el.find('.footer').append(footer_view_obj.$el)
		}
		
		
		options.events = {
					
			'tap .ui-btn-prev-wrap' : function()
			{
				page_control.back()		
			},
            //加载更多
			'tap .data-more_btn' : function()
			{
				if(page_control.page_transit_status()) return false

				user_list_collection_obj.get_more_item()										
			},            
            'tap .banner_tips' : function(ev)
            {
                var cur_btn = $(ev.currentTarget);
                
                cur_btn.remove();
                
                window.localStorage.setItem("message_nav_banner_tips",1);
            },
            'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{
					page_control.navigate_to_page("message");
				}
			},
            'swipeleft' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{
					page_control.navigate_to_page("like_notice");
				}
			}
		}
		

		options.window_change = function(page_view)
		{
            $(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
            
            _page_view.$el.find(".no_data").height(common_function.container_height_with_head_and_nav()-45)
		}
        
        var is_login_tag = true
        var poco_id
		options.page_before_show = function(page_view)
		{ 
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
            
            _page_view.$el.find(".no_data").height(common_function.container_height_with_head_and_nav()-45)

		    window.localStorage.setItem("nav_address","cmt_notice");     
            
            if(window.localStorage.getItem("message_nav_banner_tips")!= 1&&_page_view.$el.find(".banner_tips").length<=0)
            {
                _page_view.$el.find(".give-comment-page").prepend(common_function.banner_tips({html_str:"再次点击选项卡即可刷新"}));
                
                window.localStorage.setItem("message_nav_banner_tips",0);    
            }
            else
            {
                _page_view.$el.find(".banner_tips").remove();
            }
		  
		    //未登录处理
			poco_id = common_function.get_local_poco_id()
			if(poco_id<=0)
			{ 
			    no_login_view_obj.show()  
			    
                _page_view.$el.find(".main_wraper").hide(); 
                
                _page_view.$el.find(".header").hide()
                
                is_login_tag = false

				return false
			}
            else
            {
				no_login_view_obj.hide()
				
                _page_view.$el.find(".main_wraper").show();
                
                _page_view.$el.find(".header").show()
                
                //control_no_data_page()
                
                if(!is_login_tag)
				{                
					common_function.get_poco_id(function(data)
					{      
						notice.reset_notice_by_data(data.notice_stat)
                        
                        console.log("login just now")
                        
                        notice.footer_notice_ui_refresh()
            
                        message_nav_view_obj.update_nav_num()                               
                        
                        user_list_collection_obj.refresh()   
					},true)                                        

					is_login_tag = true                                      
				}
				else
				{
					console.log("normal state")
                    
                    notice.footer_notice_ui_refresh()
            
                    message_nav_view_obj.update_nav_num()
                    
                    if(notice.get_unread_count_by_type("cmt")>0)
                    {
                        user_list_collection_obj.refresh()    
                    }
				}
                                
            }
            		              
            
		}
        

		//页面初始化时
		options.page_init = function(page_view,params_arr,params_obj)
		{
			_page_view = page_view
			_params_arr = params_arr
			_params_obj = params_obj
            
            poco_id = common_function.get_local_poco_id()
            
            // 未登录视图

            no_login_view = require('no_login')                        
            
            no_login_view_obj = new no_login_view()
            
            _page_view.$el.find('#noLogin').append(no_login_view_obj.$el)
			
			no_login_view_obj.hide()
			
             $(page_view.el).find('.no_login').height(common_function.container_height_with_head_and_nav())



            // 导航条
            message_nav_view = require('message_nav')
                        
            message_nav_view_obj = new message_nav_view
            ({
                cur_link_type : "cmt_notice",
                click_cur_nav:function(cur_nav)
                {                    
                    if(poco_id>0)
                    {
                       user_list_collection_obj.refresh() 
                    }   
                }
            })      
                               
            
		    _page_view.$el.find('.tab-select_container').append(message_nav_view_obj.$el)


			//容器滚动			
            var view_scroll = require('scroll')     
            
            var list_container = $(page_view.el).find('.main_wraper');
            
           
            
            _page_view.$el.find(".no_data").height(common_function.container_height_with_head_and_nav()-45)
															
			view_scroll_obj = view_scroll.new_scroll(list_container,{
				'view_height' : common_function.container_height_with_head_and_nav()
			})                                   
			
			user_list_view_obj = new user_list_view
			({
				el : $(page_view.el).find('.list-comment-item')
			});			      
					
			               	
			//刷新列表监听
			user_list_collection_obj.bind('reset', re_render_list , page_view)
			
			//加载更多监听
			user_list_collection_obj.bind('add', add_render_list , page_view)
			
			if(poco_id>0)
            {
                user_list_collection_obj.refresh()    
            }

		}
        
        function re_render_list()
		{
			var that = this;			        
			
			user_list_view_obj.clear_list()
			
			user_list_collection_obj.each(function(item_model)
			{
				
				// 过滤旧数据
				if(user_list_view_obj.filter_item_model(item_model))
				{
					
					return false;
				}
				
				var item_view = new user_list_item_view({ 
					model : item_model,
					tpl_type : "cmt"                
				})			            
				
				//每次add入列表
				user_list_view_obj.add_list_item(item_view) 
				
					
			})
					
			
			//滚回顶部
			view_scroll_obj.scroll_to(0)
            
            control_no_data_page()
		}
		
		function add_render_list(item_model)
		{	   
			// 过滤旧数据
			if(user_list_view_obj.filter_item_model(item_model))
			{
				return false;
			}
			
			var item_view = new user_list_item_view({ 
				model : item_model,
				tpl_type : "cmt"
			})         
			

			//每次add入列表
			user_list_view_obj.add_list_item(item_view)
		}
        
        function control_no_data_page()
        {
            var border_btm_len = _page_view.$el.find(".border-btm").length;
            var main_container = _page_view.$el.find(".main_container");
            var no_data = _page_view.$el.find(".no_data")
            
            if(border_btm_len<=0)
            {
                no_data.show();                
                main_container.hide()
            }
            else
            {
                no_data.hide();                
                main_container.show()
            }     
        }
		

		var page = require('page').new_page(options);
		
		return page;
	}
	
})

if(typeof(process_add)=="function")
{
	process_add()
}