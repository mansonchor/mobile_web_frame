define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	function new_page_entity()
	{
		var options = {
			route : { "index": "index"  },
			transition_type : 'none'
		}

		options.initialize = function()
		{
			this.$el.css('background','yellow')

			this.$el.html('<span>none</span><br><br><span>slide</span><br><br><span>slideup</span><br><br><span>fade</span>')
		}

		
		options.events = {
			'tap span' : function(ev)
			{
				var type = $(ev.currentTarget).html()

				page_control.navigate_to_page(type)
			}
		}
		
		return options
	}	

	return new_page_entity
})