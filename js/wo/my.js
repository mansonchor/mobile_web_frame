define("wo/my",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","notice","new_alert_v2","app_function"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	var notice = require('notice')
	var new_alert_v2 = require("new_alert_v2")
    var cookies = require('cookies')
	var app_function = require('app_function')

    exports.route = { "my": "my" }

	exports.new_page_entity = function()
	{
		var view_scroll_obj
		var user_info_obj
		var _page_view 
		var user_info_refresh_btn
		var manage_mode_tag = 0
        var alert_tips
        var manage_mode_time_tag = false
		var have_sign = false
		var have_check_load = false

		var options = {
			route : { "my": "my" },		
			transition_type : 'none'
		}
		
		options.initialize = function()
		{
			this.render();
		}
		
		var footer_view_obj
		options.render = function()
		{
			var template_control = require('get_template')

			var footer_view = require('footer_view')
			footer_view_obj = new footer_view({ cur : "my" })
			
			var template_obj = template_control.template_obj()
			
			var init_html = template_obj.my;        						

			this.$el.append($(init_html))
			
			this.$el.find('.ui-btn-publish').hide()

			//底部
			this.$el.find('.footer').append(footer_view_obj.$el)
		}
		
		options.events = {
			
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(_page_view.page_lock) return false
				if(page_control.page_transit_status()) return false
                
                user_info_refresh_btn.loadding();                                
                
				common_function.get_poco_id(function(data)
				{				    						
				    notice.reset_notice_by_data(data.notice_stat)
                    
                    update_my_notice_ui()
                    
                    
					common_function.set_show_my_wall(data.show_my_wall)
                    
                    user_info_refresh_btn.reset()    
				},true)

				check_sign()
			},
			//个人主页
			'tap [data-user_nav]' : function(event)
			{
				if(_page_view.page_lock) return false

				var user_id = common_function.get_local_poco_id()
				page_control.navigate_to_page("user_profile/"+user_id)
			},
			//退出
			'tap [data-logout_btn]' : function()
			{
				if(page_control.page_transit_status()) return false
				if(_page_view.page_lock) return false
				
                var confirm_str = "是否退出登录";
                
                if(confirm(confirm_str))
                {
                    _page_view.$el.find('.header').hide() 
                    
                    //真正退出处理
    				common_function.log_out()
    				
    				//界面切换
    				_page_view.$el.find('.no_login').show()
    				_page_view.$el.find('.main_wraper').hide()
    				//_page_view.$el.find('.no_authorize').hide()
					
                    _page_view.$el.find('.ui-btn-refresh').hide()
    				
    				
    				//重置消息通知数
    				notice.update_unread_status_by_type("all")
    					
    				is_login_tag = false
					have_sign = false
					double_tap_control = false
                    
                    window.localStorage.setItem("manage_mode",0)
                }
			},
			'tap [login_btn]' : function()
			{
				if(page_control.page_transit_status()) return false

				page_control.navigate_to_page("login")
			},
			'tap [data-to_edit]' : function()
			{
				if(_page_view.page_lock) return false    
					
				recalcula_notice("edit")
				
				page_control.navigate_to_page("edit")
			},
			'tap [data-to_my_grid]' : function()
			{
				if(_page_view.page_lock) return false   
				
                recalcula_notice("my_life_box")
                
				page_control.navigate_to_page("my_image_wall")
			},
			'tap [data-to_recommend]' : function(ev)
			{
				if(_page_view.page_lock) return false
				
				//recalcula_notice("new_come")

				page_control.navigate_to_page("recommend")
			},
			'tap [data-about_nav]' : function(ev)
            {
                if(_page_view.page_lock) return false
                
                recalcula_notice("about")

                page_control.navigate_to_page("about")
            },
            "tap [data-setup_nav]" : function()
			{
				if(_page_view.page_lock) return false
				
				recalcula_notice("setup")

				page_control.navigate_to_page("setup")
			},
			"tap [data-feedback_nav]" : function()
			{
				if(_page_view.page_lock) return false
                
                page_control.navigate_to_page("message_list/100100",
                {
                    state_tag : "from_my"
                })
			},
			"tap [data-to_my_world]" : function()
            {
                if(_page_view.page_lock) return false
                
                recalcula_notice("my_world")
                
                page_control.navigate_to_page("my_world");
            },
			//发布按钮
			'tap .ui-btn-publish' : function(ev)
            {
                var hash = location.hash.replace("#", "")

				var stat_img = new Image()
				stat_img.src = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/publish_btn?url_hash="+hash+"&tmp="+new Date().getTime()
				
                page_control.navigate_to_page("publish") 
            },
			
		    //我的钱包按钮
			'tap [data-to_my_wallet]' : function(ev)
            {	
                page_control.navigate_to_page("my_wallet") 
                
                recalcula_notice("my_wallet"); 
            },
			//签到按钮  add by manson 2014.1.21
			"tap .middle" : function()
			{
				start_sign()
			},
            "tap .header" : function()
            {                       
                if(manage_mode_time_tag)
                {
                    return;
                }                                
                
                manage_mode_tag ++;
                
                setTimeout(function()
                {                                        
                    manage_mode_tag = 0;
                    
                },3000)                                
                
                if(manage_mode_tag == 3)
                {                    
                    
                    if(window.localStorage.getItem("manage_mode") == null || parseInt(window.localStorage.getItem("manage_mode")) == 0)
                    {
                      common_function.send_request
                      ({
                            url: wo_config.ajax_url.check_is_admin,
            				data: 
                            {        					
            					t: parseInt(new Date().getTime())
            				},
            				callback: function(data)
                            {
                                
                                if(data.is_admin)
                                {
                                    console.log("manage_mode_start")
                                    
                                    alert_tips = new_alert_v2.show({ text:"管理员模式启动！",type : "info" ,auto_close_time : 1000})
                                    
            					    window.localStorage.setItem("manage_mode",1);                                                                            
                                    
                                    manage_mode_time_tag = true;
                
                                    setTimeout(function()
                                    {
                                        manage_mode_time_tag = false;
                                        
                                    },3000)
									

									app_function.app_switch_mode(function(response)
									{
										alert(response.mode)
									})
                                }
                                else
                                {
                                    window.localStorage.setItem("manage_mode",0);
                                }
                                
            				},
            				error: function() 
                            {
            					manage_mode_time_tag = false;    
            				}
                       })     
                    }
                    else
                    {
                        console.log("manage_mode_end")
                        
                        alert_tips = new_alert_v2.show({ text:"管理员模式关闭。。。",type : "info" ,auto_close_time : 1000})
                        
                        window.localStorage.setItem("manage_mode",0);
                        
                        manage_mode_time_tag = false;

                    }
                                        
                }    
                
            }
		}
		

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
		}
		

		//页面显示时
		var is_login_tag = true
		options.page_before_show = function(page_view)
		{ 
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())

			notice.footer_notice_ui_refresh()
			
			var poco_id = common_function.get_local_poco_id()            
                   

			if(poco_id==0)
			{
			    page_view.$el.find('.header').hide() 
			 
				page_view.$el.find('.no_login').show()
				
				page_view.$el.find('.main_wraper').hide().css('visibility','visible')
				page_view.$el.find('.ui-btn-refresh').hide()
				
				is_login_tag = false
			}
			else
			{   			       			     
			    page_view.$el.find('.header').show() 
			 
				page_view.$el.find('.no_login').hide()
				
				page_view.$el.find('.main_wraper').show().css('visibility','visible')
				page_view.$el.find('.ui-btn-refresh').show()
				
				if(!is_login_tag)
				{            
					common_function.get_poco_id(function(data)
					{      
						notice.reset_notice_by_data(data.notice_stat)
                        
						update_my_notice_ui()

						//检查签到  add by manson 2014.1.21
						check_sign()
					},true)                                        

					is_login_tag = true                                      
				}
				else
				{
					update_my_notice_ui()
				}   
			}
		}
		
		//页面初始化时
		options.page_init = function(page_view)
		{
			var that = this
			
			_page_view = page_view		
			

			notice.set_my_tips_close_storage(1)

			//刷新按钮  add by manson 2013.5.7
			user_info_refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(user_info_refresh_btn.$el)
			
			
			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head_and_nav()
			})

			page_view.$el.find('.no_login').css('height',common_function.container_height_with_head_and_nav()) 
			page_view.$el.find('.no_authorize').css('height',common_function.container_height_with_head_and_nav())

			
			// 红色最新消息设置，初始化通知小时数据
            update_my_notice_ui()
			
			//检查签到  add by manson 2014.1.21
			check_sign()
		}
		

		function check_sign()
		{
			var poco_id = common_function.get_local_poco_id()
			
			if(common_function.is_empty(poco_id)) return false

			common_function.send_request({
				
				url : "http://m.poco.cn/mobile/action/to_sign_in.php",
				data : { sign_tag : 'check'},
				callback : function(data)
				{
					have_check_load = true
					
					var inner = _page_view.$el.find('[sign_inner]')
					var btn_icon = _page_view.$el.find('[btn_icon]')
					var btn_txt = _page_view.$el.find('[btn_txt]')
					var sign_tips_1 = _page_view.$el.find('[sign_tips_1]')
					var sign_tips_2 = _page_view.$el.find('[sign_tips_2]')
					var color_control = _page_view.$el.find('[color_control]')

					if(data.sign == 0)
					{
						have_sign = false

						color_control.removeClass('color999').addClass('color666')

						inner.removeClass('sign-inner-finish').addClass('sign-inner')
						
						btn_icon.removeClass('icon-finish').addClass('icon-bg-common')
						btn_txt.html('开始签到')
					}
					else
					{
						have_sign = true
						
						color_control.removeClass('color666').addClass('color999')
						btn_icon.addClass('icon-bg-common icon-finish')
						
						inner.removeClass('sign-inner').addClass('sign-inner-finish')

						btn_txt.html('签到完成')
					}
					
					sign_tips_1.html(data.tips_1)
					sign_tips_2.html(data.tips_2)
				}
			}) 
		}
		
		var double_tap_control = false
		function start_sign()
		{
			if(!have_check_load) return

			if(have_sign)
			{
				//new_alert_v2.show({ text:"签到已完成，明天再来吧",  auto_close_time : 1000})
				return
			}
			
			if(double_tap_control) return
			double_tap_control = true


			common_function.send_request({
				url : "http://m.poco.cn/mobile/action/to_sign_in.php",
				data : { sign_tag : 'sign'},
				callback : function(data)
				{
					var inner = _page_view.$el.find('.sign-inner')
					var btn_icon = _page_view.$el.find('[btn_icon]')
					var btn_txt = _page_view.$el.find('[btn_txt]')
					var sign_tips_1 = _page_view.$el.find('[sign_tips_1]')
					var sign_tips_2 = _page_view.$el.find('[sign_tips_2]')
					var color_control = _page_view.$el.find('[color_control]')

					if(data.sign == 1)
					{
						have_sign = true
                        
						btn_icon.addClass('icon-finish')
						btn_txt.html('签到完成')

						inner.removeClass('sign-inner').addClass('sign-inner-finish')

						sign_tips_1.html(data.tips_1)
						sign_tips_2.html(data.tips_2)
						
						color_control.removeClass('color666').addClass('color999')
					}
					else
					{
						new_alert_v2.show({ text:"签到失败",type : "info" ,auto_close_time : 1000})
					}
				},
				error : function()
				{
					double_tap_control = false
				}
			}) 
		}


		function recalcula_notice(type)
		{
			switch(type)
			{
				case "cmt":
					 _page_view.$el.find('[data-cmt-msg] .num').hide()
					 break;
				case "system":
					 _page_view.$el.find('[data-belike-msg] .num').hide()
					 break;
				case "new_come":
					 _page_view.$el.find('[data-friend-msg] .num').hide()
					 
					 //好友推荐点提示
					 _page_view.$el.find('.data-my_recommend_point').hide()	
					 break;
				case "edit":
					 _page_view.$el.find('.data-edit_point').hide()
					 break;
                case "my_life_box":
                     _page_view.$el.find('.data-my_grid_point').hide()
                     break;
                case "setup":
                     _page_view.$el.find('.data-setup_point').hide()
                     break;
                case "about":
                     _page_view.$el.find('.data-about_point').hide()
                     break;
                case "my_wallet":
                     _page_view.$el.find('[data-mywallet_point]').hide()
                     break;
                case "my_world":
                     _page_view.$el.find('.data-world_point').hide()
                     break;
			}

			notice.update_unread_status_by_type(type)
		}
		
		function update_my_notice_ui()
		{                        
            //set_item_show_new("my_wallet",_page_view.$el.find('[data-mywallet_point]'));
            set_item_show_new("my_world",_page_view.$el.find('.data-world_point'));
		}
		
		function set_item_show_new(key,obj)
		{
		    var key_tips = window.localStorage.getItem(key)
            
            if(common_function.is_empty(key_tips))
            {
                obj.show()
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