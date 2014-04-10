/**
  *	 view滚动控制
  *	 针对支持overflow:scroll和低版本系统分别处理
  *	 @author Manson
  *  @version 2013.2.16
  */
define("wo/doorplate_list",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	var Mustache = require('mustache')
    var new_alert_v2 = require("new_alert_v2")
    
    exports.route = { "doorplate_list(/:query)": "doorplate_list" }

	exports.new_page_entity = function()
	{
		var view_scroll_obj
		
		var _page_view 
        
        var alert_tips

		var options = {	
			transition_type : 'slide',
			dom_not_cache : true
		}
		
		options.initialize = function()
		{
			this.render();
		}
		
        var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
				//user_list_view_obj.more_btn_reset()
				//refresh_btn.reset()
                
                alert_tips.close();
                
                _page_view.find("#container").css("visibility","visible");
				
				if(response==null) return
                
                console.log(response.length)

				if(response==false)
				{            			    
					//user_list_view_obj.hide_more_btn()
				}
                
                
                                
			},
			before_refresh : function()
			{
				//refresh_btn.loadding()
                alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",append_target:_page_view})
			},
			before_get_more : function()
			{
				//user_list_view_obj.more_btn_loading()
			}
		}
        
        //数据model
    	var doorplate_list_model = Backbone.Model.extend
        ({
    		defaults:
    		{
    		
    		}
    	})
 
		//初始化数据
		
		var doorplate_list_collection = Backbone.Collection.extend
        ({
            model : doorplate_list_model,    
			url : function()
			{
                return wo_config.ajax_url.get_doorplate_list+"?user_id="+poco_id
			},
			refresh : function()
			{
			    var that = this 
                
				common_function.collection_refresh_function.call(this,collection_options)
			},
			get_more_item : function()
			{
				var that = this

				collection_options.data = { order_key : that.models[that.models.length-1].attributes.order_ukey}

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
			}
		})
        
        // 列表子项
        var doorplate_list_item_view = Backbone.View.extend
        ({
            tagName : "div",
            className : "doorplate_item",
            location : "",
            initialize : function() 
    		{            
    		    var that = this;                                                                      
                
    			that.render();
                
                
                
    		},
    		events : 
            {
    		  'tap [data-nav_doorplate_last]'	: function()
              {
                var that = this
                
                page_control.navigate_to_page("doorplate_last/"+that.medal_id+"/"+poco_id)
              }
    		},
            render : function()
            {
                var that = this
                
                var data = this.model.toJSON();
                
                var have_doorplate_style = ""  
                
                var no_progress = ""  
                
                var has_height = ""   
                
                that.location = data.medium_photo_location                                     
                
                if(data.is_have_doorplate == 0)
                {
                    if(poco_id != user_id)
                    {
                        return; // 不是自己的门牌列表，不显示没有兑换的门牌                                        
                    }
                    
                    data.name = data.name.replace(/(Lv[0-9]*)|(LV[0-9]*)/,"")
                    
                    // 没有兑换门牌
                    have_doorplate_style = "no_doorplate"
                    
                    // 没有兑换门牌，不显示进度条                 
                    
                    no_progress = "no_progress"   
                                        
                }
                else
                {
                    has_doorplate_num++    
                                                            
                    if(data.level<=0)
                    {
                        // 没有等级时，不显示进度条
                        no_progress = "no_progress"
                        
                         has_height = "has_progres_height"       
                    }
                                                        
                    
                }
                
                var sort_data = that.img_size_sort(data)
                 
                                                
                                                                
                //var template = '<div data-nav_doorplate_last class="icon_container {{medal_sign}}"><img src="{{medium_photo}}" style="max-width: 100%;max-height: 100%;" /></div><div class="icon_name '+have_doorplate_style+'">{{name}}</div>';
                
                var template = '<div data-nav_doorplate_last class="img_container_td" style="padding-bottom: 10px;margin:0 10px"><div class="img_container_div"><img src="{{medium_photo}}" style="height:{{img_show_height}}px;width:100%;"/><div class="doorplate_content '+has_height+'"><div class="progress_container_position '+no_progress+'"><table border="0" cellspacing="0" cellpadding="0" style="width: 100%;"><tbody><tr><td><div class="progress_container "><div class="progress_val "></div></div></td><td width="26"><span data-lv_num class="lv_num">Lv.{{level}}</span></td></tr></tbody></table></div><div class="icon_name '+have_doorplate_style+'">{{name}}</div></div></div></div>' 
                
                var html = Mustache.to_html(template, sort_data)			            
                
                that.medal_id = sort_data.medal_id;
                
                that.is_have_doorplate = sort_data.is_have_doorplate;
                
                $(this.el).html(html) 
                
                if(data.is_have_doorplate != 0&&data.level>0)
                {
                    console.log(data.level)                                        
                    
                    that.show_progress({cur_lv:data.level,total_lv:data.max_level});
                }                
                                                
                
            },
            img_size_sort : function(data)
            {                
                var that = this
        
                var radito = 240/144;
                
                var container_w = window.innerWidth                
                
                var img_w = parseInt((container_w-20-60)/2)                                                                                                                                                       
                     
                data.img_show_height = parseInt( (144 * img_w)/240 )                                   
                
                return data
                
                
            },
            show_progress:function(options)
			{
                var that = this
			 
				var options = options || {},
					cur_lv = parseInt(options.cur_lv) || 0,// 当前级别
					total_lv = 	parseInt(options.total_lv) || 5, // 总级别
					speed = options.speed || 100, // 数字越大速度越慢
					callback = options.callback || function(){}, //   加载完进度条的回调
                    aninmate = (options.aninmate == null)?true:false// 是否使用动画

				if(cur_lv>total_lv)	
				{
					//alert("当前级别不能超过总级别")
					return;
				}
					
				var progress_container = that.$el.find('.progress_container')
				var progress_val = that.$el.find('.progress_val')
				var val = 0
                

				console.log(aninmate)

                if(aninmate)
                {
					var percent = parseInt((cur_lv/total_lv)*100)
					
					setTimeout(function(){
						progress_val.animate({ width: percent+"%",},300,'ease')
					},300)
	
                }
                else
                {
                    val = parseInt((cur_lv/total_lv)*100)
                    
                    progress_val.css("width",val+"%")
                }
                
				

			}
        })
        
        var doorplate_list_controler = Backbone.View.extend
        ({

            initialize : function()
            {
                var that = this ;
               
            },
            add_list_tr : function()
            {
                $(this.el).find("table").append("<tr data-item_tr><td width='50%' valign='top' class='doorplate_item_left' data-doorplate_td></td><td data-doorplate_td  valign='top' class='doorplate_item_right'></td></tr>");
                
            },
            add_list_item : function(item_view,i)
            {                                               
                $(this.el).find('[data-doorplate_td]').eq(i).append(item_view.$el)
 	
            },
            clear_list : function()
            {
                $(this.el).find(".doorplate_item_left").html("");
                $(this.el).find(".doorplate_item_right").html("");
                
            }
        });
		
		options.render = function()
		{
			var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><h3 class="clearfix" style="display:inline-block;width:100%;text-align:center"><span class="pl20"><label data-nick_name></label>门牌(<label data-doorplate_num>0</label>)</span></h3></header><div class="content-10 main_wraper" style="padding: 0 10px;"><div class="doorplate_list mt10 font_wryh" style="position:relative;padding-top:45px;padding-bottom:20px"><div class="font_wryh clearfix" id="container" style="visibility:hidden;padding: 20px 10px 0 10px;background:#fff;position:relative"><div data-icon_list> <table width="100%" border="0" cellspacing="0" cellpadding="0"></table> </div></div></div></div></div>'						 

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
			}
		}

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
            
             $(page_view.el).find(".img_container_div img").css({height:'auto'})
		}
		

		//页面显示时
		var is_login_tag = true
		options.page_before_show = function(page_view)
		{ 
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
		}

        
        var user_id
        var doorplate_list_view_obj
	    var refresh_btn
        var doorplate_list_collection_obj
        var _params_arr 
        var poco_id
        var has_doorplate_num = 0
       
		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			var that = this;
			
			_page_view = $(page_view.el)		
			_params_arr = params_arr
            
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
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
            
            user_id = common_function.get_local_poco_id();
            
            if(state!=null)
            {                
                if(typeof state.nick_name == "undefined")
                {
                    _page_view.find("[data-nick_name]").html("")
                    
                }
                else
                {                    
                    _page_view.find("[data-nick_name]").html(state.nick_name+"的")    
                }                
                
            }
            else
            {
                _page_view.find("[data-nick_name]").html("我的")
            }
			
			doorplate_list_view_obj = new doorplate_list_controler
			({
				el : $(page_view.el).find('[data-icon_list]')
			});
			
			// 初始化数据集
			doorplate_list_collection_obj = new doorplate_list_collection                
			
			//刷新列表监听
			doorplate_list_collection_obj.bind('reset', re_render_list , page_view)
            
            //加载更多监听
			doorplate_list_collection_obj.bind('add', add_render_list , page_view)
			
			
			doorplate_list_collection_obj.refresh()
            
    
		}
                
        function re_render_list()
		{
			var that = this;			        
            var index = 0			
			doorplate_list_view_obj.clear_list()
            
            if(doorplate_list_collection_obj.length%2==0)
            {
                var tr_len = parseInt(doorplate_list_collection_obj.length/2);    
            }
            else
            {
                var tr_len = parseInt(doorplate_list_collection_obj.length/2)+1;
            }
            
            for(var i=0;i<tr_len;i++)
            {
                 doorplate_list_view_obj.add_list_tr(i)
            }                                   
            
			doorplate_list_collection_obj.each(function(item_model,i)
			{
			 
				var item_view = new doorplate_list_item_view
                ({ 
					model : item_model               
				})			            
				
				//每次add入列表
				doorplate_list_view_obj.add_list_item(item_view,i) 
                                
								 
			})
            
            _page_view.find("[data-doorplate_num]").html(has_doorplate_num);
					
			
			//滚回顶部
			view_scroll_obj.scroll_to(0)
            
		}
        
        function add_render_list(item_model)
		{
		   

			var item_view = new doorplate_list_item_view({ 
				model : item_model
				
			})
			doorplate_list_view_obj.add_list_item(item_model)
			
					
		}


		var page = require('page').new_page(options);
		
		return page;
	}
    
	
})

if(typeof(process_add)=="function")
{
	process_add()
}