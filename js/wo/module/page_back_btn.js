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