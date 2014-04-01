define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	exports.route = { "demo2": "demo2"  }

	exports.new_page_entity = function()
	{
		var options = {
			transition_type : 'fade'
		}
		
		options.initialize = function()
		{
			//this.$el.css('background','yellow')

			this.$el.html('<header style="background : #ff9999;text-align:center;height:50px;line-height:50px">header</header><div style="text-align:center;margin-top:10px;"><textarea style="width:90%;height:100px;border:1px solid black"></textarea><div class="btn" style=" display:inline-block; width:90%;height:30px;background : red;margin-top:10px">提交</div></div><div class="wraper"><div class="real_container"></div></div><footer style="background : #ff9999;text-align:center;height:50px;line-height:50px"><table style="width:100%;height:100%;text-align:center" cellpadding=0 cellspacing=0><tr><td class="demo1" style="width:25%;background : #ffff99">demo1</td><td class="demo2" style="width:25%;background : #99ff99">demo2</td><td class="demo3" style="width:25%; background : #66cc33">demo3</td><td class="lazyload" style="width:25%; background : #3399ff">lazyload</td></tr></table></footer>')
		}
		
		
		options.page_init = function(page_view)
		{
			var view_scroll = require('scroll')
			
			var header_height = 50
			var footer_height = 50
			var textarea_height = page_view.$el.find('textarea').height()
			var btn_height = page_view.$el.find('.btn').height()
			
			
			view_scroll_obj = view_scroll.new_scroll( page_view.$el.find('.wraper'), {
				'view_height' : window.innerHeight - textarea_height - btn_height - header_height - footer_height -2*10,			
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
			},
			'tap .lazyload' : function()
			{
				page_control.navigate_to_page("lazyload")
			}
		}
		     
		var page = require('page').new_page(options)
		
		return page;
	}	
})