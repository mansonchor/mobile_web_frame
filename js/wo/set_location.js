define("wo/set_location",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	var Mustache = require('mustache')
    var new_alert_v2 = require("new_alert_v2")
    
    
    exports.route = { "set_location": "set_location" }

	exports.new_page_entity = function()
	{
		var view_scroll_obj
		
		var _page_view 
        
        var alert_tips
        
        var no_tap_tag = true 

		var options = {	
			transition_type : 'slide',
			dom_not_cache : true
		}
		
		options.initialize = function()
		{
			this.render();
		}
		
        var get_location_data ;

        
        // 省份列表子项
        var province_list_item_view = Backbone.View.extend
        ({
            tagName : "div",
            className : "items",
            initialize : function() 
    		{            
    		    var that = this;                                                                      
                
    			that.render();  
    		},
            render : function()
            {                                                
                
                if(this.options.no_choice_item)
                {
                    var template = '<div class="input-box" data-to_city="1" ><table border="0" cellspacing="0" cellpadding="0" class="reset_table"><tbody><tr><td style="width: 100%;">不选择</td></tr></tbody></table></div>'    
                } 
                else
                {
                    var data = this.options.data;
                
                    this.id = data.id;
                    this.name = data.name;
                
                    var template = '<div class="input-box" data-to_city ><table border="0" cellspacing="0" cellpadding="0" class="reset_table"><tbody><tr><td style="width: 100%;">{{name}}</td></tr></tbody></table></div>'
                }
                
                var html = Mustache.to_html(template, data)			            
                
                $(this.el).html(html) 
            },
            events:
            {
                'tap [data-to_city]' :function(ev)
                {
                                        
                    var that = this;
                    
                    if(!this.id)
                    {
                        if(_state!=null)
                        {
                            var str = "";
                            
                            if(!_state.from_edit_page)
                            {
                                str = '所有地区'    
                            }
                                                        
                            _state.edit_location_obj.attr({"data-province_id":0,"data-city_id":0}).val(str);
                            
                        }
                        
                        page_control.back();
                        return;
                    }
                    
                    cur_province_item = that;                    
                    
                    show_city_list(this.id)
                    
                    setTimeout(function()
                    {
                        no_tap_tag = false;
                    },500)
                } 
            }
        })
        
        // 城市列表子项
        var city_list_item_view = Backbone.View.extend
        ({
            tagName : "div",
            className : "items",
            initialize : function() 
    		{            
    		    var that = this;                                                                      
                
    			that.render();  
    		},
            render : function()
            {                
                
                var data = this.options.data;
                
                this.id = data.id;
                this.name = data.name;
                
                var template = '<div class="input-box" data-to_city ><table border="0" cellspacing="0" cellpadding="0" class="reset_table"><tbody><tr><td style="width: 100%;">{{name}}</td></tr></tbody></table></div>' 
                
                var html = Mustache.to_html(template, data)			            
                
                $(this.el).html(html) 
            },
            events:
            {
                'tap [data-to_city]' :function(ev)
                {
                    if(no_tap_tag)
                    {
                        return;
                    }
                    
                    var that = this;       
                    
                    var province_name = cur_province_item.name;
                    var province_id = cur_province_item.id;      
                    var city_id = that.id;
                    var city_name = that.name  
                    
                    if(province_name == city_name)
                    {
                        var area_name = city_name
                    }
                    else
                    {
                        var area_name = province_name+" "+city_name
                    }
                                            
                    
                    
                    if(_state!=null)
                    {
                        _state.edit_location_obj.attr({"data-province_id":province_id,"data-city_id":city_id}).val(area_name);
                    }
                    
                    page_control.back();
                }
            }
        })

		options.render = function()
		{
			var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><div style="display:none;left: 5px;" data-back_to_province class="ui-btn-header-wrap "><div class="ui-btn-header ui-btn-prev radius-2px"><span class="icon icon-arrow icon-bg-common"></span></div></div><h3 class="clearfix" style="display:inline-block;width:100%;text-align:center"><span class=""><label data-nick_name></label>地区设置</span></h3></header><div class="content-10 main_wraper" style="padding: 0 10px;"><div class="set_location_list mt10 font_wryh" style="position:relative;padding-top:45px;padding-bottom:20px"><div data-province_list class="font_wryh clearfix" id="container" style="visibility:hidden;background:#fff;position:relative"><div data-location_list></div></div><div data-city_list class="font_wryh clearfix" id="container" style="display:none;position:relative"><div data-location_list></div></div></div></div></div>'						 

			this.$el.append($(init_html))
		}
       
		options.events = {			
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
            'click [data-back_to_province]' : function()
            {                
                hide_city_list();
            }
		}

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())            
		}
		

		//页面显示时
		var is_login_tag = true
		options.page_before_show = function(page_view)
		{ 
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
		}

        
        var user_id        
	    var refresh_btn        
        var _params_arr 
        var _page_view
        var _state
        var poco_id        
        var page_back_btn
        var cur_province_item
        var get_location_data
        
        
		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			var that = this;
			
			_page_view = $(page_view.el)		
			_params_arr = params_arr
            _state = state
                        
			if(_params_arr[0])
			{
				poco_id = _params_arr[0]
			}
            else
			{
				poco_id = common_function.get_local_poco_id()
			}   
                        
           
			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head()
			})
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
            
            if(_state!=null&&_state.edit_location_obj ==null)
            {
                setTimeout(function()
                {
                    page_control.back()
                },1000)
                
                return false;
            }            
            
            require.async('get_location_data', function(data) 
            {                                
                
                if(data == null)
                {
                    new_alert_v2.show({ text:"加载失败",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
					
					   page_control.back()
				    }})
                    
                    return false;
                }   
                
                add_province_list(data)     
                
                get_location_data = data  
            })
            
            
		}
                
        function add_province_list(data)
        {
            var province_list = data.province
            var data_province_list = _page_view.find("[data-province_list] [data-location_list]");
            
            data_province_list.html("");


			if(_state && !_state.from_edit_page)
			{
				var no_choice_item_view = new province_list_item_view
				({
					no_choice_item : true
				})
				
				data_province_list.append(no_choice_item_view.$el)
			}
            
            
            
            for(var i = 0;i<province_list.length;i++)
            {                
                var item_view = new province_list_item_view
                ({
                    data : province_list[i]
                })                
                
                data_province_list.append(item_view.$el)
            }
        }
        
        function hide_city_list()
        {
            _page_view.find("[data-city_list]").hide();
            _page_view.find("[data-province_list]").show();
            
            _page_view.find("[data-back_to_province]").hide();
            
            page_back_btn.$el.show();

        }
        
        function show_city_list(id)
        {
            _page_view.find("[data-city_list]").show();
            _page_view.find("[data-province_list]").hide();
            
            _page_view.find("[data-back_to_province]").show();
            
            page_back_btn.$el.hide();
            
            add_city_list(id)
                        
        }
        
        function add_city_list(id)
        {
            var id = id;
            var city_list = get_location_data.city[id]
            var data_city_list = _page_view.find("[data-city_list] [data-location_list]");
            
            data_city_list.html("");
            
            for(var i = 0;i<city_list.length;i++)
            {                
                var item_view = new city_list_item_view
                ({
                    data : city_list[i]
                })                
                
                data_city_list.append(item_view.$el)
            }
            
            //滚回顶部
			view_scroll_obj.scroll_to(0)
        }
        


		var page = require('page').new_page(options);
		
		return page
	}	
})

if(typeof(process_add)=="function")
{
	process_add()
}

