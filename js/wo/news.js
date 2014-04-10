define("wo/news",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","notice","new_alert_v2"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
    var wo_config = require('wo_config')
	var notice = require('notice')
	
    
    var new_alert_v2 = require("new_alert_v2")
    
	exports.route = { "news": "news" }
    

	exports.new_page_entity = function()
	{
		
		var page_count = 10
		
		var is_refresh = false
	   

		//主题collect数据重新整合  modify by manson 2013.5.10
		var collection_options = {
			ajax_load_finish : function(model,response,ajax_failed)
			{
			    news_refresh_btn.reset()
				                
                news_controler_obj.more_btn_reset() 
			 
				if(response==false && is_refresh)
                {                    
                    cur_page_view.find('.no_data').css("display","table");
                    news_controler_obj.hide_more_btn()
                    news_controler_obj.clear_list()                    
                } 
                else
                {
                    cur_page_view.find('.no_data').hide();   
                } 
				
                
				if(response==null) return

				if(response==false || response.length < page_count)
				{            
					news_controler_obj.hide_more_btn()
                                       
				}
			},
			before_refresh : function()
			{
				is_refresh = true
				news_refresh_btn.loadding()
			},
			before_get_more : function()
			{
				is_refresh = false
				news_controler_obj.more_btn_loading()
			}
		}

		/********** 新闻列表 **********/
        
        //数据model
		var news_model = Backbone.Model.extend({
			defaults:{}
		})
        
        var news_collection = Backbone.Collection.extend({
			model : news_model,
			refresh : function()
			{
				collection_options.data = { }

				common_function.collection_refresh_function.call(this,collection_options)
			},
			get_more_item : function()
			{
				var that = this

				collection_options.data = { order_ukey : that.models[that.models.length-1].attributes.order_ukey}

				common_function.collection_get_more_function.call(this,collection_options)
			},
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
			},
			url : wo_config.ajax_url.news_list
		})
        
		
		// 计算图片宽高
        var pic_size = parseInt( (window.innerWidth - 20 - 42 - 5*3)/3 )    
		
        //新闻列表item的view
		var news_item_view =  Backbone.View.extend
		({
		        className : "border-btm",  
				tagName :  "div",		
                idx : 0,		
				initialize : function() 
				{   
				    //this.pic_size = this.options.pic_size
                    
                    var type = "like";
                    
                    switch(type)
                    {
                        case "like":                                            
                                    
                        var template = '<table border="0" cellspacing="0" cellpadding="0"><tr><td valign="top" width="42"><div class="user-img middle-center"><img class="img_buffer_bg max-width-height" data-nav_user={{user_id}} lazyload_src="{{user_icon}}" class="radius-3px"/></div></td><td><div class="user-info"><p class="txt"><span class="name" data-nav_user={{user_id}}>{{nickname}} <span class="like_num">&nbsp;喜欢了{{article_count}}张照片</span></span><span class="time">{{add_time}}</span></p><div class="like-photo clearfix">{{#custom_data}}<img lazyload_src="{{cover_img_url_ss}}" data-nav_art={{art_id}} data-img_width="{{cover_img_url_width}}" data-img_height="{{cover_img_url_height}}" class="img_buffer_bg imgs " style="width:{{pic_size}}px;height:{{pic_size}}px;" >{{/custom_data}}</div></div></td></tr></table>'                                                
                        
                        break;          
                    }                    
                    
                    var data = this.img_size_sort(this.model.toJSON());
                    
                    this.user_id = data.user_id;
				    					                                
					
					var html = Mustache.to_html(template, data)                                                                                
					
					$(this.el).html(html)               
				},                
        		img_size_sort : function(model_data)
        		{
        		    var len = model_data.custom_data.length
        		    for(var i = 0;i<len;i++)
                    {
                        var custom_data = model_data.custom_data[i]
                        custom_data.cover_img_url_ss = common_function.matching_img_size(custom_data.cover_img_url,"ss")

						//根据计算的图片大小值
						custom_data.pic_size = pic_size
                    }        		            								
        			
        			return model_data
        		},
				//针对新闻列表item的tap导航
				events : 
                {
                    'tap [data-nav_user]' : 'navigate_to_user'  ,
                    'tap [data-nav_art]'  : 'navigate_to_art'               
				},                        
        		navigate_to_user : function()
        		{		    
                    if(!this.user_id) {return;}          
                                        
                    page_control.navigate_to_page("user_profile/"+this.user_id)
        				
        		},
                navigate_to_art: function(ev)
        		{
        		    var art_id = $(ev.currentTarget).attr("data-nav_art")
					
					var cover_img_width = $(ev.currentTarget).attr("data-img_width")
					var cover_img_height = $(ev.currentTarget).attr("data-img_height")
					
        			page_control.navigate_to_page("last/"+art_id+"/from_profile", { cover_img_width : cover_img_width,cover_img_height : cover_img_height } )
        		},
		});
        
        /********** 新闻列表 **********/
        
        var news_controler = Backbone.View.extend
        ({
            initialize : function()
			{
				var that = this ;
				//加载更多按钮   
				var load_more_btn = require('load_more_btn')()                        
				
				$(this.el).parent().append(load_more_btn.$el)
				
				that.load_more_btn = load_more_btn
				
				that.load_more_btn.hide();
			},
			add_list_item : function(item_view)
			{
				$(this.el).append(item_view.$el)

				this.load_more_btn.show()
			},
			clear_list : function()
			{
				$(this.el).html("");
				
				//this.load_more_btn.hide()
			},
			hide_more_btn : function()
			{
				this.load_more_btn.hide()
			},
			more_btn_loading : function()
			{
				this.load_more_btn.loadding()
			},
			more_btn_reset : function()
			{
				this.load_more_btn.reset()
			},
			show_more_btn : function()
			{
				this.load_more_btn.reset()
			}
        })
	   
		
		var options = {
			title : "好友动态",
			route : { "news": "news" },
			transition_type : 'none'
		};

		options.initialize = function()
		{
			this.render();
		}
		
		var footer_view_obj
		options.render = function()
		{
			var that = this

			var template_control = require('get_template')

			var footer_view = require('footer_view')
			footer_view_obj = new footer_view({ cur : "friend" })
			
			var template_obj = template_control.template_obj()		        
			
			var init_html = template_obj.news;
							
			that.$el.append($(init_html))
            
        
			//底部
			that.$el.find('.footer').append(footer_view_obj.$el)
		}
		
		
		options.events = 
        {
            //加载更多
			'tap .data-more_btn' : function()
			{
				if(page_control.page_transit_status()) return false                                
                                
                news_collection_obj.get_more_item()		
			},
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false				                                                                
                
                news_collection_obj.refresh()    
			},
			'tap .no_login' : function()
			{
				//if(page_control.page_transit_status()) return false

				page_control.navigate_to_page("login")
			},
			'tap .ui-btn-user-wrap' : function()
			{
				//if(page_control.page_transit_status()) return false

				page_control.navigate_to_page("recommend")
			},
			'tap .no_data' : function()
			{
				//if(page_control.page_transit_status()) return false

				page_control.navigate_to_page("recommend")
			},
            'tap [data-select_firend_type]' : function(ev)
            {
                var cur_type = $(ev.currentTarget).attr("data-select_firend_type");                           
                                
                if(cur_type == 'act')
                {
                    page_control.navigate_to_page("friend")
                }                              
            }

		}
		

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
			
		}

        var is_login_tag
		var last_login_id = 0

		//页面显示时
		options.page_before_show = function(page_view,params_arr)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())

			//记录切换tab  add  2013.6.18
			footer_view_obj.change_friend_tab_select("news")

			notice.footer_notice_ui_refresh()
		   
			var poco_id = common_function.get_local_poco_id();

			var main_wraper = $(page_view.el).find('.main_wraper')                         
            
            if($(page_view.el).find(".border-btm").length>0)
            {
                $(page_view.el).find('.no_data').hide();    
            }
                                               

			if(poco_id==0)
			{        
				page_view.$el.find('.no_login').show()
				
				news_controler_obj.clear_list()
				
				page_view.$el.find('.friend-act').hide()

				//隐藏头部操作按钮
				$(page_view.el).find(".ui-btn-user-wrap").hide()
				$(page_view.el).find(".ui-btn-refresh-wrap").hide()
                $(page_view.el).find(".tab-select").hide()
				$(page_view.el).find(".header_title").html("好友动态")

				is_login_tag = false
				last_login_id = 0
			}
			else
			{
				if(last_login_id != poco_id) 
				{
					page_view.$el.find('.no_login').hide()
					page_view.$el.find('.no_authorize').hide()
					page_view.$el.find('.friend-act').show()
					
					news_controler_obj.clear_list()
					news_collection_obj.refresh()
                    news_controler_obj.hide_more_btn()
					
					is_login_tag = true;    
				}
				
				//解决多个帐号反复登录旧数据问题
				last_login_id = poco_id
				
				$(page_view.el).find(".ui-btn-user-wrap").show();
				$(page_view.el).find(".ui-btn-refresh-wrap").show();
                $(page_view.el).find(".tab-select").show()
                $(page_view.el).find(".header_title").html("")
                
                
			}
		}
		
		
		
		var view_scroll_obj		
		var cur_page_view
        var news_collection_obj
        var news_controler_obj
		var _page_view
        var has_init 
        var news_refresh_btn

		//页面初始化时
		options.page_init = function(page_view,params_arr)
		{
			
			_page_view = page_view

			

			cur_page_view = $(page_view.el);        
			_params_arr = params_arr;
			
			news_refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(news_refresh_btn.$el)
			
			var view_scroll = require('scroll')                    
			
			var list_container = $(page_view.el).find('.main_wraper');  
            
            view_scroll_obj = view_scroll.new_scroll(list_container,{
				'view_height' : common_function.container_height_with_head_and_nav(),
				use_lazyload : true
			})    			            

			page_view.$el.find('.no_login').css('height',common_function.container_height_with_head_and_nav()) 
			page_view.$el.find('.no_authorize').css('height',common_function.container_height_with_head_and_nav())             
            
            news_controler_obj = new news_controler
            ({
                el : $(page_view.el).find('.news-item')
            });
            
                            			                                                                                   
            
            if(!news_collection_obj)
            {                
                news_collection_obj = new news_collection;   
            }                                        
                        
                                    
            //刷新列表监听
			news_collection_obj.bind('reset', re_render_news_list , cur_page_view)
			
			//加载更多监听
			news_collection_obj.bind('add', add_render_news_list , cur_page_view)
			
            if(has_init)
            {
                return;
            }
            
			news_collection_obj.refresh()
            
            has_init = true;
                        
		}
		
        function re_render_news_list()
		{  
			
		    news_controler_obj.clear_list()
            
			news_collection_obj.each(function(item_model)
			{
				var item_view = new news_item_view({ 
					model : item_model ,
                    pic_size : pic_size			                
				})			            
				
				//每次add入列表
				news_controler_obj.add_list_item(item_view)							 
			})
            
            //滚回顶部
			view_scroll_obj.scroll_to(0)
		}
        
        function add_render_news_list(item_model)
		{	   
			var item_view = new news_item_view({ 
				model : item_model ,
                pic_size : pic_size			      
			})                			
			
			//每次add入列表
			news_controler_obj.add_list_item(item_view)   						  
		}
        
		
		
		var page = require('page').new_page(options);
		
		return page;
	} 
})

if(typeof(process_add)=="function")
{
	process_add()
}