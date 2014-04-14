define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')

	page_control.init( $('.page_container'),{
		default_title : "页面函数触发",
		default_index_route : "in"
	})

	var in_page = require('page_function/in')
	var out_page = require('page_function/out')
	
	page_control.add_page([in_page,out_page])
	
	
	page_control.route_start()
})