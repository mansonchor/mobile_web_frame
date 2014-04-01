define(['base_package','frame_package','transition_type/index','transition_type/none','transition_type/slide','transition_type/slideup','transition_type/fade'],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')

	page_control.init( $('.page_container'),{
		default_title : "页面转场效果",
		default_index_route : "index"
	})

	var index_page = require('transition_type/index')
	var none_page = require('transition_type/none')
	var slide_page = require('transition_type/slide')
	
	var slideup_page = require('transition_type/slideup')
	var fade_page = require('transition_type/fade')

	page_control.add_page(index_page)
	page_control.add_page(none_page)
	page_control.add_page(slide_page)
	page_control.add_page(slideup_page)
	page_control.add_page(fade_page)

	
	page_control.route_start()

})