define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	exports.route = { "demo3": "demo3"  }

	exports.new_page_entity = function()
	{
		var options = {
			transition_type : 'fade'
		}
		
		options.initialize = function()
		{
			//this.$el.css('background','yellow')

			this.$el.html('<div class="img_container" style="position:relative;display:table-cell;vertical-align:middle;text-align:center;"><img src="http://image15-c.poco.cn/mypoco/qing/20140331/16/5094489731613162394_630x630_320.jpg" style="max-width:100%;max-height:100%"><div style="position:absolute;bottom:0px;width:100%;height:100px;background : rgba(0,0,0,0.5);text-align:left;color:white"><div  class="wraper"><div class="real_container"></div></div></div></div><footer style="background : #ff9999;text-align:center;height:50px;line-height:50px"><table style="width:100%;height:100%;text-align:center" cellpadding=0 cellspacing=0><tr><td class="demo1" style="width:33%;background : #ffff99">demo1</td><td class="demo2" style="width:33%;background : #99ff99">demo2</td><td class="demo3" style="width:34%; background : #66cc33">demo3</td></tr></table></footer>')
		}
		
		
		options.page_init = function(page_view)
		{
			var view_scroll = require('scroll')
			

			page_view.$el.find('.img_container').height( window.innerHeight - 50 )


			view_scroll_obj = view_scroll.new_scroll( page_view.$el.find('.wraper'), {
				'view_height' : 100,			
				'hideScrollbar' : false
			})

			//动态添加内容
			var real_container = page_view.$el.find('.real_container')
			for(var i = 0 ; i <= 20 ; i++)
			{
				real_container.append('<div style="padding : 15px 0">content txt content txt content txt </div>')
			}

			/*var header_height = 50
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
			}*/
			
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