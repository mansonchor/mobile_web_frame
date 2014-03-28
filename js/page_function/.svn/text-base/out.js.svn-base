define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	exports.route = { "out": "out"  }

	exports.new_page_entity = function()
	{
		var options = {
			transition_type : 'slide'
		}
		
		options.initialize = function()
		{
			this.$el.html('you can tap to back')
		}

		options.page_init = function()
		{
			alert('page_init')
		}
		
		options.page_before_hide = function()
		{
			alert('page_before_hide')
		}

		options.page_hide = function()
		{
			alert('page_hide')
		}
		
		options.events = {
			'tap' : function(ev)
			{
				page_control.back()
			}
		}
		     
		var page = require('page').new_page(options);
		
		return page;
	}	
})