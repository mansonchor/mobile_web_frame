define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	exports.route = { "index": "index"  }

	exports.new_page_entity = function()
	{
		var options = {
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
		     
		var page = require('page').new_page(options);
		
		return page;
	}	
})