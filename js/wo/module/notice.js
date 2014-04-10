/**
  *	 通知消息模块
  *	 负责全局管理消息机制
  *  提供UI修改接口供外部使用
  *  2013.5.31  add by manson
  */
define("wo/module/notice", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var common_function = require('commom_function')
	
	var total						//总数
	
	var cmt_count					//新评论
	var normal_notice_count			//系统消息整合   	
    var be_like_count				//图片被喜欢
    var friend_news                 //好友动态
    var message_count               //私信数

	
	var have_friend_recommend = false
    var have_friend_news 
	 
 
	//每次定期获取通知数后 重置数据
	exports.reset_notice_by_data = function(notice_obj)
	{
		total = notice_obj.total || 0		
        cmt_count = notice_obj.cmt_group || 0
        be_like_count = notice_obj.like_group || 0        
        normal_notice_count = notice_obj.normal_group || 0
        friend_news = notice_obj.friend_news || 0
        message_count = notice_obj.private_message_group || 0

		this.footer_notice_ui_refresh()
	}
	

	//更新单项未读消息数
	exports.update_unread_status_by_type = function(type,special_count)
	{
	    var special_count = special_count || 0; 
        
		switch(type)
		{
		    case "message" :                 
                 total = total - special_count
				 message_count = message_count - special_count   
                 break;
			case "system":
				 
				 total = total - normal_notice_count
				 normal_notice_count = 0

				 break;
			case "cmt":
				 total = total - cmt_count
				 cmt_count = 0
				 break;
			case "belike":
				 total = total - be_like_count
				 be_like_count = 0
				 break;
			case "all":
				 total = 0
                 cmt_count = 0
				 be_like_count = 0				 
				 normal_notice_count = 0
                 message_count = 0
				 break;
		}

		this.footer_notice_ui_refresh()
	}
	
	
	exports.get_unread_count_by_type = function(type)
	{
		var count
		switch(type)
		{
		    case "message" : 
                 count = message_count
                 break;
			case "system":
				 //count = fans_count + be_like_count + article_recommend + get_medal + everyweek_new_user_article + everyweek_super_user
				 count = normal_notice_count
				 break;
			case "cmt":
				 count = cmt_count
				 break;
			case "belike":
				 count = be_like_count
				 break;
			case "all":
				 count = total
				 break;
		}
                

		return count
	}
	

	//更新显示底部通知数字
	exports.footer_notice_ui_refresh = function()
	{
		var num_obj = $("[data-footer_num]");

        if(total >0)
        {
            if(total >=100)
            {
                num_obj.find("[data-num_html]").html("···");
            }
            else
            {
                num_obj.find("[data-num_html]").html(total);
            }
            
            
            num_obj.show();
        }
        else
        {
            num_obj.hide()
        }
        
        this.footer_friends_red_point_ui_refresh()
		
		this.footer_my_point_ui_refresh()
        
        this.message_nav_num_refresh()
	}
	
    exports.footer_friends_red_point_ui_refresh = function()
    {
        //好友动态红点提示 2013.7.25 hdw
        
		var local_poco_id = common_function.get_local_poco_id()
        
        var is_read = this.get_footer_friends_red_points_is_read();
                                                            
		if(local_poco_id > 0 && friend_news > 0)
		{
			$('[data-footer_friend_point]').show()           
		} 
		else
		{
			
			$('[data-footer_friend_point]').hide()
		}
    } 
    
    exports.message_nav_num_refresh = function()
    {
        // 消息导航数字刷新
        
        var message_unread_count = this.get_unread_count_by_type("message")
        
        var cmt_unread_count = this.get_unread_count_by_type("cmt")
        
		var system_unread_count = this.get_unread_count_by_type("system")
        
        var belike_unread_count = this.get_unread_count_by_type("belike")
        
        var cur_message_num = $("[data-nav='message']").find(".num");
        
        var cur_comment_num = $("[data-nav='cmt_notice']").find(".num");
        
        var cur_belike_num = $("[data-nav='like_notice']").find(".num");
        
        var cur_notice_list_num = $("[data-nav='notice_list']").find(".num");        
        
        if(message_unread_count>0)
        {
            if(message_unread_count>99)
            {
                message_unread_count = '···'
            }
            
            cur_message_num.find('[data-num_html]').html(message_unread_count);
            cur_message_num.show();
        }
        else
        {
            cur_message_num.find('[data-num_html]').html(0);
            cur_message_num.hide();
        }                     
        
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
    }
    
    exports.set_footer_friends_red_points_is_read = function(val)
    {
        friend_news = val
    }
    
    exports.get_footer_friends_red_points_is_read = function(val)
    {
        return window.localStorage.getItem("is_read")
    }
    
    exports.get_friend_news = function()
    {
        return friend_news;
    }

    
    /*********************************************/

	exports.footer_my_point_ui_refresh = function()
	{
		//我的改版红点提示 add by manson 2014.1.23
		var local_poco_id = common_function.get_local_poco_id()
		
		if( window.localStorage.getItem("my_new_version_tips")!=1 && local_poco_id > 0)
		{
			$('[data-footer_my_point]').show()
		}
		else
		{
			$('[data-footer_my_point]').hide()
		}
	}

	exports.set_my_tips_close_storage = function(param)
	{
		window.localStorage.setItem("my_new_version_tips",param)
	}


	exports.set_recommend_tips_close_storage = function(param)
	{
		var local_poco_id = common_function.get_local_poco_id()

		if(param==true)
		{
			window.localStorage.setItem("recommend_tips_close_"+local_poco_id,1)
		}
		
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}