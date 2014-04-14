define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	function new_page_entity()
	{
		var options = {
			route : { "in": "in"  },
			transition_type : 'slide'
		}
		
		options.initialize = function()
		{
			this.$el.css('background','yellow')

			this.$el.html('you can tap to another page')

			alert('in page initialize')
		}
		

		
		options.page_before_show = function()
		{
			alert('in page_before_show')
		}

		options.page_show = function()
		{
			alert('in page_show')
		}
		
		options.events = {
			'tap' : function(ev)
			{
				page_control.navigate_to_page("out")
			}
		}
		
		return options
	}
		
	return new_page_entity
})