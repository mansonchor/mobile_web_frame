define("wo/theme",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","notice"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
    var wo_config = require('wo_config')
	var notice = require('notice')
    
	exports.route = { "theme": "theme" }

	exports.new_page_entity = function()
	{
		var options = {
			route : { "theme": "theme" },
			transition_type : 'none'
		};

		options.initialize = function()
		{
			this.render()
		}
		
		var footer_view_obj
		options.render = function()
		{
			var template_control = require('get_template')

			var footer_view = require('footer_view')
			footer_view_obj = new footer_view({ cur : "theme" })
			
			var template_obj = template_control.template_obj()
			
			var init_html = template_obj.theme
			
			this.$el.append($(init_html))

			//底部
			this.$el.find('.footer').append(footer_view_obj.$el)
		}
		
		
		options.events = {
			
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false

				refresh_theme_list()
			},
			//活动
			'tap .event article' : function(ev)
			{
				if(page_control.page_lock_status()) return false
				if(page_control.page_transit_status()) return false
				
				var keyword = $(ev.currentTarget).attr("keyword")  
				if(keyword==null) return false
				

				keyword = encodeURIComponent(keyword)

				var des = $(ev.currentTarget).attr("des") 
				var award = $(ev.currentTarget).attr("award") 
				

				page_control.navigate_to_page("theme_pic_list/"+keyword,{ des : des, award : award })
			},
			//关键字
			'tap .keyword td' : function(ev)
			{
				if(page_control.page_lock_status()) return false
				if(page_control.page_transit_status()) return false
				
				var keyword = $(ev.currentTarget).attr("keyword")  
				if(keyword==null) return false
				

				keyword = encodeURIComponent(keyword)

				var des = $(ev.currentTarget).attr("des") 
				var award = $(ev.currentTarget).attr("award") 
				
				
				page_control.navigate_to_page("theme_pic_list/"+keyword,{ des : des, award : award })
			}
		};
		

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
		}


		//页面显示时
		options.page_before_show = function(page_view,params_arr)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())

			notice.footer_notice_ui_refresh()
		}
		
		
		
		var view_scroll_obj
		var cur_page_view
		var theme_refresh_btn
		var theme_model_obj


		// 列表子项对象
		var theme_model = Backbone.Model.extend
		({
			defaults:
			{
				evnet : ""
			},
			url : "http://m.poco.cn/mobile/action/theme.php",
			parse: function(response) 
			{ 
				
				if(response && typeof(response.result_data)!="undefined")
				{
					return response.result_data
				}
				else
				{
					return response
				}
			}
		})

		//页面初始化时
		options.page_init = function(page_view)
		{
			page_control.lock_page()


			//刷新按钮  add by manson 2013.5.7
			theme_refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(theme_refresh_btn.$el)
			
			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')
			
			cur_page_view = $(page_view.el);        

			var view_scroll = require('scroll')                
			
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head_and_nav()
			})                    
			
			
			theme_model_obj = new theme_model
			theme_model_obj.bind('change', get_info_finish , page_view)
			

			refresh_theme_list()
		}
		

		//刷新活动页面数据
		function refresh_theme_list()
		{
			theme_refresh_btn.loadding()

			theme_model_obj.fetch({
				type: "GET",  
				data: { t : parseInt(new Date().getTime()) },
				timeout : wo_config.ajax_timeout,
				success : function(model,response)
				{
					page_control.unlock_page()

					theme_refresh_btn.reset()
				},
				error:function()
				{
					page_control.unlock_page()

					theme_refresh_btn.reset()
				}
			})
		}


		function get_info_finish(model)
		{
			var page_view = this

			var model_data = model.attributes

			var event_container = page_view.$el.find('.event article')

			$(model_data.event).each(function(i,obj)
			{
				if(obj.title=="POCO LEAVE季")
				{
					event_container.eq(i).find('.event_content').html("#POCO LEAVE季#牛人请进")
				}
				else
				{
					event_container.eq(i).find('.event_content').html("#" + obj.title + "#")
				}
				
				if(obj.medal_id > 0)
				{
					event_container.eq(i).find('.doorplate').show()
				}
				else
				{
					event_container.eq(i).find('.doorplate').hide()
				}

				/*if(i==2)
				{
					event_container.eq(i).find('.gift').show()
				}*/
				
				event_container.eq(i).attr("keyword", obj.title)
				event_container.eq(i).attr("des", obj.content)
				event_container.eq(i).attr("award", obj.activity_content)
			})
			
			
			var td_container = page_view.$el.find('.keyword td')
			var theme_container = page_view.$el.find('.keyword article')

			$(model_data.theme).each(function(i,obj)
			{
				theme_container.eq(i).html("#" + obj.title + "#")
				td_container.eq(i).attr("keyword", obj.title)
				td_container.eq(i).attr("des", obj.content)
				td_container.eq(i).attr("award", obj.activity_content)
			})

			if(model_data.theme.length<7)
			{
				page_view.$el.find('.keyword tr').last().hide()
			}
		}
		
		
		
		var page = require('page').new_page(options);
		
		return page;
	}


   
});