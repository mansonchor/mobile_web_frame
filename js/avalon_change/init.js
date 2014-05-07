define(function(require, exports)
{
	var $ = require('zepto')

	var avalon = require('avalon')
	
	avalon.router.add("GET","/aaa", function(){
		console.log('aaaaa')
	})

	avalon.router.add("GET","/bbb", function(){
		console.log('bbb')
	})


    avalon.history.start({
        basepath: "/mvvm"
    })



	//var page_control = require('page_control')

	/*page_control.init( $('.page_container'),{
		default_title : "Ò³Ãæ¹ö¶¯",
		default_index_route : "index"
	})

	var index_page = require('avalon_change/index')
	
	page_control.add_page([index_page])
	
	page_control.route_start()*/
})