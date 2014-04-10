define("frame/page",["ua",'base_package'],function(require, exports)
{
	var $ = require('zepto')
	var ua = require('ua')
	
	//add by manson 2013.5.19底层事件绑定调整
	require('hammer')($)
	$(document.body).hammer({ swipe_velocity : 0.2 })

	
	exports.new_page = function(options)
	{
		var Backbone = require('backbone')

		var options = options || {}
		var page_view_class = Backbone.View.extend
		({
			tagName :  "div",
			className : "apps_page",
			title : options.title,
			manual_title : options.manual_title,
			dom_not_cache : options.dom_not_cache,
			transition_type : options.transition_type,
			ignore_exist : options.ignore_exist || false,
			without_his : options.without_his || false,
			events : options.events,
			render : options.render,
			page_show : options.page_show,
			page_before_show : options.page_before_show,
			page_back_show : options.page_back_show,
			page_init : options.page_init,
			window_change : options.window_change,
			page_before_hide : options.page_before_hide,
			page_hide : options.page_hide,
			page_lock : false,
			initialize : function()
			{
				//转场防事件穿透遮罩层  add by manson 2014.3.5
				this.$el.append('<div class="tran_cover"></div>')
				
				if(typeof(options.initialize)=="function")
				{
					options.initialize.call(this)
				}
			},
			open_cover : function()
			{
				this.$_('.tran_cover').show()
			},
			close_cover : function()
			{
				var that = this
				setTimeout(function(){
					that.$_('.tran_cover').hide()
				},300)
				
			},
			$_ : function(selector)
			{
				return this.$el.find(selector)
			}
		})


		return new page_view_class
	}
})