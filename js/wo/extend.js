define("wo/extend",["base_package",'frame_package',"btn_package","wo_config","commom_function","get_template","footer_view","notice","new_alert_v2"],function(require, exports)
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
    
    
	exports.route = { "extend": "extend" }
		

	exports.new_page_entity = function()
	{
		var options = {
			route : { "extend": "extend" },		
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true    
		};
		

        
		options.initialize = function()
		{
			this.render();
		}
		
        
		options.render = function()
		{		
			var that = this

			var init_html = '<div class="extend_page font_wryh"><header class="header re tc fb">世界社区 Ver1.12</header><div class="wraper_con"><div class="wraper_padding"><div class="main_wraper"><div class="banner"><img src="images/extend-640x615.jpg" /></div><div class="content-10"><div class="creat-btn tc colorfff bdb-line" data_to_life>创建我的生活九宫格</div><div class="ta_life"><em class="icon icon-bg-common"></em><div class="cover-img-box mt5 clearfix"></div></div></div></div></div></div></div>'        
							
			that.$el.append($(init_html))
		}
		
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
			'tap [data_to_life]' : function(ev)
			{
				var poco_id = common_function.get_local_poco_id()
				if(poco_id<=0)
				{
                  page_control.navigate_to_page("my") 
				}
                else
				{  
				  page_control.navigate_to_page("my_life_box") 
				}
			},
			
			
			
		}
		options.window_change = function(page_view)
		{
			$(page_view.el).find('.wraper_con').height(common_function.container_height_with_head())
			var cover_img_size = parseInt( (window.innerWidth - 10*2 - 20 * 3)/4 )
			$(page_view.el).find(".cover-img-item img").width(cover_img_size).height(cover_img_size)
			setup_banner_img_height()
		}
		

        var user_cover_view = Backbone.View.extend({
			tagName: "div",
			className: "cover-img-item",
			initialize: function(json_data) 
			{
                
				this.user_id = json_data.user_id
				this.user_name = json_data.user_name
				this.img_url = json_data.img_url
				json_data.cover_img_size = cover_img_size
				
				var template = '<img src={{img_url}} class="img_buffer_bg" style="width:{{cover_img_size}}px;height:{{cover_img_size}}px" />'
				var html = Mustache.to_html(template, json_data)
				
				this.$el.html(html)

				
			},
			events : 
			{
               "tap .cover-img-item": function() 
				{  
					page_control.navigate_to_page("user_profile/"+this.user_id)
					
				}
			}
		})


		var view_scroll_obj
		var _page_view
		
		/* 计算封面图的size */
        var cover_img_size = parseInt( (window.innerWidth - 10*2 - 20 * 3)/4 )
		function setup_banner_img_height()
		{
		  var banner_img_height = parseInt( (window.innerWidth)*(518/640) )
		  $(_page_view.el).find(".banner img").height(banner_img_height)
		}
		
		//页面初始化时
		options.page_init = function(page_view,params_arr)
		{		
		    _page_view = page_view
			
		    //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
		   
		   //容器滚动
		    var wraper_con = $(page_view.el).find('.wraper_con')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(wraper_con,{
				'view_height' : common_function.container_height_with_head()
			})
			
            setup_banner_img_height()
			$.ajax
			({
				type: "GET",
				url : 'http://m.poco.cn/mobile/action/extend.php',
				//data: merge_data,
				dataType : "json",
				//timeout : wo_config.ajax_timeout,
				success : function(data)
				{ 
					
                  	$(data).each(function(i,user_cover_img_array)
					{
						console.log(user_cover_img_array)
						var user_cover_view_obj = new user_cover_view(user_cover_img_array)
                     	
						_page_view.$el.find('.cover-img-box').append(user_cover_view_obj.$el)
						
					})

				},
				error : function()
				{
					
				}
			})
			
			

		}

        
		
		var page = require('page').new_page(options);
		
		return page;
	}
})