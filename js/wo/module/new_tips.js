/**
  *	 弹出设置桌面框
  *	 hdw
  *  2013.5.23
  */
define("wo/module/new_tips", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var wo_config = require('wo_config')

	function new_tips(defaults)
	{
		var defaults = defaults || {}
		var new_tips_view =  Backbone.View.extend
		({			    		    
		    className : 'msg_tips',
			short_cuts_html : '<div data-msg-tips ><div class="add-pop-item radius-4px re font_wryh"> <div data-close_btn class="btn-close-wrap"><span class="btn-close radius-2px"><i class="icon-close icon-bg-common"></i></span></div> <b></b> <div class="table-class"> <table border="0" cellspacing="0" cellpadding="0"> <tr> <td width="50"><div class="mr10" style="width: 50px;height:50px;background:#fff"><img src="images/app_icon-114x114.png" style="width:100%;height:100%"/></div></td> <td> <p class="f14" style="margin-bottom:8px">添加<span class="fb ml5 mr5">世界</span>到桌面</p> <p>先点击“<span class="icon icon-bg-common"></span>”再“添加到主屏幕”</p> </td> </tr> </table> </div> </div></div>',          
			events :
			{
				'tap [data-close_btn]' : function()
				{
					var that = this;				

					that.close();	               

				}
			},
			initialize : function()
			{
				var that = this;
                
                if(that.get_clicked_val()==1)
				{
					return;
				}

				that.duration = defaults.duration || false;
               
				that.render();	 			

				//that.set_clicked_val(0)// 设置尚未点击标记 0
                 				
			},
			render : function()
			{
				var that = this;

				that.bg_style = "position: fixed;bottom: 24px;left: 0;height: 58px;width: 100%;z-index: 1000000;"

				that.$el.attr("style",that.bg_style)

				that.$el.append(that.short_cuts_html);

				$(".page_container").append(that.$el);
               
                that.$el.hide()
                                				
			},
			show : function(options)
			{
				var that = this;

				if(that.get_clicked_val()==1)
				{
					return;
				}

				var options = options || {},
					time_out = options.time_out || 100;
				
				if(time_out)
				{console.log(time_out)
					setTimeout(function()
						{
							that.$el.show()

						},time_out)
				}
				else
				{
					that.$el.show()
				}

				

				if(that.duration) 
				{
					setTimeout(function()
						{
							that.close();
						},that.duration)
				}

			},
			hide : function()
			{
				var that = this;

				that.$el.hide()
			},
			
			close : function()
			{
				var that = this;

				that.$el.remove(that.$el);

				that.set_clicked_val(1)// 设置尚已点击标记 1
               
                if(typeof callback == 'function')
				{
					callback.call(this);
				}
               
			},
			resize : function()
			{							

				var that = this;
				
			},
			set_clicked_val : function(tag)
			{
				window.localStorage.setItem("has_close_new_tips",tag);
			},
			get_clicked_val : function()
			{
				return window.localStorage.getItem("has_close_new_tips");
			}		
			
		})

		return new new_tips_view
	}
	
	return new_tips
})

if(typeof(process_add)=="function")
{
	process_add()
}