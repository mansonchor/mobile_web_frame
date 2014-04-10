/**
  *	 关注按钮
     hudw 2013.5.14   
  */
define('wo/module/follow_btn',["base_package","wo_config","commom_function","new_alert_v2"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    var wo_config = require('wo_config')
    var common_function = require('commom_function')
    var new_alert_v2 = require("new_alert_v2")
    
	function new_follow_btn()
	{
		var follow_btn_view =  Backbone.View.extend
		({
			tagName :  "span",
            className : "data-follow_btn",            
            status : '' ,
            other_follow_btn : {} ,                   			
			initialize : function(options)
			{
			    var that = this;
                var template = "";
                
				//这个按钮对应的user_id
				that.user_id = options.user_id
                that.status = options.status

				that.account_type = options.account_type || 0
    
                template = that.switch_tpl(options.status)
		        
				this.$el.html(template)
			},
			events :{
				'tap' : 'follow_action'
			},
            switch_tpl : function(status)
            {
                var none_tpl= '<span data-is_follow="1" class="ui-icon-add-wrap"><em class="ui-icon-add radius-2px fsn w-100 h-100 bgc-24b-2a8"><i class="icon-atten icon-add icon-bg-common"></i></em></span>'
                var both_tpl = '<span data-is_follow="0" class="ui-icon-item-wrap dib ml20 lh22 tc border-style-d2 f10 radius-2px"><em class="ui-icon-item radius-2px fsn"><i class="icon-atten icon-xh icon-bg-common"></i></em></span>'
                var follow_tpl= '<span data-is_follow="0" class="ui-icon-item-wrap dib ml20 lh22 tc border-style-d2 f10 radius-2px"><em class="ui-icon-item radius-2px fsn"><i class="icon-atten icon-yi icon-bg-common"></i></em></span>'
                var loading_tpl = '<span data-is_follow="0" class="ui-icon-item-wrap dib ml20 lh22 tc border-style-d2 f10 radius-2px"><em class="ui-icon-item radius-2px fsn"><i class="icon icon-bg-common icon-load"></i></em></span>'
                
                var template

                switch(status)
                {
                    case "both":
                         template = both_tpl;
                         break;
                    case "follow":
                         template = follow_tpl;
                         break;
                    case "none":
                         template = none_tpl;
                         break;
                    case "fans":
                         template = none_tpl;
                         break;
                    case "loading":
                         template = loading_tpl;
                         break;
              
                }     
                
                return template;                      
            },
			show : function()
			{
				this.$el.show()
			},
			hide : function()
			{
				this.$el.hide()
			},
            follow_action : function(success,error)
            {                
                var that = this;
                

                if(that.onload)
                {
                    return
                }
                
                that.onload = true;            
                
                var is_follow = that.$el.find("[data-is_follow]").attr("data-is_follow");
                
                that.reset_btn("loading")
                
				/*var account_type
				if(!that.account_type) 
				{
					account_type = false
				}
				else
				{
					account_type = that.account_type
				}*/
                
                var alert_tips

                common_function.send_request
                ({
                    url : wo_config.ajax_url.follow_user,
                    data : { user_id : that.user_id ,is_follow : is_follow ,account_type : that.account_type ,t : parseInt(new Date().getTime())}, 
                    callback : function(data)
                    {
                        
                        if(data.result == 1)
                        {                                                                 
                            
                            that.reset_btn(data.follow_status)
                            
                            if( data.follow_status == "follow" || data.follow_status == "both"   )
                            {                                
                                new_alert_v2.show({text:"关注成功",auto_close_time : 2000}); 
                            }
                            else if ( data.follow_status == "none" || data.follow_status == "fans")                    
                            {                                
                                new_alert_v2.show({text:"取消关注",type:"info",auto_close_time : 2000}); 
                            }                  
                            else if( data.follow_status == "no_permissions" )
                            {
                                new_alert_v2.show({text:"关注失败，你所关注的好友数已经达到上限",type:"info",auto_close_time : 2000});
                            }      
                            

                            if(that.options.other_follow_btn&&that.options.other_follow_btn.cid)
                            {
                                that.options.other_follow_btn.reset_btn(data.follow_status)   
                            }                                                                            
                            
                        }
                        
                        if(data.result == 0)
                        {
                            new_alert_v2.show({text:"操作失败",type:"info",auto_close_time : 2000}); 
                            
                            that.reset_btn(that.status)//还原状态
                        }
                        
                        if(typeof success == 'function')
                        {
                            success.call(this,data);                                                        
                        }
                        
                        that.onload = false;
                    },
                    error : function()
                    {
                        if(typeof error == 'function')
                        {
                            error.call(this);
                        }
                        
                        that.reset_btn(that.status)//还原状态
                        
                        that.onload = false;
                    }
                })                
            },
            reset_btn : function(status)
            {
                var that = this;
                
                var template = that.switch_tpl(status)
                
                
                                
                this.$el.parent().find(".data-follow_btn").html("")
                
                this.$el.html(template)
                
                
            }
		})

		return follow_btn_view
	}
	
	return new_follow_btn
})