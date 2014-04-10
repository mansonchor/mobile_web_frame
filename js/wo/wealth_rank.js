/*
    hdw 照片榜
*/
define("wo/wealth_rank",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","rank_nav","notice"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var wo_config = require('wo_config')    
    var new_alert_v2 = require("new_alert_v2")
    var Mustache = require('mustache')
	var select_module_class = require("select_module")()
	var notice = require('notice')
	
	exports.route = { "wealth_rank(/:time)": "wealth_rank" }

	exports.new_page_entity = function()
	{
		var options = {			
			title : "财富排行榜",
			route : { "wealth_rank": "wealth_rank" },
			transition_type : 'slide'
		}	
		
		var view_scroll_obj		
		var _params_arr
		var _page_view
        var _params_obj
        var rank_nav_view
		var rank_nav_view_obj       
		var wealth_rank_collection_obj
		var wealth_rank_view_obj
        var day_list_controller_obj
		var week_list_controller_obj
		var city_select_obj
		var cur_city = ''
		var cur_type 
        var location_arr = []
		var first_time_load = false
		var load_more_ing = false        
        var select_defalut_key = "";
        var poco_id
        var alert_tips
		
		
        
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
				alert_tips.close();
                
                load_more_ing = false	    
                
                if(poco_id > 0)
                {
                    if (!city_select_obj)
                    {
                        
                        location_arr = response.location.select_list; 
                        
                        if(location_arr.length >0)
                        {                                    
                            select_defalut_key = response.location.cur_location_key
                            
                            if(!first_time_load)
                            {
                                var cur_location_city_name = response.location.cur_location_name
                            
                                _page_view.$el.find("[data_city_value]").html(cur_location_city_name)  
                                
                                first_time_load = true;  
                            }
                            
                            _page_view.$el.find('[data_select_location]').show();
                                                  
                        }                                                 
                        else
                        {
                            _page_view.$el.find('[data_select_location]').hide();
                        }                                                                
                        
                        console.log("new select_module_class")
						
                        //地区下拉
                        city_select_obj = new select_module_class(
                        {
                            options_data : location_arr,
                            default_key : select_defalut_key,
                            onchange : function()
                            {
                                select_data = this.get_select_data()
    
                                cur_city = select_data.key
    
                                var cur_location_city = select_data.val
    
                                _page_view.$el.find("[data_city_value]").html(cur_location_city)                            
                                
								day_list_controller_obj.clear_list()
								
                                week_list_controller_obj.clear_list()                                  
    
                                wealth_rank_collection_obj.refresh()
    
                            }
                        })
                    }
                }
                else
                {
                    city_select_obj = null
                    
                    _page_view.$el.find('[data_select_location]').hide();
                }
                
			},
			before_refresh : function()
			{
		        alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",is_cover:false , append_target : _page_view.$el })
                
                load_more_ing = true
			}
		}
		
		
		
		//数据model
    	var wealth_rank_model = Backbone.Model.extend
        ({
    		defaults:
    		{
    		
    		}
    	})
		
		
		//初始化数据
		
		var wealth_rank_collection = Backbone.Collection.extend
        ({
            model : wealth_rank_model,    
			url : wo_config.ajax_url.get_charm_expense_rank_list,

		    refresh : function()
			{
				var that = this
				collection_options.data = { date_type : cur_type , rank_type : "expense" , location_city : cur_city}
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
        
		
		//财富榜列表视图
        var wealth_rank_view = Backbone.View.extend
        ({
    		  tagName: "ul",
    		  className: "rank_item",
    		  initialize: function(json_data) 
    		  {
				  
    		      this.render();
	
    		  },
              events: 
              {
			    'tap [data_user_page]' : function()
			    {

				  page_control.navigate_to_page("user_profile/"+this.user_id)
				
			     } 
              },
              render : function()
              {          
                var json_data = this.model.toJSON();            
                this.rank_value = parseInt(json_data.rank_value)
    			this.user_rank = parseInt(json_data.user_rank)
				this.sort_num = parseInt(json_data.sort_num)
				this.user_icon = json_data.user_icon
				this.sex = json_data.sex
				this.user_name = json_data.user_name
				this.user_id = json_data.user_id
				this.order_key = parseInt(json_data.order_key)
				this.user_rank_name = json_data.user_rank_name
				   
				var key_type = ''
				var str_class = ''
				
                 /* 设置前三名的样式 */

                 if (this.order_key >= 1 && this.order_key <= 3)
                 {

					   key_type = "class_style" + this.order_key
                       str_class = "icon-bg-common"  
						  
					    if (poco_id == this.user_id)
                        {
                          key_type = key_type+" class_self"
                        }

                  }
				  else if(this.order_key > 3 && poco_id == this.user_id)
				  {
					   key_type = "class_self"
				  }

    			var template = '<li class="'+key_type+'" data_user_page><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tr><td width="50" align="center" style="border-right:1px solid #e1e1e1"><span class="sort_num db '+str_class+'">{{order_key}}</span></td><td><div class="clearfix pt10 pb10"><div class="fl ml10 mr10"><div class="user-pic middle-center img_buffer_bg"><img lazyload_src={{user_icon}} class="max-width-height"></div></div><div class="txt fl"><div class="clearfix"><span class="name fl color333 lh16 oh">{{user_name}}</span><em class="sex_icon fl icon-bg-common"></em></div><p class="color999">LV<em class="fsn user_rank mr5">{{user_rank}}</em> {{user_rank_name}}</p></div></div></td><td width="50"><span class="rank_value color666 db">+{{rank_value}}</span></td></tr></table></li>'
                
				
    			var html = Mustache.to_html(template, json_data)
                
    			$(this.el).html(html)
				
                if(this.sex == "男")
			    {
				  $(this.el).find('.sex_icon').addClass('icon-male')
			    }
			    else if(this.sex == "女")
			    {
				  $(this.el).find('.sex_icon').addClass('icon-female')
			    }
              } 
    		     
		})
		
		
                    
		options.initialize = function()
		{
			this.render();
		}

		options.render = function()
		{		
			var template_control = require('get_template')
			
			var template_obj = template_control.template_obj()
			
			//var footer_view = require('footer_view')
            
			//footer_view_obj = new footer_view({ cur : "focus" })
            
            var init_html = '<div class="wrap-box"><header class="header font_wryh fb tc re "><h3 class="tc" >财富榜</h3></header><div class="main_wraper wealth_page"><div class="inside-page font_wryh" style="padding-top:45px;"><div style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);"></div></div><div class="main_container"><div class="list-page pl10 pr10"><div class="select-city-data clearfix mt10 color666" style="display:none"><div class="location_city bgcf0f border-style-be re fl radius-2px" data_select_location style="display:none"><span data_city_value class="city fl"></span><em class="fl ml20 icon-change mt5"></em></div><div class="data-list-change fr radius-2px"><ul class="clearfix"><li class="cur" data_select_date="day">日榜</li><li data_select_date="week">周榜</li></ul></div></div><div class="list-item pt10 pb15" day_list_charm_rank><div no_data class="no_data_txt" style="display:none"><div class="contanier"><p>财富榜正虚位以待</p><p>为好友增添一些礼物吧</p><p>明天也许就出现在这里</p></div></div><div data-list_container></div></div><div class="list-item pt10 pb15" week_list_charm_rank style="display:none"><div no_data class="no_data_txt" style="display:none"><div class="contanier"><p>财富榜正虚位以待</p><p>为好友增添一些礼物吧</p><p>明天也许就出现在这里</p></div></div><div data-list_container></div></div></div></div></div></div></div>'

			this.$el.append($(init_html))
            
            //底部
			//this.$el.find('.footer').append(footer_view_obj.$el)
		}
		
		
		options.events = {
					
			'tap .ui-btn-prev-wrap' : function()
			{
				page_control.back()		
			},
            'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{
					//page_control.navigate_to_page("charm_rank");
				}
			},
			'tap [data_select_location]' : function()
			{ 
                 city_select_obj.open() 
			},
			//选择周和月
			'tap [data_select_date]' : function(ev)
			{
			    if(load_more_ing)
                {
                    return;
                }                              
                
                cur_type = $(ev.currentTarget).attr("data_select_date")
                
                if($(ev.currentTarget).hasClass("cur"))
                {                                       
                    wealth_rank_collection_obj.refresh()
                    
                    return; 
                }			    				
				
                control_select_data(cur_type)

			
			},
            'tap .ui-btn-refresh-wrap' : function()
            {
                wealth_rank_collection_obj.refresh()
            }
		}
		

		options.window_change = function(page_view)
		{
           $(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
           
           $(page_view.el).find('.no_data_txt').height(common_function.container_height_with_head()-115) 
		}
        
        
        
		options.page_before_show = function(page_view)
		{
            window.localStorage.setItem("rank_nav_address","wealth_rank")

			notice.footer_notice_ui_refresh()
            
            poco_id = common_function.get_local_poco_id();
		}
        
		
        var refresh_btn
		//页面初始化时
		options.page_init = function(page_view,params_arr,params_obj)
		{
			_page_view = page_view
			_params_arr = params_arr
			_params_obj = params_obj
             
            cur_type = (!_params_arr[0])?'day':_params_arr[0];
            
            //刷新按钮  add by manson 2013.5.7
            refresh_btn = require('refresh_btn')()
            page_view.$el.find('.header').append(refresh_btn.$el)
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)            
			
            // 导航条
            /*
            rank_nav_view = require('rank_nav')
                        
            rank_nav_view_obj = new rank_nav_view
            ({
                cur_link_type : "wealth_rank"
            })      
                                         
            
		    _page_view.$el.find('.tab-select_container').append(rank_nav_view_obj.$el)
		    */

			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')
            

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head(),	
				use_lazyload : true
			})
			
			$(page_view.el).find('.no_data_txt').height(common_function.container_height_with_head()-115)
            
			day_list_controller_obj = new day_list_controller
			({
			    el : _page_view.$el.find('[day_list_charm_rank]')
			})
			
			week_list_controller_obj = new week_list_controller
            ({
                el : _page_view.$el.find('[week_list_charm_rank]')
            })
			
			wealth_rank_collection_obj = new wealth_rank_collection
			
			
			wealth_rank_collection_obj.bind('reset', re_render_list , page_view)
			
			
			//wealth_rank_collection_obj.refresh()
			
			control_select_data(cur_type)


		}
        
        
		
		var day_list_controller = Backbone.View.extend
        ({
            initialize : function(options)
            {
                var that = this
                
                var options = options || {}
            },
			add_list_item : function(item_view)
            {
                 $(this.el).find('[data-list_container]').append(item_view.$el)
            },
            clear_list : function()
            {
                $(this.el).find('[data-list_container]').html("");
            },
            show : function()
            {
                $(this.el).show();
            },
            hide : function()
            {
                $(this.el).hide();
            },
            show_no_data : function()
            {
                $(this.el).find('[data-list_container]').hide();
                $(this.el).find('.no_data_txt').css("display","table");
            },
            hide_no_data : function()
            {                
                $(this.el).find('[data-list_container]').show();
                $(this.el).find('.no_data_txt').hide();
            }
        })
		
		
		var week_list_controller = Backbone.View.extend
        ({
            initialize : function(options)
            {
                var that = this
                
                var options = options || {}
            },
            add_list_item : function(item_view)
            {
                 $(this.el).find('[data-list_container]').append(item_view.$el)
            },
            clear_list : function()
            {
                $(this.el).find('[data-list_container]').html("");
            },
            show : function()
            {
                $(this.el).show();
            },
            hide : function()
            {
                $(this.el).hide();
            },
            show_no_data : function()
            {
                $(this.el).find('[data-list_container]').hide();
                $(this.el).find('.no_data_txt').css("display","table");
            },
            hide_no_data : function()
            {                
                $(this.el).find('[data-list_container]').show();
                $(this.el).find('.no_data_txt').hide();
            }
        })
		
		
		function re_render_list()
		{
			common_function.page_pv_stat_action()

			var that = this;
			
			_page_view.$el.find('.select-city-data').show()	
			
            if(cur_type == 'day')
			{
				day_list_controller_obj.clear_list()
			}
			else if(cur_type == 'week')
			{ 
				week_list_controller_obj.clear_list()
			} 			
																	
			
			if(wealth_rank_collection_obj.length == 0)
			{
			    if(cur_type == 'day')
                {
                   day_list_controller_obj.show_no_data();
                }
                else if(cur_type == 'week')
                { 
                   week_list_controller_obj.show_no_data();
                }
			    		    			    			   
			    return;
			}					
			
			wealth_rank_collection_obj.each(function(item_model)
			{
				var wealth_rank_view_obj = new wealth_rank_view	
				({
                    model : item_model
                })	
				if(cur_type == 'day')
			    {
			        day_list_controller_obj.hide_no_data();
				    day_list_controller_obj.add_list_item(wealth_rank_view_obj)
			    }
			    else if(cur_type == 'week')
			    {
			        week_list_controller_obj.hide_no_data();
				    week_list_controller_obj.add_list_item(wealth_rank_view_obj)

			    }
			})
			
			
			//滚回顶部
            view_scroll_obj.scroll_to(0)
			
		}
		
		
        function control_select_data(cur_type)
        {
            _page_view.$el.find('[data_select_date]').removeClass('cur')
            _page_view.$el.find('[data_select_date=' + cur_type + ']').addClass('cur')

            if (cur_type == 'day')
            {
                day_list_controller_obj.show()

                week_list_controller_obj.hide()

                if (_page_view.$el.find("[day_list_charm_rank] .rank_item").length == 0)
                {
                    wealth_rank_collection_obj.refresh()
                }
            }
            if (cur_type == 'week')
            {
                week_list_controller_obj.show()

                day_list_controller_obj.hide()

                if (_page_view.$el.find("[week_list_charm_rank] .rank_item").length == 0)
                {
                    wealth_rank_collection_obj.refresh()
                }
            }
        }

		

		var page = require('page').new_page(options);
		
		return page;
	}
	
})

if(typeof(process_add)=="function")
{
	process_add()
}