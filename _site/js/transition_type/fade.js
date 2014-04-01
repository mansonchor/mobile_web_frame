define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	exports.route = { "fade": "fade"  }

	exports.new_page_entity = function()
	{
		var options = {
			transition_type : 'fade'
		}

		options.initialize = function()
		{
			this.$el.css('background','#975432')

			this.$el.html('<span>返回</span>')
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