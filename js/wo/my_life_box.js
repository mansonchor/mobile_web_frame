define("wo/my_life_box",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","new_alert_v2","img_process","popup"],function(require, exports)
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
    
	exports.route = { "my_life_box": "my_life_box" }

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
				alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",is_cover:true,append_target:_page_view})
                
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
                return wo_config.ajax_url.my_life_grid_box
			},
            refresh : function()
			{
			    var that = this 
                
				common_function.collection_refresh_function.call(this,collection_options)
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
			}
		})
                
		
        // 九宫格项
        var my_life_grid_item_view = Backbone.View.extend
        ({
            tagName : "div",
            className : "grid_box_container bdb-line",            
            initialize : function() 
    		{            
    		    var that = this;                                                                      
                
    			that.render();

    		},
    		events : 
            {
                'tap [data-my_life_pic_box]' : function(ev)
                {
                    var that = this;
                    
                    var cur_btn = $(ev.currentTarget);                                        
                                                            
                    page_control.navigate_to_page("choose_my_pic/"+that.tag_id,{font_cover_btn:that,cat_name:that.cat_name})
                }
    		},
            render : function()
            {
                var that = this
                
                var data = this.model.toJSON();           
                
                that.cat_name = data.cat_name;    
                
                that.cat_count = data.cat_count;      
                
                that.tag_id = data.cat_conf_id;                                                                                                                            
                
                if(data.cat_img)
                {
                    data.cat_img = common_function.matching_img_size(data.cat_img,"ss")   
                }                                
                
                var template = '{{#cat_img}}<img class="my_life_img" src="{{cat_img}}"><div class="num_container"><span data-cat_count>{{cat_count}}</span></div><div class="grid_box_txt"><div data-grid_box_txt>{{cat_name}}</div></div>{{/cat_img}}{{^cat_img}}<table class="has_cover_container" cellspacing="0" cellpadding="0" border="0" width="100%" height="100%"><tr><td align="center" valign="middle"><div class="add_container"><div class="add_icon icon-bg-common"></div><div data-grid_box_txt class="txt">{{cat_name}}</div></div></td></tr></table>{{/cat_img}}' 
                
                var html = Mustache.to_html(template, data)			                                            
                
                $(this.el).html(html) 
                
                $(this.el).attr({"data-my_life_pic_box":""})
                             
                if(!data.cat_img)
                {
                    $(this.el).addClass("white_container")
                }                                
                
            },
            set_font_cover_img : function(img_url,title,count)
            {
                var that = this;
                
                if(count>0)
                {
                    if(img_url)
                    {
                        $(this.el).html('<img class="my_life_img" src="'+img_url+'"><div class="num_container"><span data-cat_count>'+count+'</span></div><div class="grid_box_txt"><div data-grid_box_txt>'+title+'</div></div>')    
                    }
                    else
                    {
                        $(this.el).find("[ data-cat_count]").html(count)
                    }
                    
                    
                    that.cat_count = count     
                }
                else
                {
                    $(this.el).html('<table class="has_cover_container" cellspacing="0" cellpadding="0" border="0" width="100%" height="100%"><tr><td align="center" valign="middle"><div class="add_container"><div class="add_icon icon-bg-common"></div><div data-grid_box_txt class="txt">'+title+'</div></div></td></tr></table>')
                    $(this.el).addClass("white_container")
                }
                 
            }
            
        })
        
        var my_life_grid_controler = Backbone.View.extend
        ({

            initialize : function()
            {
                var that = this ;
               
            },
            add_list_item : function(item_view,i)
            {                                               
                $(this.el).append(item_view.$el) 	
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
			
			var init_html = '<div class="wrap-box my_grid_life_wrap"><header class="my_grid_life_header header font_wryh clearfix"><h3 class="tc"><span class="user_title"><label></label><span style="display: inline-block;overflow: hidden;">我的生活九宫格</span></span></h3></header><div class="content-8 main_wraper"><div class="my-left-box-page font_wryh" style="padding-top:45px;"><div class="banner_tips tips bdb-line"><table cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td align="center" valign="middle"><div class="tips_icon icon-bg-common"></div></td><td><div class="tips_content">在个人主页上，用最好的照片展示我的生活。</div></td></tr></table></div><div class="grid_box"></div></div></div></div>'       						

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
			}         
            
			
		}

				
		var _page_view
		var _params_arr
		var _state		
        var my_life_grid_controler_obj
        var my_life_grid_collection_obj
        var my_grid_box_refresh_btn
        
        options.page_back_show = function()
        {           
			my_life_grid_collection_obj.refresh()
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
            /*
			var poco_id = common_function.get_local_poco_id()
			if(poco_id<=0)
			{
				new_alert_v2.show({ text:"尚未登录",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
					
					page_control.back()
				}})

				return false
			}
            */
              
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
            
			_page_view.find('.my-left-box-page .grid_box').html('')

			my_life_grid_collection_obj.each(function(item_model)
			{
			 
				var item_view = new my_life_grid_item_view
                ({ 
					model : item_model               
				})			            
				
				//每次add入列表
				my_life_grid_controler_obj.add_list_item(item_view) 
                                
								 
			})
            
            set_grid_box()
            
		}

	    function set_grid_box()
        {
            var sizes = parseInt((window.innerWidth-(32))/3); // 屏宽-页面边距-每个小方图的边距
            
            _page_view.find(".grid_box_container").width(sizes).height(sizes);
        }
	    

		
		var page = require('page').new_page(options)
		
		return page
	}
})