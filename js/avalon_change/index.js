define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	function new_page_entity()
	{
		var options = {
			route : { "index": "index"  },
			transition_type : 'fade'
		}
		
		options.initialize = function()
		{
			//this.$el.css('background','yellow')

			this.$el.html('<header style="background : #ff9999;text-align:center;height:50px;line-height:50px">header</header><div class="wraper"><div class="real_container"></div></div><footer style="background : #ff9999;text-align:center;height:50px;line-height:50px"><table style="width:100%;height:100%;text-align:center" cellpadding=0 cellspacing=0><tr><td class="demo1" style="width:25%;background : #ffff99">demo1</td><td class="demo2" style="width:25%;background : #99ff99">demo2</td><td class="demo3" style="width:25%; background : #66cc33">demo3</td><td class="lazyload" style="width:25%; background : #3399ff">lazyload</td></tr></table></footer>')
		}
		
		
		options.page_init = function(page_view)
		{
			
		}

		
		return options
	}	

	return new_page_entity
})