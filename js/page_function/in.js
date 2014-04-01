define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	exports.route = { "in": "in"  }

	exports.new_page_entity = function()
	{
		var options = {
			transition_type : 'slide'
		}
		
		options.initialize = function()
		{
			this.$el.css('background','yellow')

			this.$el.html('you can tap to another page')

			alert('initialize')
		}
		

		
		options.page_before_show = function()
		{
			alert('page_before_show')
		}

		options.page_show = function()
		{
			alert('page_show')
		}
		
		options.events = {
			'tap' : function(ev)
			{
				page_control.navigate_to_page("out")
			}
		}
		     
		var page = require('page').new_page(options);
		
		return page;
	}	
})