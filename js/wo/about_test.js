
define("wo/about_test",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","new_alert_v2","notice"],function(require, exports)
{
	var $ = require('zepto')
	var cookies = require('cookies')

	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
   	var new_alert_v2 = require("new_alert_v2")
	var Mustache = require('mustache')
	var notice = require('notice')

	exports.route = { "about_test": "about_test" }

	exports.new_page_entity = function()
	{
		var options = {	
		    route :{"about_test" : "about_test"},
			transition_type : 'none'
		}	
		

		options.initialize = function()
		{
			console.log('initialize')
			
			this.render()

		}
			
		options.render = function()
		{
			var that = this
			 
			var init_html = '<div class="test_div" style="width:100%;height:50px;background:red;"></div>'    						

			that.$el.append($(init_html))
		}

		options.events = 
		{
			'tap .test_div' : function(ev)
			{
			    var target = ev.currentTarget

				$(target).css('background','yellow')
				
			}

		}
		
		var _page_view

		options.page_init = function(page_view)
		{
	
            console.log('page_init')
            
			var template = '<div class="mobile">模板字符串，这里是要{{content}}替换的内容</div>'
			var data = { content : ' 利用 ' }
			
			var html = Mustache.to_html(template,data)

			page_view.$el.find('.test_div').html(html)

            
           
       /*

			$.ajax
		({
			type: "GET",
			url : 'http://m.poco.cn/mobile/action/test-lj.php',
			//data: merge_data,
			dataType : "json",
			//timeout : wo_config.ajax_timeout,
			success : function(data)
			{   
			 		console.log(data)
            
			var template = '<div><p style="height:100px;background:{{content}}"></p></div>'
			var data = { content : data.fruits1[0].a}
			
			var html = Mustache.to_html(template, data)

			page_view.$el.html(html)
			},
			error : function()
			{
				
			}
		})
		
		*/


		}

		options.page_before_show = function(page_view)
		{
			console.log('page_before_show')
		}

		options.page_show = function(page_view)
		{
			console.log('page_show')
		}

		options.window_change = function(page_view)
		{
			console.log('window_change')
		}

		var page = require('page').new_page(options)
		return page
	}

})