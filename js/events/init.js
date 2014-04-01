define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')

	page_control.init( $('.page_container'),{
		default_title : "页面事件",
		default_index_route : "index"
	})

	var index_page = require('events/index')
	
	page_control.add_page(index_page)
	
	page_control.route_start()
})