define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	function new_page_entity()
	{
		var options = {
			route : { "lazyload": "lazyload"  },
			transition_type : 'fade'
		}
		
		options.initialize = function()
		{
			//this.$el.css('background','yellow')

			this.$el.html('<header style="background : #ff9999;text-align:center;height:50px;line-height:50px">header</header><div class="wraper"><div class="real_container"></div></div><footer style="background : #ff9999;text-align:center;height:50px;line-height:50px"><table style="width:100%;height:100%;text-align:center" cellpadding=0 cellspacing=0><tr><td class="demo1" style="width:25%;background : #ffff99">demo1</td><td class="demo2" style="width:25%;background : #99ff99">demo2</td><td class="demo3" style="width:25%; background : #66cc33">demo3</td><td class="lazyload" style="width:25%; background : #3399ff">lazyload</td></tr></table></footer>')
		}
		
		
		options.page_init = function(page_view)
		{
			var view_scroll = require('scroll')
			
			view_scroll_obj = view_scroll.new_scroll( page_view.$el.find('.wraper'), {
				'view_height' : window.innerHeight - 2*50,			//屏幕高减去header和footer高
				'hideScrollbar' : false,
				'use_lazyload' : true
			})
			

			//动态添加内容
			var real_container = page_view.$el.find('.real_container')
			for(var i = 0 ; i <= 20 ; i++)
			{
				real_container.append('<div style="padding : 15px 0"><img lazyload_src="http://mansonchor.github.io/mobile_web_frame/images/9103967131260440634_683x1024_320_170.jpg" style="width:170px;height:170px;background : #cccccc"></div>')
			}
			
		}

		
		options.events = 
		{
			'tap .demo1' : function()
			{
				page_control.navigate_to_page("index")
			},
			'tap .demo2' : function()
			{
				page_control.navigate_to_page("demo2")
			},
			'tap .demo3' : function()
			{
				page_control.navigate_to_page("demo3")
			},
			'tap .lazyload' : function()
			{
				page_control.navigate_to_page("lazyload")
			}
		}
		
		return options
	}	

	return new_page_entity
})