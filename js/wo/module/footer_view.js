define("wo/module/footer_view",["base_package",'frame_package',"wo_config","commom_function","get_template","notice"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    var wo_config = require('wo_config')
    var common_function = require('commom_function')
	var page_control = require('page_control')
    var notice = require('notice')

	var friend_tab_select = "friend"

	var new_footer_view =  Backbone.View.extend
	({
		tagName :  "div",
		//friend_tab_select : "friend",
		initialize : function(options)
		{
			var options = options || {}
			var cur = options.cur || "index"

			var template_control = require('get_template')
	
			var template_obj = template_control.template_obj()
			
			var footer_html = template_obj.footer

			this.$el.html(footer_html)
            
            this.cur = cur;
			
			this.$el.find('[data-nav="'+cur+'"]').addClass('cur')
			                                    

		},
		events : {
			'tap [data-nav="index"]' : function()
			{			     
				page_control.navigate_to_page("index")                
                
			},
			'tap [data-nav="ground"]' : function()
			{			    
				page_control.navigate_to_page("ground")                        
			},
			'tap [data-nav="focus"]' : function()
            {   
                var nav_address = window.localStorage.getItem("rank_nav_address");             
                
                page_control.navigate_to_page(nav_address)    
                
            },
			'tap [data-nav="friend"]' : function()
			{		
				if(friend_tab_select=="friend")
				{
					page_control.navigate_to_page("friend")    
				}
				else if(friend_tab_select=="news")
				{
					page_control.navigate_to_page("news")
				}
				                             
			},
            'tap [data-nav="message_port"]' : function()
			{			    
			 
			    var nav_address = window.localStorage.getItem("nav_address");
                
                var message_unread_count = notice.get_unread_count_by_type("message")
                
                var cmt_unread_count = notice.get_unread_count_by_type("cmt")
            
		        var system_unread_count = notice.get_unread_count_by_type("system")
            
                var belike_unread_count = notice.get_unread_count_by_type("belike")                                
                
                if(message_unread_count>0)                  
                {
                    nav_address = "message"
                }
                else if(cmt_unread_count>0)
                {
                    nav_address = "cmt_notice"
                }                
                else if(belike_unread_count>0)
                {
                    nav_address = "like_notice"
                }                
                else if(system_unread_count>0)
                {
                    nav_address = "notice_list"
                }                                
                 
				page_control.navigate_to_page(nav_address) 
                          
			},
			'tap [data-nav="my"]' : function()
			{			    
				page_control.navigate_to_page("my") 
                          
			},
			'tap [data-nav="publish"]' : function()
			{		
				var hash = location.hash.replace("#", "")

				var stat_img = new Image()
				stat_img.src = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/publish_btn?url_hash="+hash+"&tmp="+new Date().getTime()

				var login_requirement = common_function.publish_login_requirement()
				if(login_requirement)
				{
					page_control.navigate_to_page("login") 
				}
				else
				{
					page_control.navigate_to_page("publish") 
				}
			}
		},
		change_friend_tab_select : function(tab)
		{
			if(tab=="news")
			{
				var set_tab = "news"
			}
			else
			{
				var set_tab = "friend"
			}

			friend_tab_select = set_tab
		}
	})
	
	return new_footer_view
})

if(typeof(process_add)=="function")
{
	process_add()
}