define("wo/select_user_data",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	var Mustache = require('mustache')
    var new_alert_v2 = require("new_alert_v2")
    
    
    exports.route = { "select_user_data/:query": "select_user_data" }

	exports.new_page_entity = function()
	{
		var view_scroll_obj
		
		var options = {	
			transition_type : 'slide',
			dom_not_cache : true
		}
		
		options.initialize = function()
		{
			this.render()
		}
		
        
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
                
                this.key = data.key;
                this.val = data.val;
                
                var template = '<div class="input-box" data-to_city ><table border="0" cellspacing="0" cellpadding="0" class="reset_table"><tbody><tr><td style="width: 100%;">{{val}}</td></tr></tbody></table></div>' 
                
                var html = Mustache.to_html(template, data)			            
                
                $(this.el).html(html) 
            },
            events:
            {
                'tap [data-to_city]' :function(ev)
                {
					if(delay_tap_control) return

					var that = this

					if(typeof(_state.reset_tags_function) == "function")
					{
						_state.reset_tags_function.call(that,that.val)
					}

                    _state.edit_obj.val(that.val).attr('data_key',that.key)

					page_control.back()
                }
            }
        })

		options.render = function()
		{
			var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><div style="display:none;left: 5px;" data-back_to_province class="ui-btn-header-wrap "><div class="ui-btn-header ui-btn-prev radius-2px"><span class="icon icon-arrow icon-bg-common"></span></div></div><h3 class="clearfix" style="display:inline-block;width:100%;text-align:center"><span><label data-nick_name></label></span></h3></header><div class="content-10 main_wraper" style="padding: 0 10px;"><div class="set_location_list mt10 font_wryh" style="position:relative;padding-top:45px;padding-bottom:20px"><div data-province_list class="font_wryh clearfix" id="container" style="visibility:hidden;background:#fff;position:relative"><div data-location_list></div></div><div data-city_list class="font_wryh clearfix" id="container" style="display:none;position:relative"><div data-location_list></div></div></div></div></div>'						 

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
            'tap #sel_control' : function(ev)
            {
				var select_obj = ev.currentTarget
                select_obj.focus()
            }
		}

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())            
		}
		
		var _page_view
		var _state
		var delay_tap_control = true
        

		options.page_show = function()
		{
			_page_view.$el.find('.set_location_list').append('<select id="sel_control" data-select-control><option>11111</option><option>22222</option><option>33333</option><option>44444</option></select>')
		}

		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			_page_view = page_view
			_state = state

			var data_type = params_arr[0]

			if( $.inArray(data_type,["sex","astro","birthday_year"])==-1 )
			{
				page_control.back()
				return
			}


			if(data_type=="sex")
			{
				_page_view.$el.find('[data-nick_name]').html('性别设置')
				

				var select_data_arr = [
					{ key : "男" , val : "男" },
					{ key : "女" , val : "女" }
				]
			}
			else if(data_type=="astro")
			{
				_page_view.$el.find('[data-nick_name]').html('星座设置')

				var select_data_arr = [
					
					{ key : "1" , val : "白羊座" },
					{ key : "2" , val : "金牛座" },
					{ key : "3" , val : "双子座" },
					{ key : "4" , val : "巨蟹座" },
					{ key : "5" , val : "狮子座" },
					{ key : "6" , val : "处女座" },
					{ key : "7" , val : "天秤座" },
					{ key : "8" , val : "天蝎座" },
					{ key : "9" , val : "射手座" },
					{ key : "10" , val : "魔蝎座" },
					{ key : "11" , val : "水瓶座" },
					{ key : "12" , val : "双鱼座" }
				]
			}
			else if(data_type=="birthday_year")
			{
				_page_view.$el.find('[data-nick_name]').html('出生年设置')


				var current_year = new Date().getFullYear();
				
				var select_data_arr = new Array()
				
				for(var i = current_year ; i>=1950 ; i--)
				{
					select_data_arr.push({ key : i , val : i + '年' })
				}
			}

			for(var i = 0;i<select_data_arr.length;i++)
            { 
				var item_view = new city_list_item_view
				({
					data : select_data_arr[i]
				})

				var data_province_list = _page_view.$el.find("[data-province_list] [data-location_list]")

				data_province_list.append(item_view.$el)
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
			
            
			setTimeout(function(){
				delay_tap_control = false
			},300)
		}
                

		var page = require('page').new_page(options);
		
		return page;
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}