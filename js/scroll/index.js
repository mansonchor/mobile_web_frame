define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	exports.route = { "index": "index"  }

	exports.new_page_entity = function()
	{
		var options = {
			transition_type : 'fade'
		}
		
		options.initialize = function()
		{
			//this.$el.css('background','yellow')

			this.$el.html('<header style="background : #ff9999;text-align:center;height:50px;line-height:50px">header</header><div class="wraper"><div class="real_container"></div></div><footer style="background : #ff9999;text-align:center;height:50px;line-height:50px"><table style="width:100%;height:100%;text-align:center" cellpadding=0 cellspacing=0><tr><td class="demo1" style="width:33%;background : #ffff99">demo1</td><td class="demo2" style="width:33%;background : #99ff99">demo2</td><td class="demo3" style="width:34%; background : #66cc33">demo3</td></tr></table></footer>')
		}
		
		
		options.page_init = function(page_view)
		{
			var view_scroll = require('scroll')
			
			view_scroll_obj = view_scroll.new_scroll( page_view.$el.find('.wraper'), {
				'view_height' : window.innerHeight - 2*50,			//屏幕高减去header和footer高
				'hideScrollbar' : false
			})
			

			//动态添加内容
			var real_container = page_view.$el.find('.real_container')
			for(var i = 0 ; i <= 20 ; i++)
			{
				real_container.append('<div style="padding : 15px 0">content txt content txt content txt </div>')
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
			}
		}
		     
		var page = require('page').new_page(options)
		
		return page;
	}	
})