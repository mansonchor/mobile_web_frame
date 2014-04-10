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