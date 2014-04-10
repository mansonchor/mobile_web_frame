/*
    hdw 私信页面
*/
define("wo/message",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","notice","message_nav","no_login"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var wo_config = require('wo_config')
    var notice = require('notice')
    var new_alert_v2 = require("new_alert_v2")
    var Mustache = require('mustache')
	
	exports.route = { "message": "message" }

	exports.new_page_entity = function()
	{
		var options = {			
			title : "私信通知",
			route : { "message": "message" },
			transition_type : 'none'
		}
        
        var view_scroll_obj		
		var _params_arr
		var _page_view
        var _params_obj
		var message_nav_view_obj
        var message_nav_view
		var no_login_view   
        var no_login_view_obj
        var user_list_view_obj
		
		var request_url = ""
        
        var page_count = 20
        var is_unread_data
        
        var alert_tips
 
	
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
				var data = [];   
                
                alert_tips.close();                     
				
				is_unread_data = false

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
                
                // 清空当前导航右上数字
                //message_nav_view_obj.clear_num();
                
			},
			before_refresh : function()
			{
		      user_list_view_obj.more_btn_loading()
              
              alert_tips = new_alert_v2.show({text:"加载中",type : "loading",is_cover : false ,auto_close_time:false, append_target : _page_view.$el });
			},
			before_get_more : function()
			{
			  user_list_view_obj.more_btn_loading()
			}
		}
		
		
		
		//初始化数据
		var new_user_list_collection = require('user_list_collection')
		
		var user_list_collection_obj = new_user_list_collection({
			url : wo_config.ajax_url.message_notice,
			refresh : function()
			{				 			 
				common_function.collection_refresh_function.call(this,collection_options)
			},
			get_more_item : function()
			{
				var that = this    
								
				common_function.collection_get_more_function.call(this,collection_options)

			}
		})
        
        var message_notice_view = Backbone.View.extend
        ({
    		tag : "div",
    		className : "border-btm ",
            initialize : function(options) 
    		{          
    		    var options = options || {}
    			
    			this.model_data = options.model.attributes
    			
    			this.render()
    			
    
    		},
    		events : 
            {
                'tap [td_1]' : function()
                {
                    page_control.navigate_to_page("user_profile/" + this.model_data.user_id)
                },
    		    'tap [data-nav-to_msg_list]' : function()
                {
                    var that = this
                    
                    this.$el.find(".unread_count").hide();
                    
                    if(this.$el.hasClass("color999"))
                    {
                        this.$el.removeClass("color999")
                    }
                    
                    page_control.navigate_to_page("message_list/" + this.model_data.user_id,
                    {
                        state_tag : "from_message",
                        message_user_name : this.model_data.user_name,
                        unread_count : this.model_data.unread_count  
                    })
                }	
    		},
    		render : function()
            {
    			this.model_data.user_icon = common_function.matching_img_size(this.model_data.user_icon , "ms")
                
                this.has_unread = false;                                
                
                var sex_str = "";
                
                if(this.model_data.sex == "男")
                {
                    sex_str = "icon-male"; 
                }
                else if((this.model_data.sex == "女"))
                {
                    sex_str = "icon-female";
                }
    
    			var template = '<table border="0"cellspacing="0"cellpadding="0"><tr><td valign="top" width="42" td_1><div class="user-img"><img class="radius-2px" src="{{user_icon}}"></div></td><td data-nav-to_msg_list td_2 style="padding-right:10px;"><div class="be-like-item"><div data-td_2_top_content><div class="be-like-user-info clearfix"><span class="fl user-name lh16 color009 mr5" style="margin-bottom: 1px;">{{user_name}}</span><em data-sex_icon class="fl sex_icon icon-bg-common '+sex_str+'"></em></div><div class="message_content {{#is_read}}is_read{{/is_read}} {{^unread_count}}color999{{/unread_count}}">{{{content}}}</div></div></div></td><td data-nav-to_msg_list valign="bottom" width="60" td_3 align="center"><div class="unread_count" style="{{#unread_count}}display:inline-block;{{/unread_count}} margin-bottom: 1px;"><i class="n fsn">{{unread_count}}</i></div><div class="push_time">{{push_time}}</div></td></tr></table>'
    
    			var init_html = Mustache.to_html(template, this.model_data)
     
    			this.$el.html(init_html)
    		}
        })    
                    
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
            
            var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><div class="tab-select_container"></div></header><div id="noLogin"></div><div class="main_wraper"><div class="inside-page font_wryh" style="padding-top:45px;"><div style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);"></div></div><div class="main_container pb5"><div class="send_message fixed_scroll_blink" data-send_message_btn="" ><div class="re"><i class="icon-message icon-bg-common"></i><span style="display:block;margin-left:21px">发私信/送礼物</span></div></div><div class="list-comment-item list-comment-item-padding0 content-10 "></div></div></div></div><footer class="footer"></footer></div>'

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
            'tap [data-send_message_btn]' : function(ev)
            {
                page_control.navigate_to_page("get_friends_list/from_message");  
            },
            'tap .banner_tips' : function(ev)
            {
                var cur_btn = $(ev.currentTarget);
                
                cur_btn.remove();
                
                window.localStorage.setItem("message_nav_banner_tips",1);
            },
            'swipeleft' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{
					page_control.navigate_to_page("cmt_notice");
				}
			}
		}
		

		options.window_change = function(page_view)
		{
            $(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
		}
        
        var is_login_tag = true
        var poco_id
		options.page_before_show = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())


		    window.localStorage.setItem("nav_address","message");    
            
            if(window.localStorage.getItem("message_nav_banner_tips")!= 1&&_page_view.$el.find(".banner_tips").length<=0)
            {
                _page_view.$el.find(".main_container").prepend(common_function.banner_tips({html_str:"再次点击选项卡即可刷新"}));
                
                _page_view.$el.find(".banner_tips").css("margin","10px 10px")    
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
                
                _page_view.$el.find(".header").hide()
                
                _page_view.$el.find(".main_wraper").hide();                                
                
                is_login_tag = false

				return false
			}
            else
            {
                no_login_view_obj.hide()
                
                _page_view.$el.find(".main_wraper").show();
                
                _page_view.$el.find(".header").show()
                
                if(!is_login_tag)
				{                
					common_function.get_poco_id(function(data)
					{      
						notice.reset_notice_by_data(data.notice_stat)
                        
                        console.log("login just now")
                        
                        notice.footer_notice_ui_refresh()                                                                   
                        
                        user_list_collection_obj.refresh()   
					},true)                                        

					is_login_tag = true                                      
				}
				else
				{
					console.log("normal state")
                    
                    notice.footer_notice_ui_refresh()                                
                    
                    if(window.refresh_message)
                    {
                        user_list_collection_obj.refresh()
                        
                        window.refresh_message = false;
                    }
                    else
                    {
                        if(notice.get_unread_count_by_type("message")>0)
                        {
                            user_list_collection_obj.refresh()    
                        }    
                    }
                    
                    
				}
            }                        
            
            
		}
        
        // 列表视图
		var user_list_view = require('user_list_controler')

		//页面初始化时
		options.page_init = function(page_view,params_arr,params_obj)
		{
			_page_view = page_view
			_params_arr = params_arr
			_params_obj = params_obj
            
            window.refresh_message = false;
                        
            poco_id = common_function.get_local_poco_id()            
			
	         // 未登录视图

            no_login_view = require('no_login')                        
            
            no_login_view_obj = new no_login_view()
            
            _page_view.$el.find('#noLogin').append(no_login_view_obj.$el)
			
			no_login_view_obj.hide()		
			
			
            // 导航条
            message_nav_view = require('message_nav')
                        
            message_nav_view_obj = new message_nav_view
            ({
                cur_link_type : "message",
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
			var main_wraper = $(page_view.el).find('.main_wraper')
            
            $(page_view.el).find('.no_login').height(common_function.container_height_with_head_and_nav())

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head_and_nav()				
			})
            
            user_list_view_obj = new user_list_view
			({
				el : $(page_view.el).find('.list-comment-item')
			});
            
            user_list_view_obj.load_more_btn.$el.addClass("pr10 pl10");
			
			
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
				
				var item_view = new message_notice_view({ 
					model : item_model 					        
				})			            
				
				//每次add入列表
				user_list_view_obj.add_list_item(item_view) 
				
					
			})
					
			
			//滚回顶部
			view_scroll_obj.scroll_to(0)
            
		}
		
		function add_render_list(item_model)
		{	   						

			var item_view = new message_notice_view({ 
				model : item_model				
			})                
			
			//每次add入列表
			user_list_view_obj.add_list_item(item_view)   
	   
		}
        
        function control_no_data_page()
        {
            var border_btm_len = _page_view.$el.find(".border-btm").length;
            var main_wraper = _page_view.$el.find(".main_wraper");
            var no_data = _page_view.$el.find(".no_data")
            
            if(border_btm_len<=0)
            {
                no_data.show();                
                main_wraper.hide()
            }
            else
            {
                no_data.hide();                
                main_wraper.show()
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