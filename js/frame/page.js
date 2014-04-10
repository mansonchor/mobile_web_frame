define("frame/page",["ua",'base_package'],function(require, exports)
{
	var $ = require('zepto')
	var ua = require('ua')
	
	//add by manson 2013.5.19底层事件绑定调整
	require('hammer')($)
	$(document.body).hammer({ swipe_velocity : 0.2 })

	
	exports.new_page = function(options)
	{
		var that = this;

		return {
			route : options.route,
			view : function()
			{
				return that.new_view(options)
			}
		}
	}

	exports.new_view = function(options)
	{
		var Backbone = require('backbone');
		var page_view_class = Backbone.View.extend
		({
			tagName :  "div",
			className : "apps_page",
			dom_not_cache : options.dom_not_cache,
			transition_type : options.transition_type,
			ignore_exist : options.ignore_exist,
			without_his : options.without_his,
			initialize : function()
			{
				if(typeof(options.initialize)=="function")
				{
					options.initialize.call(this)
				}
				
				//this.$el.hammer()

				//用hammer处理手机事件
				//setup_hammer_event(this.$el,options.events)
			},
			events : options.events,
			render : options.render,
			page_show : options.page_show,
			page_before_show : options.page_before_show,
			page_back_show : options.page_back_show,
			page_init : options.page_init,
			window_change : options.window_change,
			page_hide : options.page_hide,
			page_lock : false
		})

		return new page_view_class;
	}

});