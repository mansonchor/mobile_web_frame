/**
  *	 用户授权页面
  *	 @author manson
  *  @version 2013.6.8
  */
define("wo/module/popup",["base_package",'frame_package',"commom_function","wo_config"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var page_control = require('page_control')
	var wo_config = require('wo_config')
	var cookies = require('cookies')
    
    var popup_view = Backbone.View.extend
    ({
        className : "popup_bg",
        initialize : function(options)
        {
            var that = this;
            
			var options = options || {}    
			var container = options.container || $('body');  
            
            var html_str = options.html_str || '';             

			//var html = '<div id="popup_container" style="position: absolute; top: 0px; z-index: 100000; left: 0px; width: 100%; height: 100%;background:rgba(0,0,0,0.5);display: table;"><div style="display:table-cell;vertical-align: middle;text-align: center;"><div class="radius-2px" style="width: 300px;height: 196px;background: #fff;margin: 0 auto;padding-top:15px;padding-bottom: 15px;"> <div style=" width: 270px; background: #ccc; height: 75px; margin: 0 auto 10px auto; "><img src="http://m.poco.cn/mobile/images/img-540x150.png" style="width:100%;height:100%"/></div> <div class="font_wryh" style=" width: 270px; margin: 0 auto; text-align: left; ">欢迎你使用  <span data-bind_nickname style="color:#58af28">'+name+'</span> 登录 世界·POCO拍客社区，在POCO相机的分享页，点击<i class="icon icon-poco icon-bg-common" style="width: 12px;  height: 12px; background-position:-68px -161px;display: inline-block;    overflow: hidden;margin: 0 2px;"></i>即可将作品同步 至世界·POCO拍客社区。</div> <div style=" width: 270px; margin: 11px auto 0 auto; text-align: left; "> <div class="ui-btn-register" data_to_my="" style=" width: 125px; height: 45px; display: inline-block; margin-right: 10px; font-weight: bold; "><span class="radius-2px"> 我的个人主页</span></div> <div class="ui-btn-close" data_to_close="" style=" width: 125px;  height: 45px; display: inline-block; font-weight: bold; "><span class="radius-2px">关闭窗口</span></div> </div> </div></div></div>'
            
            var html = html_str;

            this.$el.html(html)
            
            that.resize();
            
            $(window).bind('resize',function()
			{
				that.resize();                
			})   
            
            container.append(this.$el)
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
        resize : function()
        {
            var that = this;
            
            var bg_width = window.innerWidth;
            
            var bg_height = window.innerHeight;
            
            var popup_container = that.$el.children();
            
            popup_container.width(bg_width);
            
            popup_container.height(bg_height);
        }
    });
    

    exports.show_popup = function(options)
	{
		return new popup_view(options);        
        
	}
	
})

if(typeof(process_add)=="function")
{
	process_add()
}