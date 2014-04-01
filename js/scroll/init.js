define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')

	page_control.init( $('.page_container'),{
		default_title : "页面滚动",
		default_index_route : "index"
	})

	var index_page = require('scroll/index')
	var demo2_page = require('scroll/demo2')
	var demo3_page = require('scroll/demo3')
	
	page_control.add_page(index_page)
	page_control.add_page(demo2_page)
	page_control.add_page(demo3_page)
	
	page_control.route_start()
})