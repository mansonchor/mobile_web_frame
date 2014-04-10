/**
  *	 消息导航模块
  *	 hdw
  *  2013.12.6
  */
define("wo/module/message_nav", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    var common_function = require('commom_function')
    var page_control = require('page_control')
    var notice = require('notice')

	var new_message_nav_view =  Backbone.View.extend
	({
		className : 'message_nav_container',			

		tpl_html : '<div class="message-nav radius-2px color666 border-style-be f14"><ul class="clearfix"><li class="bgc-fff-e6e" data-nav="message"><span class="txt"><label>私信</label><em class="num circle-oval-item" style="display:none"><i class="middle"><i class="inner"><i class="n font-arial fsn" data-num_html="">0</i></i></i></em></span></li><li class="bgc-fff-e6e" data-nav="cmt_notice"><span class="txt"><label>评论</label><span class="num circle-oval-item" style="display:none"><i class="middle"><i class="inner"><i class="n font-arial fsn" data-num_html="">0</i></i></i></span></span></li><li class="bgc-fff-e6e" data-nav="like_notice" class="be_like"><span class="txt"><label>被喜欢</label><span class="num circle-oval-item" style="display:none"><i class="middle"><i class="inner"><i class="n font-arial fsn" data-num_html="">0</i></i></i></span></span></span></li><li class="bgc-fff-e6e" data-nav="notice_list"><span class="txt"><label>通知</label><span class="num circle-oval-item" style="display:none"><i class="middle"><i class="inner"><i class="n font-arial fsn" data-num_html="">0</i></i></i></span></span></li></ul></div>',          		                
            
		events : 
		{		
		    'tap [data-nav]' : function(ev)
            {
                var that = this
                
                var cur_nav = $(ev.currentTarget).attr("data-nav");                                                       
                                
                
                if(cur_nav == that.cur_type)
                {                                                             
                    
                    if(typeof that.click_cur_nav == 'function')
                    {
                        that.click_cur_nav.call(this,cur_nav);
                    }
                }         
                else
                {
                    if(typeof that.click_other_nav == 'function')
                    {
                        that.click_other_nav.call(this,cur_nav);
                    }
                    
                    page_control.navigate_to_page(cur_nav)
                }
                                
            }  
		},
		initialize : function(options)
		{
			var that = this; 
            
            var options = options || {};
            
            that.click_cur_nav = options.click_cur_nav || function(){}
            that.click_other_nav = options.click_other_nav || function(){}
            that.cur_type = options.cur_link_type || "";
            
            that.__render();	
            
            that.set_link_type(that.cur_type)
                        
			
                        
                        					
		},
		__render : function()
		{                
			var that = this; 
			that.$el.append(that.tpl_html)
			
		},
        show : function()
        {
            var that = this;
            
            that.$el.show()
        },
        hide : function()
        {
            var that = this;
            
            that.$el.hide()
        },
        set_link_type : function(type)
        {
            var that = this;
            
            that.cur_type = type;
            
            that.$el.find("[data-nav]").removeClass("cur");
            
            that.$el.find("[data-nav='"+type+"']").addClass("cur");
            
            console.log("set_link_type")
        },
        update_nav_num : function()
        {            
            
            var that = this;
            
            notice.message_nav_num_refresh();
            
            /*
            
            var cmt_unread_count = notice.get_unread_count_by_type("cmt")
            
			var system_unread_count = notice.get_unread_count_by_type("system")
            
            var belike_unread_count = notice.get_unread_count_by_type("belike")
            
            var cur_message_num = that.$el.find("[data-nav='message']").find(".num");
            
            var cur_comment_num = that.$el.find("[data-nav='comment']").find(".num");
            
            var cur_belike_num = that.$el.find("[data-nav='belike']").find(".num");
            
            var cur_notice_list_num = that.$el.find("[data-nav='notice_list']").find(".num");                             
            
            if(cmt_unread_count>0)
            {
                if(cmt_unread_count>99)
                {
                    cmt_unread_count = '···'
                }
                
                cur_comment_num.find('[data-num_html]').html(cmt_unread_count);
                cur_comment_num.show();
            }
            else
            {
                cur_comment_num.find('[data-num_html]').html(0);
                cur_comment_num.hide();
            }
            
            if(system_unread_count>0)
            {
                if(system_unread_count>99)
                {
                    system_unread_count = '···'
                }
                
                cur_notice_list_num.find('[data-num_html]').html(system_unread_count);
                cur_notice_list_num.show();
            }
            else
            {
                
                cur_notice_list_num.find('[data-num_html]').html(0);
                cur_notice_list_num.hide();
            }
            
            if(belike_unread_count>0)
            {
                if(belike_unread_count>99)
                {
                    belike_unread_count = '···'
                }
                
                cur_belike_num.find('[data-num_html]').html(belike_unread_count);
                cur_belike_num.show();
            }
            else
            {
                cur_belike_num.find('[data-num_html]').html(0);
                cur_belike_num.hide();
            }
            
            */
        },
        clear_num : function()
        {
            var that = this;
            
            var cur_num = that.$el.find("[data-nav='"+that.cur_type+"']").find(".num");
            
            cur_num.find('[data-num_html]').html(0);
            cur_num.hide();
            
            var type = "";
            
            switch(that.cur_type)
            {
                case "message":
                     type = "message";
                     break;
                case "cmt_notice":
                     type = "cmt";
                     break;
                case "notice_list" :
                     type = "system"
                     break;
                case "like_notice" :
                     type = "belike"
                     break;   
            }
            
            notice.update_unread_status_by_type(type)
        }
	})

	return new_message_nav_view
        

})

if(typeof(process_add)=="function")
{
	process_add()
}