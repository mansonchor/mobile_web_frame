define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	
	function new_page_entity()
	{
		var options = {
			route : { "out": "out"  },
			transition_type : 'slide'
		}
		
		options.initialize = function()
		{
			this.$el.html('you can tap to back')
		}

		options.page_init = function()
		{
			alert('out page_init')
		}
		
		options.page_before_hide = function()
		{
			alert('out page_before_hide')
		}

		options.page_hide = function()
		{
			alert('out page_hide')
		}
		
		options.events = {
			'tap' : function(ev)
			{
				page_control.back()
			}
		}
		     
		return options
	}	

	return new_page_entity
})