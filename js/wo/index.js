/**
  *	 新版首页
  *	 @author Manson
  *  @version 2013.5.2
  *  @modify 2013.8.27
  */
define("wo/index",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","slider",'notice','world_list_module','new_alert_v2','carousel'],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var wo_config = require('wo_config')
	var notice = require('notice')
    var Mustache = require('mustache')
    var cookies = require('cookies')
	var new_alert_v2 = require("new_alert_v2")
	var carousel = require('carousel') 

	
	

	function new_page_entity()
	{
		var page_count = 20

		var options = {
			route : { "index": "index"  },
			transition_type : 'none'
		}

		options.initialize = function()
		{
			this.render()
		}

		var footer_view_obj
		options.render = function()
		{  
			var template_control = require('get_template')

			var footer_view = require('footer_view')
			footer_view_obj = new footer_view({ cur : "index" })
			
			var template_obj = template_control.template_obj()
			
			//var init_html = template_obj.index;
			
			var init_html = '<div class="wrap-box"><header class="header fb re font_wryh"><div class="ui-btn-header-wrap ui-btn-prev-wrap ui-btn-publish"><div class="ui-btn-header ui-btn-prev radius-2px"><span class="icon icon-btn-publish icon-bg-common"></span></div></div><h1 class="logo">世界·POCO拍客社区</h1></header><div class="main_wraper"><div class="index-page font_wryh" style="padding-top:35px;"><div class="banner mt10 tc re" style="-webkit-box-shadow: 0 1px 1px rgba(0,0,0,.2);box-shadow: 0 1px 1px rgba(0,0,0,.2);"><div class="ad_container"><div class="m-carousel m-fluid m-carousel-photos"><div class="m-carousel-inner"></div><div class="m-carousel-controls m-carousel-bulleted"></div></div></div></div><div style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);"></div></div><div class="content-8"><div class="main_container pb10 pt10"><div class="grid_box"></div><div class="bg-line" style="display:none;"></div><div class="hot_and_new_container" style="display:none;"><div class="item one" style="margin-right:10px" data-to_hot_new="hot"><table cellspacing="0" cellpadding="0" width="100%" height="100%" border="0" valign="middle" style="text-align:center"><tbody><tr><td valign="middle"><div class="area"><div class="area_content" style="display:inline-block"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td valign="middle"><em class="icon icon-bg-common"></em></td><td><span class="area_text">照片榜</span></td></tr></tbody></table></div></div></td></tr></tbody></table></div><div class="item two" data-to_hot_new="new"><table cellspacing="0" cellpadding="0" width="100%" height="100%" border="0" valign="middle" style="text-align:center"><tbody><tr><td valign="middle"><div class="area"><div class="area_content" style="display:inline-block"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td valign="middle"><em class="icon icon-bg-common"></em></td><td><span class="area_text">最新图片</span></td></tr></tbody></table></div></div></td></tr></tbody></table></div></div><div class="event_box"></div></div><div class="more_btn_container pb15" data_to_event style="display:none;"><div class="tc ui-btn-more">更多活动</div></div></div></div></div><footer class="footer"></footer></div>'						 

			this.$el.append($(init_html))
			
			this.$_('.ui-btn-publish').hide()
		   
			//底部
			this.$_('.footer').append(footer_view_obj.$el)

			
		}
		
		
		options.events = {
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false

				index_page_refresh()
				
				ad_list_refresh()    
				
				
			},
			//推广图跳转 add 2013.7.3
            'tap [data-link_type]' : function(ev)
			{
				if(page_control.page_transit_status()) return false

				var link_type = $(ev.currentTarget).attr("data-link_type")
                var link_adress = $(ev.currentTarget).attr("data-link_adress")
				
				//点击banner统计 add by manson 2013.8.7
				var banner_click_stat = new Image()
				var stat_link_adress = link_adress.replace("#","")
				banner_click_stat.src = 'http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/banner_click?link_url='+stat_link_adress+'&tmp='+(new Date().getTime())
                

                switch(link_type)
                {
                    case "inner_page" :
                         page_control.navigate_to_page(link_adress)
                         break; 
					case "inner_refresh_page" :
                         window.location.href = link_adress
                         break; 
                    case "outside_page" :
                         
                         window.open(link_adress)                         
                         break;
                }
                
                //ad_slider_obj.stop_silde();
			},
			 'tap [data_to_event]' : function(ev)
            {
              page_control.navigate_to_page("event")   
            },
            'tap [data-to_hot_new]' : function(ev)
            {
                var cur_btn = $(ev.currentTarget);
                var nav = cur_btn.attr('data-to_hot_new')  
                
                switch(nav)
                {
                    case "hot":
                         page_control.navigate_to_page("pics_rank")   
                         break;
                    case "new":
                         page_control.navigate_to_page("new_img")
                         break;         
                    
                }
            },
			//发布按钮
			'tap .ui-btn-publish' : function(ev)
            {
                var hash = location.hash.replace("#", "")

				var stat_img = new Image()
				stat_img.src = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/publish_btn?url_hash="+hash+"&tmp="+new Date().getTime()

				var login_requirement = common_function.publish_login_requirement()
				if(login_requirement)
				{
					page_control.navigate_to_page("login") 
				}
				else
				{
					page_control.navigate_to_page("publish") 
				}   
            }
			
		}
		
		
		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
			
			grid_img_size =  parseInt( (window.innerWidth - 16 - 8 * 2)/3 )
			$(page_view.el).find(".grid_box_container img").width(grid_img_size).height(grid_img_size)
			
			event_img_height =  parseInt((window.innerWidth-8*2)*(150/608));
			$(page_view.el).find(".event-img img").height(event_img_height)
			
			setup_slider_height()
			
			set_hot_news_btn_size()
		}


		//页面显示时
		options.page_before_show = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())

			notice.footer_notice_ui_refresh()

			//ad_slider_obj && ad_slider_obj.carousel('stop')
		}

		options.page_before_hide = function()
		{
			//ad_slider_obj && ad_slider_obj.carousel('stop')
		}
		
		
		
		var img_style_view = Backbone.View.extend({
			tagName: "div",
			className: "grid_box_container bdb-line",
			initialize: function(json_data) 
			{
                
				this.cover_img_url = json_data.cover_img_url
				this.cat_conf_name = json_data.cat_conf_name
				this.art_id = json_data.art_id
				json_data.grid_img_size = grid_img_size
				
				//json_data.cover_img_url = common_function.matching_img_size(json_data.cover_img_url,"ss")
				
				var template = '<img class="my_life_img img_buffer_bg" src={{cover_img_url}}  style="width:{{grid_img_size}}px;height:{{grid_img_size}}px;position:static"><div class="grid_box_txt"><div>{{cat_conf_name}}</div></div>'
				var html = Mustache.to_html(template, json_data)
				
				this.$el.html(html)

				
			},
			events : 
			{
				"tap .grid_box_container": function() 
				{  
					var tag_name = encodeURIComponent(this.cat_conf_name)
					var art_id = this.art_id
					
					if(common_function.is_empty(art_id))
					{
						page_control.navigate_to_page("category/" + tag_name)
					}
					else
					{
						page_control.navigate_to_page("category/" + tag_name + '/' + art_id)
					}
				}
			}
		})	
		
		var event_style_view = Backbone.View.extend({
			tagName: "div",
			className: "event-img mt10 oh bdb-line",
			initialize: function(json_data) 
			{
                
				this.keyword = json_data.keyword
				this.cover_img_url = json_data.cover_img_url
				json_data.event_img_height = event_img_height
				
				var template = '<img src={{cover_img_url}} style="height:{{event_img_height}}px" class="img_buffer_bg w-100"/>'
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
		

		
		var ad_slider_obj
		var _page_view
		var view_scroll_obj
		var index_mobile_photo_collection
		var index_refresh_btn
        var cover_img_url
		var cat_conf_name
		
		// 计算九宫格图片宽高
		var grid_img_size =  parseInt( (window.innerWidth - 16 - 8 * 2)/3 )
		
		// 计算活动图片高
		var event_img_height =  parseInt((window.innerWidth-8*2)*(150/608));

		//页面初始化时
		options.page_init = function(page_view)
		{	
		    
			_page_view = page_view
			
			
			
			var that = this					    		
            
			//刷新按钮  add by manson 2013.5.7
			index_refresh_btn = require('refresh_btn')()
			page_view.$_('.header').append(index_refresh_btn.$el)
			

			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')                
			
			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head_and_nav(),
				use_lazyload : true
			})
			

			index_page_refresh()
			
			
			// hdw
			// 初始化广告        
            setup_slider_height()
            
            // hdw
            // 初始化热门、最新按钮
            set_hot_news_btn_size()
            
            ad_list_refresh()
		}
		
		
		var ajax_loading = false
		
		function ad_list_refresh()
		{
		    common_function.send_request
            ({
                url : wo_config.ajax_url.ad_list,
                callback : function(data)
                {   
                    var model_data = data
                    
                    /* 
                     
                    var model_data = [{img_url: "http://image15-c.poco.cn/best_pocoers/20140103/71672014010318504643618359_600.jpg"
,link_url: "doorplate_last/70"
,remark: "inner_page"},{img_url: "http://image15-c.poco.cn/best_pocoers/20140103/71672014010318504643618359_600.jpg"
,link_url: "doorplate_last/70"
,remark: "inner_page"},{img_url: "http://image15-c.poco.cn/best_pocoers/20140103/71672014010318504643618359_600.jpg"
,link_url: "doorplate_last/70"
,remark: "inner_page"}]; */                        
                            
                    ad_slider_obj = carousel.get_ad_slider($(_page_view.el).find('.m-carousel'),
                    {
                        data : model_data,
                        cur_page_view : $(_page_view.el),                    
                        carousel_config :
                        {
                            auto: 2000                          
                        },                        
                        after_slide_callback : function()
                        {
                            
                        }
                        
                    })
                    
                }
            })
		}
		
		//刷新首页数据
		function index_page_refresh()
		{
			
			
			if(ajax_loading) return false
			ajax_loading = true

			
			index_refresh_btn.loadding()
            
            $.ajax
			({
				type: "GET",
				url : wo_config.ajax_url.index,
				dataType : "json",
				timeout : wo_config.ajax_timeout,
				success : function(data)
				{ 
				    _page_view.$_('.grid_box').html('')
					_page_view.$_('.event_box').html('')
					
					view_scroll_obj.scroll_to(0)
					
					$(data.category).each(function(i,img_style_array)
					{
						var img_style_view_obj = new img_style_view(img_style_array)
                     	
						_page_view.$_('.grid_box').append(img_style_view_obj.$el)
						
					})
					
				    _page_view.$_('.hot_and_new_container').show();
					
					$(data.events).each(function(i,event_style_array)
					{
						
						console.log(event_style_array)
						var event_style_view_obj = new event_style_view(event_style_array)
                     	
						_page_view.$_('.event_box').append(event_style_view_obj.$el)
						
					})
										
					_page_view.$_('[data_to_event]').show()
				    ajax_loading = false
					index_refresh_btn.reset()
                    
				},
				error : function()
				{
                  	new_alert_v2.show({text:"网络不给力，刷新试试",type:"info",auto_close_time : 1000})

					ajax_loading = false
					index_refresh_btn.reset()	
				}
			})
			
			
            
		}
        
        function set_hot_news_btn_size()
        {
            var width = parseInt((window.innerWidth-26)/2);
            
            $(_page_view.el).find('.hot_and_new_container .item').width(width)
        }			
   

        function setup_slider_height()
        {
             var scale_rate = 75/320
             
             var slide_height =  parseInt((window.innerWidth)*(scale_rate));
             
             $(_page_view.el).find('.m-carouse').css("height",(slide_height)+"px")
             
             $(_page_view.el).find('.ad_container').css("height",(slide_height)+"px")

             return scale_rate
        }
        
		return options
	}

	return new_page_entity
})

if(typeof(process_add)=="function")
{
	process_add()
}