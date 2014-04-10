define('wo/daily',["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","new_alert_v2"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
    var wo_config = require('wo_config')
	var new_alert_v2 = require("new_alert_v2")
    var iscroll_class = require('iScroll') 
        
	exports.route = { "daily": "daily" }
            
    exports.new_page_entity = function()
	{
		var _page_view
		var view_scroll_obj
		var alert_tips
		var refresh_btn
        var daily_list_collection_obj
		var daily_list_controler_obj
	    var page_count = 10


		var options = {
			title : '个人主页',
			route : { "daily": "daily" },
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
			var that = this
			
            var init_html = '<div class="world-news-page font_wryh"><header class="header re tc fb">世界日报</header><div class="main_wraper"><div style="padding-top:45px;"><div class="world-news m10"><ul class="world-news-list bdb-line mb10 bgcfff"></ul></div></div></div>'
            
			this.$el.append($(init_html))
		}

		
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed,index_page)
			{
				alert_tips.close()
                
                if(response==false)
                {
                    daily_list_controler_obj.return_paging_btn().hide() 
                }  
			
                if(response==null)
    			{
    				daily_list_controler_obj.return_paging_btn().reset()                                        
                    
    				return
    			}               
    
    			if(index_page>1) 
    			{

    				daily_list_controler_obj.return_paging_btn().open_pre_page_btn()
    			}
    			else
    			{
    				daily_list_controler_obj.return_paging_btn().ban_pre_page_btn()
    			}
    			
    			if(response==false || response.length < page_count)
    			{
    				daily_list_controler_obj.return_paging_btn().ban_next_page_btn()
    			}
    			else
    			{
    				daily_list_controler_obj.return_paging_btn().open_next_page_btn()
    			}                
				   
			},
			before_refresh : function()
			{
				alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",append_target:_page_view.$el})
                
                //refresh_btn.loadding();
				
			},            
			before_get_more : function()
            {
                daily_list_controler_obj.more_btn_loading()
            }
			
		}
		

        //数据model
    	var daily_list_model = Backbone.Model.extend
        ({
    		defaults:
    		{
    		
    		}
    	})
		
 
		//初始化日报数据
		var daily_list_collection = Backbone.Collection.extend
        ({ 
		    model : daily_list_model, 
			url : function()
			{
                return wo_config.ajax_url.daily 
			},
            refresh : function()
			{
			    var that = this 
                
				common_function.collection_refresh_function.call(this,collection_options)
			},
			get_more_item : function(is_pre_page)
			{
				var that = this
				
				//瀑布流列表的order ukey处理
				if(this.models.length <=0 || is_pre_page)
				{

					options.data = {}

				}
				common_function.collection_get_more_function.call(this,collection_options,is_pre_page)
			}
		})
		
		
         //日报列表视图
        var daily_list_view = Backbone.View.extend
        ({
    		  tagName: "li",
    		  className: "li-world-list pl10 pt10 pr10",
    		  initialize: function(json_data) 
    		  {
    		      this.render()
    	
    		  },
              events: 
              {
                 "tap .li-world-list": function() 
				{  
					page_control.navigate_to_page("world_daliy/"+this.newspaper_id+"/1")
				}
              },
              render : function()
              {
                var json_data = this.model.toJSON()          
                            
                this.title = json_data.title
				this.begin_date = json_data.begin_date
				this.newspaper_id = parseInt(json_data.newspaper_id)
			
                if(json_data.cover_img_url_small)
                {
                    json_data.cover_img_url_small = common_function.matching_img_size(json_data.cover_img_url_small,"ss")   
                }
				
				this.cover_img_url_small = json_data.cover_img_url_small
    			
    			var template = '<div class="bdb-line-e6e pb10"><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tr><td width="75"><div class="img-box re"><img src={{cover_img_url_small}} class="img_buffer_bg w-100"><div class="fade colorfff w-100 tc f10"><p>{{begin_date}}</p></div></div></td><td><div class="f14 color333" style="font-size:16px">{{title}}</div></td></tr></table></div>'
                
    			var html = Mustache.to_html(template, json_data)
                
    			$(this.el).html(html)
                
              } 
    		     
		})
 
		options.events = {
			
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{				    				    
                    page_control.back()
				}
			},
			'tap .ui-btn-prev-wrap' : function(ev)
			{			     
				page_control.back()
			},
			'tap .pre_paging_btn' : function()
			{
				var paging_btn = daily_list_controler_obj.return_paging_btn()
				
				if( paging_btn.get_pre_page_btn_ban_mode() ) return false
                
				daily_list_collection_obj.get_more_item(true)
			},
			'tap .next_paging_btn' : function()
			{
				var paging_btn = daily_list_controler_obj.return_paging_btn()
				
				if( paging_btn.get_next_page_btn_ban_mode() ) return false

				daily_list_collection_obj.get_more_item(false)
			}
			
		}
		

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())                  
		}
        

		//页面初始化
		options.page_init = function(page_view,params_arr,state)
		{
			  _page_view = page_view
					
            /*
			//刷新按钮
			refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(refresh_btn.$el)                        
			*/
			
			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')   
			var view_scroll = require('scroll')                
			
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head(),
				use_lazyload : true
			})                                  
			

            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)       
     
	        // 初始化数据集
			daily_list_collection_obj = new daily_list_collection 
			
			
			daily_list_controler_obj = new daily_list_controler
            ({
                el : $(page_view.el).find('.world-news-list')
            });

			
			//刷新列表监听听
			daily_list_collection_obj.bind('reset', re_render_list , page_view)
	 
	      //加载更多监听听
			daily_list_collection_obj.bind('add', add_render_list , page_view)
			
			daily_list_collection_obj.refresh()
		}	
		
		function re_render_list()
		{
			var that = this			        

			daily_list_controler_obj.clear_list()
			
			daily_list_collection_obj.each(function(item_model)
			{
				var daily_list_view_obj = new daily_list_view
                ({
                    model : item_model
                })	
                
				//每次add入列表
				daily_list_controler_obj.add_list_item(daily_list_view_obj)
                
			})
			
			//滚回顶部
			view_scroll_obj.scroll_to(0)
			
			_page_view.$el && _page_view.$el.find('header').animate({'translate3d':'0px, 0px, 0px'},0,'ease-in')

		}
		
		
		function add_render_list(item_model)
		{	   
			var daily_list_view_obj = new daily_list_view({ 
				model : item_model			      
			})                			
			
			//每次add入列表
			daily_list_controler_obj.add_list_item(daily_list_view_obj)   	

		}
		
		// 控制器
        var daily_list_controler = Backbone.View.extend
        ({
            initialize : function()
			{
				var that = this 
                
                //加载更多按钮
				var load_more_btn = require('paging_btn')()                
               
				$(this.el).parent().append(load_more_btn.$el)                                

				that.load_more_btn = load_more_btn    
                                
			},
			add_list_item : function(item_view)
			{
                var that = this;
			 
				$(this.el).append(item_view.$el)
                
                that.load_more_btn.show()
			},
			clear_list : function()
			{
				$(this.el).html("");                  						
			},
			return_paging_btn : function()
			{
				return this.load_more_btn
			},
            more_btn_loading : function()
			{
				this.load_more_btn.loadding()
			}        
        })
		
		var page = require('page').new_page(options)
		
		return page
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}