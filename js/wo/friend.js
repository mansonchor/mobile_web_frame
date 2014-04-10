define("wo/friend",["base_package",'frame_package',"btn_package","wo_config","commom_function","get_template","footer_view","notice","new_alert_v2","world_list_module"],function(require, exports)
{
	var $ = require('zepto')
	var wo_config = require('wo_config')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
	var notice = require('notice')
    var cookies = require('cookies')
	
    var cookie_duration = 24*3				//3天cookie
	
	exports.route = { "friend": "friend" }

	exports.new_page_entity = function()
	{
		var options = {
			title : "好友照片",
			route : { "friend": "friend" },		
			transition_type : 'none'        
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

			var footer_view = require('footer_view')
			footer_view_obj = new footer_view({ cur : "friend" })
			            
            
			var template_obj = template_control.template_obj()		        
			
			var init_html = template_obj.friends;            
							
			that.$el.append($(init_html))

			//底部
			that.$el.find('.footer').append(footer_view_obj.$el)
		}
		
		options.events = {
			
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false				                                                                
                
                world_list_module_obj.start_reset()
			},
			'tap [data-to_login]' : function(ev)
			{
				//if(page_control.page_transit_status()) return false
                
                var login_type = $(ev.currentTarget).attr("data-to_login");        
				
				var url_form_frineds = common_function.get_target_refresh_url_by_hash_name('recommend')

				page_control.navigate_to_page("login/" + login_type,{ url_form_frineds : url_form_frineds });
			},            
			'tap .login_btn' : function(ev)
			{
				//if(page_control.page_transit_status()) return false

				page_control.navigate_to_page("login");
			},
			'tap .ui-btn-user-wrap' : function()
			{
				//if(page_control.page_transit_status()) return false

				page_control.navigate_to_page("dating_list")
			},			
            'tap [data-select_firend_type]' : function(ev)
            {
                var cur_type = $(ev.currentTarget).attr("data-select_firend_type");                           
                                
                if(cur_type == 'news')
                {
                    page_control.navigate_to_page("news")
                }                              
            },
            'tap .btn-close-wrap' : function(ev)
            {
                cur_page_view.find("[data-friends_tips]").hide();            
                
                cookies.writeCookie("world_fri_spread_not_show_"+poco_id,1,cookie_duration,'poco.cn', '/')
            },
            'tap .tigs-item .txt' : function()
            {
                page_control.navigate_to_page("recommend")
            },
            'tap [data-find_boys]' : function()
            {
                //window.localStorage.setItem("select_sex","男"); 
                page_control.navigate_to_page("dating_game/1")
            },
            'tap [data-find_girls]' : function()
            {
                //window.localStorage.setItem("select_sex","女"); 
                page_control.navigate_to_page("dating_game/0")
            }
			
		}

		
		var is_login_tag
		var last_login_id = 0
        var poco_id
		var world_list_module_obj

		//页面显示时
		options.page_before_show = function(page_view,params_arr)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())

			//记录切换tab  add  2013.6.18
			footer_view_obj.change_friend_tab_select("friend")

			notice.footer_notice_ui_refresh()
		   
			poco_id = common_function.get_local_poco_id();

			var main_wraper = $(page_view.el).find('.main_wraper')                            
            
            if($(page_view.el).find(".item-act").length>0)
            {
                $(page_view.el).find('.no_data').hide();    
            }            

			if(poco_id==0)
			{
			    //滚回顶部
	       		view_scroll_obj.scroll_to(0) 
				
			    page_view.$el.find('.friend-act').css("padding","0") 
			     
                page_view.$el.find('.friend-dating-port').show();                  
				
				page_view.$el.find('.friend-act').show()
                
                page_view.$el.find('.friend_ori').hide()

				//隐藏头部操作按钮
				$(page_view.el).find(".ui-btn-user-wrap").hide()
				$(page_view.el).find(".ui-btn-refresh-wrap").hide()
                $(page_view.el).find(".tab-select").hide()
				$(page_view.el).find(".header_title").html("好友动态")

				is_login_tag = false
				last_login_id = 0
			}
			else
			{
			    page_view.$el.find('.friend-dating-port').hide();      
			 
			    page_view.$el.find('.header').show() 
			    page_view.$el.find('.friend-act').css("padding","45px 10px 0 10px") 
			     
				if(last_login_id != poco_id) 
				{
					page_view.$el.find('.friend-act').show()
                    page_view.$el.find('.friend_ori').show()
					
					world_list_module_obj.start_reset()
					
					is_login_tag = true             
				}                                
                
				
                if(parseInt(notice.get_friend_news())>0)
                {    
					world_list_module_obj.start_reset()  
                }
                
                show_friends_tips()
                                
				
				//解决多个帐号反复登录旧数据问题
				last_login_id = poco_id
				
				$(page_view.el).find(".ui-btn-user-wrap").show();
				$(page_view.el).find(".ui-btn-refresh-wrap").show();
                $(page_view.el).find(".tab-select").show()
                $(page_view.el).find(".header_title").html("")
			}
		}
			
		var view_scroll_obj
		var friend_list_collection_obj    
		var cur_page_view
		var _params_arr
		var friend_list_view_obj
		var friend_refresh_btn
        var _page_view
		

		//页面初始化时
		options.page_init = function(page_view,params_arr)
		{
			_page_view = page_view

			cur_page_view = $(page_view.el);        
			_params_arr = params_arr;
			
			friend_refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(friend_refresh_btn.$el)
			
			var view_scroll = require('scroll')                    
			
			var list_container = $(page_view.el).find('.main_wraper');
			
			view_scroll_obj = view_scroll.new_scroll(list_container,{
				'view_height' : common_function.container_height_with_head_and_nav(),
				use_lazyload : true
			})    
			
        
			page_view.$el.find('.no_authorize').css('height',common_function.container_height_with_head_and_nav())

			
			var world_list_module = require('world_list_module')()
			world_list_module_obj = new world_list_module({ 
				url : wo_config.ajax_url.friend,
				list_type : "big_img_list",
				page_count : 10,
				main_container : $(page_view.el).find('.actbox-item'),
				page_view : page_view.$el.find('.wrap-box'),
				oncomplete : function()
				{
					friend_refresh_btn.reset()
				},
				onloading : function()
				{
					friend_refresh_btn.loadding()
				},
				onreset : function()
				{
					//红点消失
					notice.set_footer_friends_red_points_is_read(0)   
					notice.footer_friends_red_point_ui_refresh()


					//滚回顶部
					view_scroll_obj.scroll_to(0)
					_page_view.$el && _page_view.$el.find('header').animate({'translate3d':'0px, 0px, 0px'},0,'ease-in')
					

					//翻页PV统计  add by manson 2013.7.31
					common_function.page_pv_stat_action()
				}
			})
		}
		
		function show_friends_tips()
		{	
		    var count = 0
            
            var poco_id = common_function.get_local_poco_id()
            
            var world_fri_spread_not_show = cookies.readCookie("world_fri_spread_not_show_"+poco_id)
            
            cur_page_view.find("[data-friends_tips]").hide(); 
            
		    if(!world_fri_spread_not_show)// cookie 过期
            {                   
                cur_page_view.find("[data-zero_friends]").hide()
                cur_page_view.find("[data-no_more_ten_friends]").hide()                
                
                common_function.send_request
                ({
                    url : wo_config.ajax_url.get_user_follow_count,
                    callback : function(data)
                    {
                        var count = data.follow_count
                        
                        if(count >= 10)
                        {
                            cookies.writeCookie("world_fri_spread_not_show_"+poco_id,1,cookie_duration,'poco.cn', '/');    
                        }                                                
                        else if(count < 10 && count > 0)
                        {
                            cur_page_view.find("[data-friends_tips]").show(); 
                            
                            cur_page_view.find("[data-no_more_ten_friends]").show();
                            
                            cur_page_view.find("[data-no_more_ten_friends] .count").html(10-count);
                        }  
                        else if(count == 0)
                        {
                            cur_page_view.find("[data-friends_tips]").show(); 
                            
                            cur_page_view.find("[data-zero_friends]").show();
                        }                        
                    }
                })
                                
            }
            else
            {
                cur_page_view.find("[data-friends_tips]").hide();
            }
			                        
		}
		
		/*options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
			$(page_view.el).find('.item-act .img img').css({height:'auto'})
		}*/
        

		var page = require('page').new_page(options);
		
		return page;
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}