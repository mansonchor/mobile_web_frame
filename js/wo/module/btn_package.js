/**
  *	 列表加载更多按钮
  *	 @author Manson
  *  @version 2013.5.7
  */
define("wo/module/load_more_btn", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')

	function new_more_btn()
	{
		
		var more_btn_view =  Backbone.View.extend
		({
			tagName :  "div",
			className : "more_btn_container data-more_btn pb15",
			reset_html : '<div class="btn-more  mt10 tc ui-btn-more">加载更多</div>',
			cmt_reset_html : '<div class="btn-more  mt10 tc ui-btn-more">查看历史消息</div>',
			loadding_html : '<div class="btn-more  mt10 tc ui-btn-more"><span class="icon-bg-common loading-icon"></span>正在加载...</div>',
			initialize : function()
			{
				this.$el.html(this.reset_html)

				this.$el.hide()
			},
			show : function()
			{
				this.$el.show()
			},
			hide : function()
			{
				this.$el.hide()
			},
			loadding : function()
			{
				this.$el.html(this.loadding_html)
			},
			reset : function()
			{
				this.$el.html(this.reset_html)
			},
			cmt_reset : function()
			{
				this.$el.html(this.cmt_reset_html)
			}
		})

		return new more_btn_view
	}
	
	return new_more_btn
})


define("wo/module/paging_btn", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')

	function new_paging_btn()
	{
		var paging_btn =  Backbone.View.extend
		({
			tagName :  "div",
			className : "more_btn_container pb15",
			paging_html : '<div class="paging_btn_wrap pre_paging_btn"><section class="paging_btn mr5"><<上一页</section></div><div class="paging_btn_wrap next_paging_btn"><section class="paging_btn ml5">下一页>></section></div>',
			initialize : function()
			{
				this.$el.html(this.paging_html)

				this.botn_side_btn = this.$el.find('.paging_btn')
				this.pre_btn = this.$el.find('.paging_btn').eq(0)
				this.next_btn = this.$el.find('.paging_btn').eq(1)

				this.pre_ban = true
				this.next_ban = false

				this.$el.hide()
			},
			show : function()
			{
				this.$el.show()
			},
			hide : function()
			{
				this.$el.hide()
				
				console.log('hide')
			},
			loadding : function()
			{
				this.botn_side_btn.css('color','#ccc')
			},
			reset : function()
			{
				this.botn_side_btn.css('color','')
				this.pre_ban = false
				this.next_ban = false
			},
			get_pre_page_btn_ban_mode : function()
			{
				return this.pre_ban
			},
			get_next_page_btn_ban_mode : function()
			{
				return this.next_ban
			},
			ban_pre_page_btn : function()
			{
				this.pre_ban = true
				this.pre_btn.css('color','#ccc')
				//this.pre_btn.html('没有啦')

				if(this.next_ban) this.hide()


				console.log(this.next_ban)
			},
			ban_next_page_btn : function()
			{
				this.next_ban = true
				this.next_btn.css('color','#ccc')
				//this.next_btn.html('没有啦')

				if(this.pre_ban) this.hide()

				console.log(this.pre_ban)
			},
			open_next_page_btn : function()
			{
				this.next_ban = false
				this.next_btn.css('color','')
				
				this.show()
			},
			open_pre_page_btn : function()
			{
				this.pre_ban = false
				this.pre_btn.css('color','')
				
				this.show()
			}
		})
		
		return new paging_btn
	}

	return new_paging_btn
})


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
      
    var page_control = require('page_control')
    
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

				that.account_type = options.account_type || "world"    
                
                that.click_callback = options.click_callback || function(){}                                          
    
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
                    case "no_permissions":
					case "logout":
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
                
                var poco_id = common_function.get_local_poco_id();
                
                if(poco_id == 0)
                {
                     var img = new Image();
                
                     img.src = 'http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/follow_btn?account_type='+that.account_type+'&is_login=0&tmp=1380507066930'
                     
                     console.log('http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/follow_btn?account_type='+that.account_type+'&is_login=0&tmp=1380507066930')
                    
                     page_control.navigate_to_page("login")
                     
                     return;
                }    

                if(that.onload)
                {
                    return
                }
                
                that.onload = true;
                
                var img = new Image();
                
                img.src = 'http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/follow_btn?account_type='+that.account_type+'&is_login=1&tmp=1380507066930'            
                
                console.log('http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/follow_btn?account_type='+that.account_type+'&is_login=1&tmp=1380507066930')
                
                var is_follow = that.$el.find("[data-is_follow]").attr("data-is_follow");
                
                that.reset_btn("loading")
                
                
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
                        
                        if(typeof that.click_callback == 'function')
                        {
                            that.click_callback.call(this,data);                                                        
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


/**
  *	 页面返回按钮
  *	 2013.7.19 hdw
  */
define('wo/module/page_back_btn',['base_package','frame_package','cookies'],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var cookies = require('cookies')
	var page_control = require('page_control')


	function page_back_btn()
	{
		var page_back_btn_view =  Backbone.View.extend
		({
			tagName :  "div",
			className : "ui-btn-header-wrap ui-btn-prev-wrap",
			initialize : function()
			{
				var page_history_arr = page_control.page_history()
				
				if(page_history_arr <= 1)
				{
					var html = '<div class="ui-btn-header ui-btn-prev radius-2px" ><span class="icon icon-home icon-bg-common"></span></div>'
					this.$el.html(html)
				}
				else
				{
					var is_embedded = cookies.readCookie('cok_framename')
			
					if(is_embedded==null || is_embedded=="")
					{
						var html = '<div class="ui-btn-header ui-btn-prev radius-2px" ><span class="icon icon-arrow icon-bg-common"></span></div>'
						this.$el.html(html)
					}
				}
			}
		})

		return new page_back_btn_view
	}
	
	return page_back_btn
})


/**
  *	 导航右侧刷新按钮
  *	 @author Manson
  *  @version 2013.5.7
  */
define('wo/module/refresh_btn',['base_package'],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')

	function new_refresh_btn()
	{
		var refresh_btn_view =  Backbone.View.extend
		({
			tagName :  "div",
			className : "ui-btn-header-wrap ui-btn-refresh-wrap",
			initialize : function()
			{
				var html = '<div class="ui-btn-header ui-btn-refresh radius-2px"><span class="icon icon-refresh icon-bg-common"></span></div>'

				this.$el.html(html)
			},
			loadding : function()
			{
				var inner_span = this.$el.find('span')
				inner_span.removeClass('icon-refresh')
				inner_span.addClass('icon-load')
                                
			},
			reset : function()
			{
				var inner_span = this.$el.find('span')
				inner_span.removeClass('icon-load')
				inner_span.addClass('icon-refresh')
			}
		})

		return new refresh_btn_view
	}
	
	return new_refresh_btn
})

if(typeof(process_add)=="function")
{
	process_add()
}