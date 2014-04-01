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

			this.$el.html('you can touch to try')
		}

		
		options.events = {
			'tap' : function(ev)
			{
				alert('tap')
			},
			'doubletap' : function(ev)
			{
				alert('doubletap')
			},
			'hold' : function(ev)
			{
				alert('hold')
			},
			'swipe' : function(ev)
			{
				alert('swipe')
			},
			'pinch' : function(ev)
			{
				alert('pinch')
			}
		}
		     
		var page = require('page').new_page(options);
		
		return page;
	}	
})