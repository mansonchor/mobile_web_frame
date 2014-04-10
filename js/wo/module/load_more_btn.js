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
			className : "more_btn_container data-more_btn",
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