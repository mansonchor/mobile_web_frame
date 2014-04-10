define("wo/event",["base_package",'frame_package',"btn_package","wo_config","commom_function","get_template","footer_view","notice","new_alert_v2","select_module"],function(require, exports)
{
	var $ = require('zepto')
	var wo_config = require('wo_config')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
	var notice = require('notice')
    var cookies = require('cookies')
	var new_alert_v2 = require("new_alert_v2")
	
	
	var new_alert_v2 = require("new_alert_v2")
    
    
	exports.route = { "event": "event" }
		

	exports.new_page_entity = function()
	{
		var options = {	
			title : "主题活动",
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true    
		}
		
    
		options.initialize = function()
		{
			this.render();
		}
		
		
		options.render = function()
		{	
		    var template_control = require('get_template')
			
			var template_obj = template_control.template_obj()
			
			var init_html = template_obj.event;  
			
			this.$el.append($(init_html))
		}
		
		
		var select_module_class = require("select_module")()

		var select_module_obj = new select_module_class({ 
			options_data : 
			[
				{ key : "" , val : "全部活动" },
				{ key : "自拍" , val : "自拍" },
				{ key : "旅游" , val : "旅游" },
				{ key : "美食" , val : "美食" },
				{ key : "萌宠" , val : "萌宠" },
				{ key : "玩物" , val : "玩物" },
				{ key : "摄影" , val : "摄影" },
				{ key : "玩乐" , val : "玩乐" },
				{ key : "我的城市" , val : "我的城市" },
				{ key : "心情" , val : "心情" }
			],
			//default_key : "美食",
			onchange : function()
			{
				var select_data = this.get_select_data()		
				
				console.log(select_data)

				tag_name = select_data.val
				event_collection_obj.refresh()
			}
		})
				
		
		options.events = 
		{
	      'tap .ui-btn-prev-wrap' : function(ev)
			{
				page_control.back()                                
			},
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{
					page_control.back()
				}
			},
			//加载更多处理
			'tap .data-more_btn' : function()
			{
				if(page_control.page_transit_status()) return false

				event_collection_obj.get_more_item()
			},
			'tap [data-filter_in]' : function(ev)
            {
				select_module_obj.open()
			}
		}

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.wraper_con_list').height(common_function.container_height_with_head())
			$(page_view.el).find('.wraper_con_filter').height(common_function.container_height_with_head())
			var img_height =  parseInt((window.innerWidth-10*2)*(150/600))
			$(page_view.el).find('.event-img img').height(img_height)
		}
		
		var img_event_view = Backbone.View.extend({
							
			tagName: "div",
			className: "event-img  fixed_scroll_blink bdb-line re ph mt10",	
			initialize: function(json_data) 
			{
				this.cover_img_url = json_data.cover_img_url
				this.keyword = json_data.keyword
				
				if(json_data.status==1)
				{
					json_data.on_going = 1
				}
				
				json_data.img_height = img_height
                

				var template = '<img src={{cover_img_url}} class="img_buffer_bg w-100" style="height:{{img_height}}px"/>{{#on_going}}<em class="icon-going icon-bg-common" >{{/on_going}}</em>'
				var html = Mustache.to_html(template, json_data)
				
				this.$el.html(html)
                
				
			},
			events : 
			{
              	"tap .event-img": function() 
				{  
					page_control.navigate_to_page("theme_pic_list/"+encodeURIComponent(this.keyword))
				}
			}
		})	

		var page_count = 10
		var alert_tips
		
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
				setTimeout(function(){
					alert_tips.close()
				},300)
				

				load_more_btn.reset()

				if( (response==false || response.length < page_count))
				{            
					load_more_btn.hide()
				}
				else
				{
					load_more_btn.show()
				}
			},
			before_refresh : function()
			{	 
			     alert_tips = new_alert_v2.show({text:"获取中",type : "loading", append_target : _page_view.$el , is_cover : true ,auto_close_time:false});
			},
			before_get_more : function()
			{
				load_more_btn.loadding()
			}
		}

		var event_collection_class = Backbone.Collection.extend
		({
			url : 'http://m.poco.cn/mobile/action/event.php',
			refresh : function()
			{
				collection_options.data = { tag_name : tag_name }
				
				common_function.collection_refresh_function.call(this,collection_options)
			},
			get_more_item : function()
			{
				var that = this

				collection_options.data = { tag_name : tag_name }
				
				common_function.collection_get_more_function.call(this,collection_options)
			}
			
			
		})

      

		var view_list_scroll_obj
		var view_filter_scroll_obj
		var _page_view
		var event_collection_obj
		var load_more_btn
		var tag_name = false
		
		var img_height =  parseInt((window.innerWidth-10*2)*(150/600));
		
		
		options.page_before_hide = function()
		{
			select_module_obj.close()
		}

		//页面初始化时
		options.page_init = function(page_view,params_arr)
		{
            _page_view = page_view

		    //返回按钮
            var page_back_btn_container = $(page_view.el).find('header[data_event_list]')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
			
		   
		   //容器滚动
		    var wraper_con_list = $(page_view.el).find('.wraper_con_list')
			var view_scroll = require('scroll')
			view_list_scroll_obj = view_scroll.new_scroll(wraper_con_list,{
				'view_height' : common_function.container_height_with_head()
			})
			
			
			//加载更多按钮   
			load_more_btn = require('load_more_btn')()  
			page_view.$el.find('.load_more_btn_wraper').append(load_more_btn.$el)
			
			

			event_collection_obj = new event_collection_class
			
			event_collection_obj.bind('reset', re_render_list , page_view)
			
			//加载更多监听
			event_collection_obj.bind('add', add_render_list , page_view)
			
			event_collection_obj.refresh()


		}

		function re_render_list()
		{
			var that = this;			        
			_page_view.$el.find('.main_wraper').html('')
			event_collection_obj.each(function(item_model)
			{
				var img_event_view_obj = new img_event_view(item_model.toJSON())	
				_page_view.$el.find('.main_wraper').append(img_event_view_obj.$el)
			})
		}
		

		function add_render_list(item_model)
		{	   
			var img_event_view_obj = new img_event_view(item_model.toJSON())        	
			_page_view.$el.find('.main_wraper').append(img_event_view_obj.$el)
		}


		var page = require('page').new_page(options);
		
		return page
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}