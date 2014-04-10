define("wo/my_image_wall",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","new_alert_v2","img_process","popup"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
    var Mustache = require('mustache')
    var new_alert_v2 = require("new_alert_v2")
    
    var no_tap_tag = true;
    var alert_tips
    var view_scroll_obj
    var sizes 
    
	exports.route = { "my_image_wall": "my_image_wall" }

	exports.new_page_entity = function()
	{
		var options = {		
			transition_type : 'slide',
			dom_not_cache: true
		}	
        
        var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
                alert_tips.close();
                
                my_grid_box_refresh_btn.reset()
			},
			before_refresh : function()
			{
				alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",is_cover:true ,append_target:_page_view})
                
                my_grid_box_refresh_btn.loadding();
			}
			
		}
        
        //数据model
    	var my_life_grid_model = Backbone.Model.extend
        ({
    		defaults:
    		{
    		
    		}
    	})
 
		//初始化数据
		
		var my_life_grid_collection = Backbone.Collection.extend
        ({
            model : my_life_grid_model,    
			url : function()
			{
                return wo_config.ajax_url.get_my_wonderful_article_list
			},
            refresh : function()
			{
			    var that = this 
                
				common_function.collection_refresh_function.call(this,collection_options)
			},
            parse: function(response) 
			{
				if(response && typeof(response.list)!="undefined")
				{
					return response.list
				}
				else
				{
					return response
				}
			}
		})
                
		
        // 九宫格项
        var my_life_grid_item_view = Backbone.View.extend
        ({
            tagName : "div",
            className : "grid_box_container bdb-line has_img",            
            initialize : function(options) 
    		{            
    		    var that = this;        
                
                that.no_img_tag = false;                                
                
                that.reset_tag = options.model.reset_tag   
                
                that.options.model = options.model;                                                           
                
    			that.render();

    		},
    		events : 
            {
                'tap [data-my_life_pic_box]' : function(ev)
                {
                    var that = this;
                    
                    var cur_btn = $(ev.currentTarget);                                        
                                                            
                    page_control.navigate_to_page("choose_my_image",{font_cover_btn:that,display_order:that.display_order})
                },
                'hold [data-my_life_pic_box]' : function(ev)
                {
                    // 取消图片
                    
                    var that = this;
                    
                    that.reset_item(that.display_order);
                    
                    common_function.send_request
        			({
        				url : wo_config.ajax_url.update_my_image_box,
        				type : "GET",
        				data : { art_id : that.art_id , is_select : 0 , display_order : that.display_order }
                     })
                     
                    new_alert_v2.show({text:"已取消", type : "success" , auto_close_time : 800})
                }
    		},
            render : function()
            {
                var that = this                                
                
                if(that.reset_tag)
                {                    
                    var data = that.options.model; 
                }
                else
                {
                    var data = this.model.toJSON();    
                }
                                                            
                
                that.display_order = data.display_order     
                
                that.art_id = data.art_id 
                   
                that.cover_img_url = data.cover_img_url                                                                                                                                                                    
                
                if(data.cover_img_url)
                {
                    data.cover_img_url = common_function.matching_img_size(data.cover_img_url,"ss")   
                }                                
                
                var template = '{{#cover_img_url}}<img class="my_life_img" src="{{cover_img_url}}">{{/cover_img_url}}{{^cover_img_url}}<table class="has_cover_container" cellspacing="0" cellpadding="0" border="0" width="100%" height="100%"><tr><td align="center" valign="middle"><div class="add_container"><div class="add_icon icon-bg-common"></div><div data-grid_box_txt class="txt">{{cat_name}}</div></div></td></tr></table>{{/cover_img_url}}' 
                
                var html = Mustache.to_html(template, data)			                                            
                
                $(this.el).html(html) 
                
                $(this.el).attr({"data-my_life_pic_box":"","data-display_order":that.display_order})
                
                $(this.el).width(sizes)          
                
                $(this.el).height(sizes)                  
                
                                               
                
            },
            change_font_cover_img : function(img_url)
            {
                var that = this;
                
                $(this.el).find("img").attr("src",img_url)
                 
            },
            reset_item : function(display_order)// 重置格子
            {
                var before_one = _page_view.find(".has_img[data-display_order ='"+display_order+"']");                                                                				                
                
                var no_img_grid_item_view_obj = new no_img_grid_view_item
                ({
                    display_order : display_order
                });
                
                before_one.before(no_img_grid_item_view_obj.$el)                                        
                    
  				before_one.remove();
            }
            
        })
        
        // 没有封面的格子
        var no_img_grid_view_item = Backbone.View.extend
        ({
            tagName : "div",
            className : "grid_box_container bdb-line white_container no_img",            
            initialize : function(options) 
    		{            
    		    var that = this;                                                                      
                
                that.display_order = options.display_order 
                
                that.no_img_tag = true;
                
    			that.render();                                       
                                      

    		},
    		events : 
            {
                'tap [data-my_life_pic_box]' : function(ev)
                {
                    var that = this;
                    
                    var cur_btn = $(ev.currentTarget);                         
                    
                    console.log("that.display_order:"+that.display_order)               
                                                            
                    page_control.navigate_to_page("choose_my_image",{font_cover_btn:that,display_order:that.display_order})
                }
    		},
            render : function()
            {
                var that = this                                   
                
                var template = '<table class="has_cover_container" cellspacing="0" cellpadding="0" border="0" width="100%" height="100%"><tbody><tr><td align="center" valign="middle"><div class="add_container"><div class="add_icon icon-bg-common"></div></div></td></tr></tbody></table>'                                 			                                            
                
                $(this.el).html(template)                                        
                
                $(this.el).attr({"data-my_life_pic_box":"","data-display_order":that.display_order})
                
                $(this.el).width(sizes)          
                
                $(this.el).height(sizes)
                                               
                
            },
            reset_item : function(img_url,display_order)
            {
                var that = this;
                
                if(img_url)
                {
                    var before_one = _page_view.find(".no_img[data-display_order ='"+display_order+"']");
                                        
                    var item_view = new my_life_grid_item_view
                    ({ 
    					model : {cover_img_url:img_url,display_order:display_order,reset_tag : true}               
    				})			            
    				
                    before_one.before(item_view.$el)
                    
                    console.log(item_view.$el)
                    
    				before_one.remove();
                }
                 
            }
            
        })
        
        var my_life_grid_controler = Backbone.View.extend
        ({

            initialize : function()
            {
                var that = this ;
               
            },
            add_list_item : function(item_view)
            {                                               
                $(this.el).append(item_view.$el)            
                 	
            },
            replace_list_item : function(item_view)
            {                                               
                $(this.el).append(item_view.$el)            
                
                var display_order = item_view.display_order;  
                
                if(item_view.cover_img_url)
                {
                    var before_one = _page_view.find(".no_img[data-display_order ='"+display_order+"']");
                    before_one.before(item_view.$el);
                    before_one.remove();
                } 	
            },
            clear_list : function()
            {
                $(this.el).html("");
            }
        });
		
		options.initialize = function()
		{
			this.render();
		}
			
		options.render = function()
		{
			var template_control = require('get_template')
			
			var template_obj = template_control.template_obj()
			
			var init_html = '<div class="wrap-box my_grid_life_wrap"><header class="my_grid_life_header header font_wryh clearfix"><h3 class="tc"><span class="user_title"><label></label><span style="display: inline-block;overflow: hidden;">我的聚光片</span></span></h3></header><div class="content-8 main_wraper"><div class="my-left-box-page font_wryh" style="padding-top:45px;"><div class="preview_btn_container"><table cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td><div class="des icon-bg-common"></div></td><td align="right"><div class="preview_btn ui-btn-header ui-btn-save radius-2px" style="margin:0;display:inline-block" data-preview_btn><label class="txt" style="font-size:12px;font-weight:normal;">预览</label></div></td></tr></table></div><div class="grid_box"></div></div></div></div>'        						
 
			this.$el.append($(init_html))

		}
		
		options.events = {
			//后退
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
            'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false

				my_life_grid_collection_obj.refresh()
			},
            'tap [data-preview_btn]' : function()
            {
                if(_page_view.find(".has_img").length == 0)
                {
                    new_alert_v2.show({text:"还没有选择图片哦!", type : "info" , auto_close_time : 800})
                    return;
                }
                page_control.navigate_to_page("user_profile/"+poco_id+"/from_preview_image_wall");
            }         
            
			
		}

				
		var _page_view
		var _params_arr
		var _state		
        var my_life_grid_controler_obj
        var my_life_grid_collection_obj
        var my_grid_box_refresh_btn
        var poco_id 
        
        options.page_back_show = function()
        {           
			//my_life_grid_collection_obj.refresh()
        }
        
        options.window_change = function(page_view)
		{
			_page_view.find('.main_wraper').height(common_function.container_height_with_head())
			
			set_grid_box()  
		}
        
		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{ 
		    //未登录处理
		  
		    poco_id = common_function.get_local_poco_id()
		                			
			if(poco_id<=0)
			{
				new_alert_v2.show({ text:"尚未登录",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
					
					page_control.back()
				}})

				return false
			}
            
              
		    // 记录我的页面的九格宫红点
            window.localStorage.setItem('my_grid_point',1)  
		  
		    var that = this		  			
			            
            _page_view = $(page_view.el)             			            						            
           
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('.my_grid_life_header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)         
            
            //刷新按钮  add by manson 2013.5.7
			my_grid_box_refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(my_grid_box_refresh_btn.$el)     
            
            //容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')
            var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{				
				'view_height' : common_function.container_height_with_head()
			})
            
            my_life_grid_controler_obj = new my_life_grid_controler
			({
				el : $(page_view.el).find('.my-left-box-page .grid_box')
			});                                 

            // 初始化数据集
			my_life_grid_collection_obj = new my_life_grid_collection              
			
			//我的九宫格刷新列表监听
			my_life_grid_collection_obj.bind('reset', my_life_grid_box_re_render_list , page_view)			
			
			my_life_grid_collection_obj.refresh()
            
		}
        
        function my_life_grid_box_re_render_list()
		{
			var that = this;	
            
            my_life_grid_controler_obj.clear_list()	 
            
            for(var i=0;i<9;i++)
            {
                var no_img_grid_item_view_obj = new no_img_grid_view_item
                ({
                    display_order : i+1
                });
                
                my_life_grid_controler_obj.add_list_item(no_img_grid_item_view_obj) 
            }
                                                                   			
			my_life_grid_collection_obj.each(function(item_model)
			{
			 
				var item_view = new my_life_grid_item_view
                ({ 
					model : item_model               
				})			            
				
				//每次替换格子到列表
				my_life_grid_controler_obj.replace_list_item(item_view) 
                                
								 
			})
            
            set_grid_box()
            
		}

	    function set_grid_box()
        {
            sizes = parseInt((window.innerWidth-(32))/3); // 屏宽-页面边距-每个小方图的边距            
            
            if(_page_view.find(".grid_box_container").last().width() != sizes)
            {
                _page_view.find(".grid_box_container").width(sizes).height(sizes)
            
            }
        }
	    

		
		var page = require('page').new_page(options)
		
		return page
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}