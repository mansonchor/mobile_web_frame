seajs.config
({
	alias: 
	{	
		'index' : 'transition_type/index',
		'none' : 'transition_type/none',
		'slide' : 'transition_type/slide',
		'slideup' : 'transition_type/slideup',
		'fade' : 'transition_type/fade'
    }
})

define(function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')

	page_control.init( $('.page_container'),{
		default_title : "页面转场效果",
		default_index_route : "index"
	})

	var index_page = require('index')
	var none_page = require('none')
	var slide_page = require('slide')
	var slideup_page = require('slideup')
	var fade_page = require('fade')

	page_control.add_page([index_page,none_page,slide_page,slideup_page,fade_page])
	
	page_control.route_start()

})