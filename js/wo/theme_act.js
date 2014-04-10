define('wo/theme_act',["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","new_alert_v2","show_big_img","select_module"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
    var wo_config = require('wo_config')
	var new_alert_v2 = require("new_alert_v2")
    var iscroll_class = require('iScroll') 
        
	exports.route = { "theme_act": "theme_act" }
            
    exports.new_page_entity = function()
	{
		var _page_view
		var view_scroll_obj
		var alert_tips
        var theme_act_list_collection_obj
        var pic_size
        var theme_act_controler_obj
	    var page_count = 10
	    var tag_name = false
	  
		var options = {
			title : '个人主页',
			route : { "theme_act": "theme_act" },
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

			var init_html = '<div class="theme_act_page font_wryh"><header class="header re tc fb">主题活动<div class="ui-btn-header-wrap ui-btn-click-wrap" data-filter_in><div class="ui-btn-header ui-btn-filter ui-btn-click radius-2px"><label class="filter_text dib w-100 h-100 f12">筛选</label></div></div></header><div class="main_wraper"><div style="padding-top:45px;"><div class="theme-act p10"><div class="theme-act-wrap"></div></div></div></div>'        
							
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
				tag_name = select_data.val
				theme_act_list_collection_obj.refresh()
			}
		})
		
		
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed,index_page)
			{
				alert_tips.close()
				
                if(response==false)
                {
                    theme_act_controler_obj.return_paging_btn().hide() 
                }  
			
                if(response==null)
    			{
    				theme_act_controler_obj.return_paging_btn().reset()                                        
                    
    				return
    			}               
    
    			if(index_page>1) 
    			{

    				theme_act_controler_obj.return_paging_btn().open_pre_page_btn()
    			}
    			else
    			{
    				theme_act_controler_obj.return_paging_btn().ban_pre_page_btn()
    			}
    			
    			if(response==false || response.length < page_count)
    			{
    				theme_act_controler_obj.return_paging_btn().ban_next_page_btn()
    			}
    			else
    			{
    				theme_act_controler_obj.return_paging_btn().open_next_page_btn()
    			}                
				   
			},
			before_refresh : function()
			{
				alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",append_target:_page_view.$el})
                
				
			},            
			before_get_more : function()
            {
                theme_act_controler_obj.more_btn_loading()
            }
			
		}

        //数据model
    	var theme_act_list_model = Backbone.Model.extend
        ({
    		defaults:
    		{
    		
    		}
    	})
 
		//初始化主题活动数据
		
		var theme_act_list_collection = Backbone.Collection.extend
        ({ 
		    model : theme_act_list_model, 
			url : function()
			{
                return wo_config.ajax_url.theme_act
			},
            refresh : function()
			{
			    var that = this 
				
                collection_options.data = { tag_name : tag_name }
				
				common_function.collection_refresh_function.call(this,collection_options)
			},
			get_more_item : function(is_pre_page)
			{
				var that = this
				
				//瀑布流列表的order ukey处理
				if(this.models.length>0 && !is_pre_page)
				{
					collection_options.data = { tag_name : tag_name }
				}
				else
				{
					options.data = {}
				}
				
				common_function.collection_get_more_function.call(this,collection_options,is_pre_page)
			}
		})
		
	
		
         //主题活动列表视图
        var theme_act_list_view = Backbone.View.extend
        ({
    		  tagName: "div",
    		  className: "theme-act-item bdb-line p10 mb10 bgcfff radius-2px",
    		  initialize: function(json_data) 
    		  {
    		      this.render();
    	
    		  },
              events: 
              {
                 "tap .theme-act-item": function() 
				{  
					page_control.navigate_to_page("theme_pic_list/"+encodeURIComponent(this.title))
				}
              },
              render : function()
              {
                var json_data = this.model.toJSON()   

                json_data.pic_size = pic_size
				this.title = json_data.title
				this.user_count = parseInt(json_data.user_count)
				this.article_count = parseInt(json_data.article_count)
                
				
				if(json_data.status==1)
				{
					json_data.on_going = 1
				}
				
                var cover_img_str_arry = [] 
				
                var len = json_data.cover_img_list.length

    		    for(var i = 0;i<len;i++)
                {
                    var cover_img = json_data.cover_img_list[i]
       
                    if(!common_function.is_empty(cover_img))
                    {                        
                        var cover_img_url_ss = common_function.matching_img_size(cover_img,"ss") 
						
						var cover_img_str = '<img lazyload_src='+cover_img_url_ss+' class="img_buffer_bg fl mr10" style="width:{{pic_size}};height:{{pic_size}}" data_to_word />'
						
						cover_img_str_arry.push(cover_img_str)	

                    }
					if( i == 3)
					{
						break
					}
                } 

    			
    			var template = '<div class="clearfix"><div class="title f16 color333 fl">{{title}}</div>{{#on_going}}<div class="hot fl re radius-2px font-arial colorfff"><em class="hot_icon"></em>HOT</div>{{/on_going}}</div><p class="color999 mt5"><span class="font-arial">{{user_count}}</span>人参加，<span class="font-arial">{{article_count}}</span>张图片</p><div class="img-list mt10 clearfix">'+cover_img_str_arry.join("")+'</div>'
                
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
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false
				
                theme_act_list_collection_obj.refresh()

			},
			'tap .ui-btn-prev-wrap' : function(ev)
			{			     
				page_control.back()
			},
			'tap .pre_paging_btn' : function()
			{
				var paging_btn = theme_act_controler_obj.return_paging_btn()
				
				if( paging_btn.get_pre_page_btn_ban_mode() ) return false
                
				theme_act_list_collection_obj.get_more_item(true)
			},
			'tap .next_paging_btn' : function()
			{
				var paging_btn = theme_act_controler_obj.return_paging_btn()
				
				if( paging_btn.get_next_page_btn_ban_mode() ) return false

				theme_act_list_collection_obj.get_more_item(false)
			},
			'tap [data-filter_in]' : function(ev)
            {
				select_module_obj.open()
			}
		
		};
		

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head()) 
			
			pic_size =  parseInt((window.innerWidth-10*2-10*2-10*3)/4)
			
			$(page_view.el).find("[data_to_word]").css({"width" : pic_size,"height" : pic_size})
			                 
		}
        
		
		options.page_before_hide = function()
		{
			select_module_obj.close()
		}

		//页面初始化
		options.page_init = function(page_view,params_arr,state)
		{
			  _page_view = page_view
					                   
	
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
			theme_act_list_collection_obj = new theme_act_list_collection  
			
			theme_act_controler_obj = new theme_act_controler
            ({
                el : $(page_view.el).find('.theme-act-wrap')
            });

			
			//刷新列表监听
			theme_act_list_collection_obj.bind('reset', re_render_list , page_view)
			
			//加载更多监听
			theme_act_list_collection_obj.bind('add', add_render_list , page_view)
			
		    theme_act_list_collection_obj.refresh()
	 
		}
		
		function re_render_list()
		{
			var that = this;			        

			theme_act_controler_obj.clear_list()
			
			theme_act_list_collection_obj.each(function(item_model)
			{
				var theme_act_list_view_obj = new theme_act_list_view
                ({
                    model : item_model
                })	
                
				//每次add入列表
				theme_act_controler_obj.add_list_item(theme_act_list_view_obj)
                
			})
			
			setTimeout(function()
			{
			    //滚回顶部
                view_scroll_obj.scroll_to(0)
			},50)
			
			_page_view.$el && _page_view.$el.find('header').animate({'translate3d':'0px, 0px, 0px'},0,'ease-in')

		}
		
		
		function add_render_list(item_model)
		{	   
			var theme_act_list_view_obj = new theme_act_list_view({ 
				model : item_model			      
			})                			
			
			//每次add入列表
			theme_act_controler_obj.add_list_item(theme_act_list_view_obj)   	
			
			console.log(11111)
		}
		
		// 计算活动主题图片高度
	    pic_size =  parseInt((window.innerWidth-10*2-10*2-10*3)/4)+"px"
		 
		 
		// 控制器
        var theme_act_controler = Backbone.View.extend
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