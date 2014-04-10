/**
  *	 用户授权页面
  *	 @author manson
  *  @version 2013.6.8
  */
define("wo/module/user_authorize",["base_package",'frame_package',"commom_function","wo_config"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var page_control = require('page_control')
	var wo_config = require('wo_config')
	var cookies = require('cookies')
	     

    // 列表视图
    var user_authorize_view = Backbone.View.extend
    ({        
		className : "content-25 no_authorize",
        initialize : function(options)
        {
			var options = options || {}

			this.auth_callback = options.auth_callback


			var html = '<div class="me-page-nologin font_wryh"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td align="left"><p style="font-size:14px;text-align: center;">国内最优秀的手机生活图片社区，你还在等什么？加入我们，拍遍世界精彩。</p><div class="ui-btn-register mt20" ><span class="radius-2px">马上加入</span></div><p style="margin-top:20px;color:#aaa;text-align: center;">加入后你在其它平台的POCO相机照片会在此显示</p></td></tr></tbody></table></div>'

            this.$el.html(html)

			this.$el.hide()
        },
		authorize_show : function()
		{
			this.$el.show()
		},
		authorize_hide : function()
		{
			this.$el.hide()
		},
		events : 
		{
			//同意授权
			'tap .ui-btn-register' : function(ev)
			{
				var that = this
                
                var cur_btn = $(ev.currentTarget)

				var poco_sns_psid = cookies.readCookie('poco_sns_psid')
				var poco_sns_appname = cookies.readCookie('poco_sns_appname')
                
                if(that.clicked)
                {
                    return;
                }
                
                that.clicked = true;
                
                cur_btn.find("span").text("马上加入...")                                

				common_function.send_request
				({
					url : wo_config.ajax_url.accept_auth,
					data : { poco_sns_psid : poco_sns_psid , poco_sns_appname : poco_sns_appname},
					callback : function(result)
                    {
                        if(typeof that.auth_callback == 'function')
                        {
                            that.auth_callback.call(this,result);
                        
                            that.clicked = false;
                        
                            cur_btn.find("span").text("马上加入")    
                        }
                                                
                    },
                    error : function()
                    {
                        that.clicked = false;
                        
                        cur_btn.find("span").text("马上加入")
                    }
				})
			}
		}
    })
    
    var popup_view = Backbone.View.extend
    ({
        className : "popup_bg",
        initialize : function(options)
        {
            var that = this;
            
			var options = options || {}                        
            
            var name = options.name || "";                        

			var html = '<div id="popup_container" style="position: absolute; top: 0px; z-index: 100000; left: 0px; width: 100%; height: 100%;background:rgba(0,0,0,0.5);display: table;"><div style="display:table-cell;vertical-align: middle;text-align: center;"><div class="radius-2px" style="width: 300px;height: 196px;background: #fff;margin: 0 auto;padding-top:15px;padding-bottom: 15px;"> <div style=" width: 270px; background: #ccc; height: 75px; margin: 0 auto 10px auto; "><img src="http://m.poco.cn/mobile/images/img-540x150.png" style="width:100%;height:100%"/></div> <div class="font_wryh" style=" width: 270px; margin: 0 auto; text-align: left; ">欢迎你使用  <span data-bind_nickname style="color:#58af28">'+name+'</span> 登录 世界·POCO拍客社区，在POCO相机的分享页，点击<i class="icon icon-poco icon-bg-common" style="width: 12px;  height: 12px; background-position:-68px -161px;display: inline-block;    overflow: hidden;margin: 0 2px;"></i>即可将作品同步 至世界·POCO拍客社区。</div> <div style=" width: 270px; margin: 11px auto 0 auto; text-align: left; "> <div class="ui-btn-register" data_to_my="" style=" width: 125px; height: 45px; display: inline-block; margin-right: 10px; font-weight: bold; "><span class="radius-2px"> 我的个人主页</span></div> <div class="ui-btn-close" data_to_close="" style=" width: 125px;  height: 45px; display: inline-block; font-weight: bold; "><span class="bgc-fff-e6e radius-2px">关闭窗口</span></div> </div> </div></div></div>'

            this.$el.html(html)
            
            that.resize();
            
            $(window).bind('resize',function()
			{
				that.resize();                
			})   
            
            $('body').append(this.$el)
            

        },
        show: function()
        {
            var that = this;        
            
            that.$el.show();
        },
        close : function()
        {
            var that = this;
            
            that.$el.remove();
        },
        events :
        {
            //链接去用户
			'tap [data_to_my]' : 'navigate_to_my',
			//链接去作品
			'tap [data_to_close]' : 'navigate_to_close'           
        },
        resize : function()
        {
            var that = this;
            
            var bg_width = window.innerWidth;
            
            var bg_height = window.innerHeight;
            
            var popup_container = that.$el.find("#popup_container");
            
            popup_container.width(bg_width);
            
            popup_container.height(bg_height);
        }
        ,
        navigate_to_my : function()
        {
            var that = this;
            
            that.close();
            
			var local_poco_id = common_function.get_local_poco_id()
            page_control.navigate_to_page("user_profile/"+local_poco_id)
        },
        navigate_to_close : function()
        {
            var that = this;
            
            that.close();
        }
    });
    

    exports.show_popup = function(options)
	{
		return new popup_view(options);        
        
	}
    

	exports.init_user_authorize_view = function(options)
	{
		return new user_authorize_view(options)
	}

	
})