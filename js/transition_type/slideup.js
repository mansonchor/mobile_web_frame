define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	
	function new_page_entity()
	{
		var options = {
			route : { "slideup": "slideup"  },
			transition_type : 'slideup'
		}

		options.initialize = function()
		{
			this.$el.css('background','#ccc')

			this.$el.html('<span>返回</span>')
		}

		
		options.events = {
			'tap span' : function(ev)
			{
				page_control.back()
			}
		}
		
		return options
	}	

	return new_page_entity
})