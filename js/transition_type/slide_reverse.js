define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	exports.route = { "slide_reverse": "slide_reverse"  }

	exports.new_page_entity = function()
	{
		var options = {
			transition_type : 'slide_reverse'
		}

		options.initialize = function()
		{
			this.$el.css('background','green')

			this.$el.html('<span>·µ»Ø</span>')
		}

		
		options.events = {
			'tap span' : function(ev)
			{
				page_control.back()
			}
		}
		     
		var page = require('page').new_page(options);
		
		return page;
	}	
})