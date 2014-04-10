/**
  *	 view滚动控制
  *	 针对支持overflow:scroll和低版本系统分别处理
  *	 @author Manson
  *  @version 2013.2.16
  */
define("wo/master_recommend",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	var Mustache = require('mustache')
    var new_alert_v2 = require("new_alert_v2")
    
    var page_count = 20 
    
    exports.route = { "master_recommend(/:issue_id)": "master_recommend" }

	exports.new_page_entity = function(custom_options)
	{
		var view_scroll_obj
		
		var _page_view 
        
        var alert_tips                
        
        var follow_all_users_tag = false 
        
        var loading = false
                
		var custom_options = custom_options || {}
		var options = {
			transition_type : custom_options.custom_tansition || 'slide',
			without_his : custom_options.without_his,
			dom_not_cache : true,
			ignore_exist : true
		};
        
        //数据model
		var master_recommend_model = Backbone.Model.extend({
			defaults:{}
		})
        
        var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed,index_page)
			{
                
				refresh_btn.reset()	
                
                loading = false;	                             
                                                                                    
				pre_issue_id = response.previous_issue_count
                next_issue_id = response.next_issue_count
                
                if(pre_issue_id > 0)
                {
                    _page_view.find("[pre_page_btn]").addClass("click")
                }
                
                if(next_issue_id > 0)
                {
                    _page_view.find("[next_page_btn]").addClass("click")
                }
                
                // 设置标题
                set_title(response)	
			},
			before_refresh : function()
			{				
                refresh_btn.loadding()
                
                _page_view.find("[pre_page_btn]").removeClass("click")
                _page_view.find("[next_page_btn]").removeClass("click")
                
                loading = true;	    
			}
		}
        
        // 数据集
        var master_recommend_collection = Backbone.Collection.extend({
			model : master_recommend_model,
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
				    // 特殊处理获取当前期数
				    
				    cur_issue_id = response.result_data.current_issue_count
				    
					return response.result_data.data
				}
				else
				{
					return response
				}
			},
			url : function()
            {
                return wo_config.ajax_url.get_everyweek_super_user+"?issue_count="+issue_id
            }
		})
        
        //列表子项视图
        var master_recommend_view = Backbone.View.extend
        ({
            className : "border_item bdb-line",  
            tagName :  "div",		                		
            initialize : function(options)
            {
                var data = this.img_size_sort(this.model.toJSON());
                
                if(data.location_province == data.location_city)
                {
                    data.location_name = data.location_city
                }
                else
                {
                    
                    if(!common_function.is_empty(data.location_city))
                    {
                        data.location_name = data.location_province + "·" + data.location_city
                    }
                    else
                    {
                        data.location_name = data.location_province     
                    }
                    
                }
            
                
                var template = '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td width="42" data-nav_userprofile><div class="user-img"><img lazyload_src="{{user_icon}}"></div></td><td data-nav_userprofile data-user_info><div class="clearfix"><div class="user_name fl" data-user_name>{{user_nickname}}</div><i class="sex_icon icon-bg-common fl"></i></div><div class="location_name" data-location_name>{{location_name}}</div></td><td></td><td data-follow_btn_area align="right"></td></tr></table><div class="user_time_and_pic_count" data-user_time_and_pic_count><span class="icon icon-clock icon-bg-common"></span> {{join_days}}天，{{publish_count}}张照片</div><p class="des">{{{user_describe}}}</p><div class="like-photo clearfix">{{#custom_data}}<img lazyload_src="{{cover_img_url_ss}}" data-nav_art="{{art_id}}" data-img_width="{{cover_img_url_width}}" data-img_height="{{cover_img_url_height}}" class="img_buffer_bg imgs " style="width:{{pic_size}}px;height:{{pic_size}}px;">{{/custom_data}}</div>'                                
                
                this.options = options;
                                
                
                // 判断好友关系        
			    var ofb = {};
                    
				if(_state)
				{
					ofb = _state.follow_btn_obj
					
				}
				
				new_follow_btn = require('follow_btn')();                        
				
				follow_btn = new new_follow_btn
				({
					status : data.follow_status,
					user_id : data.user_id,
					other_follow_btn : ofb,
					account_type : "weeky_recommend"
				})
                
                this.new_follow_btn = follow_btn;                                
                    
                this.user_id = data.user_id;			
                                					                                
					
		        var html = Mustache.to_html(template, data)                                                                                
					
                $(this.el).html(html)
                
                if(data.user_sex=="男")
                {
                    $(this.el).find('.sex_icon').addClass("icon-male")
                    
                    $(this.el).find('.sex_icon').show()
                }
                else if((data.user_sex=="女"))
                {
                    $(this.el).find('.sex_icon').addClass("icon-female")
                    
                    $(this.el).find('.sex_icon').show()
                }
                                
                
                
                if(this.new_follow_btn)
                {
                    $(this.el).find('[data-follow_btn_area]').html("")
                
 				    $(this.el).find('[data-follow_btn_area]').html(this.new_follow_btn.$el)    
                }
                
                
            },
            img_size_sort : function(model_data)
    		{
    		    var len = model_data.custom_data.length
                
                
    		    for(var i = 0;i<len;i++)
                {
                    var custom_data = model_data.custom_data[i]
                    custom_data.cover_img_url_ss = common_function.matching_img_size(custom_data.cover_img_url,"ss")

					//根据计算的图片大小值
					custom_data.pic_size = this.options.pic_size
                    
                }        		            								
    			
    			return model_data
    		},
			//针对新闻列表item的tap导航
			events : 
            {
                'tap [data-nav_userprofile]' : 'navigate_to_user' ,
                'tap [data-nav_art]'  : 'navigate_to_art'               
			},                        
    		navigate_to_user : function()
    		{		    
                if(!this.user_id) {return;}    
                
                var btn_obj
				
				if(this.new_follow_btn) 
				{ 
					btn_obj =  this.new_follow_btn 
				}      
                                    
                page_control.navigate_to_page("user_profile/"+this.user_id,{ follow_btn_obj : btn_obj })
    				
    		},
            navigate_to_art: function(ev)
    		{
    		    var art_id = $(ev.currentTarget).attr("data-nav_art")
				
				var cover_img_width = $(ev.currentTarget).attr("data-img_width")
				var cover_img_height = $(ev.currentTarget).attr("data-img_height")
				
    			page_control.navigate_to_page("last/"+art_id +"/from_profile", { cover_img_width : cover_img_width,cover_img_height : cover_img_height } )
    		}
        })
        
        // 控制器
        var master_controler = Backbone.View.extend
        ({
            initialize : function()
			{
				var that = this ;

			},
			add_list_item : function(item_view)
			{
				$(this.el).append(item_view.$el)
                
                // 存储所有用户id
                this.all_user_id.push(item_view.user_id);          
			},
			clear_list : function()
			{
				$(this.el).html("");								
			},
            all_user_id : [],
        })
		        
        
		options.initialize = function()
		{
			this.render();
		}
		
		options.render = function()
		{
			var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><h3 class="clearfix" style="display:inline-block;width:100%;text-align:center"><span class="fwb"><label data-everyday_title></label></span></h3></header><div class="content-10 main_wraper" style="padding: 0 10px;"><div class="master_recommend_list font_wryh" style="padding-top:55px;padding-bottom:20px"></div></div><div class="comment-love-mod"><ul class="clearfix"><li pre_page_btn class="pre" style="width:30%"><em class="icon icon-bg-common" style="margin: 0px 15px -4px 0;display:inline-block"></em>上一期</li><li data-follow_all_users style="width:40%"><em class="icon-follow_all_user icon-bg-common" style="display:inline-block"></em>全部关注</li><li class="next" next_page_btn style="width:30%">下一期<em class="icon icon-bg-common" style="margin: 0px 0 -4px 15px;display:inline-block"></em></li></ul></div></div>'						 

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
			'tap .ui-btn-refresh-wrap' : function()
			{
				//location.href = "http://m.poco.cn/mobile/index.php?" + new Date().getTime() +"#index"

				if(page_control.page_transit_status()) return false

				master_recommend_collection_obj.refresh()
			},
            'tap [pre_page_btn]' : function(ev)
            {
                var cur_btn = $(ev.currentTarget);
                
                if(page_control.page_transit_status()) return false                                                
                
                if(pre_issue_id<=0 || !cur_btn.hasClass("click"))
                {                                           
                    return false;
                }                                
                
                page_control.navigate_to_page("master_recommend/"+pre_issue_id,{},true,"slide_reverse")
            },
            'tap [next_page_btn]' : function(ev)
            {
                var cur_btn = $(ev.currentTarget);
                
                if(page_control.page_transit_status()) return false                                
                
                if(next_issue_id<=0 || !cur_btn.hasClass("click"))
                {                                           
                    return false;
                }                                
                
                page_control.navigate_to_page("master_recommend/"+next_issue_id,{},true)
            },
            'tap [data-follow_all_users]' : function()
            {   
                if(loading)
                {
                    return false;
                }
                
                //未登录处理    			
    			if(poco_id<=0)
    			{
    				new_alert_v2.show({ text:"尚未登录",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
    					
    					page_control.navigate_to_page("login")
    				}})
    
    				return false
    			}
                
                if(follow_all_users_tag)
                {
                    // 防止重复点击
                    return false;
                }
                
                follow_all_users_tag = true;
                
                alert_tips = new_alert_v2.show({text:"正在关注",type:"loading",is_cover:true,append_target:_page_view })
                
                var user_id_arr = master_recommend_controler_obj.all_user_id.join("||")   
                
                var has_follow_status = '<span class="data-follow_btn"><span data-is_follow="0" class="ui-icon-item-wrap dib ml20 lh22 tc border-style-d2 f10 radius-2px"><em class="ui-icon-item radius-2px fsn"><i class="icon-atten icon-yi icon-bg-common"></i></em></span></span>'                             
                
                common_function.send_request
                ({
                    url : wo_config.ajax_url.follow_all_users,
                    data : { user_id : user_id_arr ,t : parseInt(new Date().getTime())}, 
                    callback : function(data)
                    {
                       follow_all_users_tag = false;
                        
                       _page_view.find('[data-follow_btn_area]').html(has_follow_status) 
                        
                       alert_tips.close();
                       
                       new_alert_v2.show({ text:"全部好友关注成功",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000})
                    },
                    error : function()
                    {
                        follow_all_users_tag = false;
                        
                        alert_tips.close();
                        
                        if(typeof error == 'function')
                        {
                            
                        }                        
                    }
                })  
            }
		}

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())   
            
            $(page_view.el).find('.imgs').width(set_list_pic()).height(set_list_pic())         
		}
		

		//页面显示时
		var is_login_tag = true
		options.page_before_show = function(page_view)
		{ 
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
            
            
            
		}

        
        var user_id        
	    var refresh_btn        
        var _params_arr 
        var _page_view
        var _state
        var poco_id        
        var page_back_btn
        var master_recommend_collection_obj
        var master_recommend_controler_obj
        var issue_id
        var pre_issue_id
        var next_issue_id
        var follow_btn = null
        
        
        
		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			var that = this;
			
			_page_view = $(page_view.el)		
			_params_arr = params_arr
            _state = state            
            
            poco_id = common_function.get_local_poco_id();               
            
            // 当前期刊数
            issue_id = (typeof params_arr[0] == 'undefined')?"":params_arr[0]
                                    			
            //刷新按钮  add by manson 2013.5.7
			refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(refresh_btn.$el)                        
           
			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head_and_nav(),
				use_lazyload : true
			})
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
            
            
            master_recommend_collection_obj = new master_recommend_collection;   
            
            master_recommend_controler_obj = new master_controler
            ({
                el : _page_view.find('.master_recommend_list')
            });
            
            //刷新列表监听
			master_recommend_collection_obj.bind('reset', re_render_list , page_view)
			
			//加载更多监听
			master_recommend_collection_obj.bind('add', add_render_list , page_view)
            
            master_recommend_collection_obj.refresh()
            
		}
        
        function re_render_list()
		{  
			
		    master_recommend_controler_obj.clear_list()
            
			master_recommend_collection_obj.each(function(item_model)
			{

				var item_view = new master_recommend_view({ 
					model : item_model ,
                    pic_size : set_list_pic()			                
				})			            
				
				//每次add入列表
				master_recommend_controler_obj.add_list_item(item_view)		

                    	 
			})
            
            //滚回顶部
			view_scroll_obj.scroll_to(0)
		}
        
        function add_render_list(item_model)
		{	   
			var item_view = new master_recommend_view({ 
				model : item_model ,
                pic_size : set_list_pic()			      
			})                			
			
			//每次add入列表
			master_recommend_controler_obj.add_list_item(item_view)   						  
		}
        
        function set_list_pic()
        {
            // 计算图片宽高
            return parseInt( (window.innerWidth - 20 - 10 * 5)/4 )
                         
        }
        
        function set_title(data)
        {
            var issue_name = data.issue_name;
            
            _page_view.find("[data-everyday_title]").html(issue_name)
        }

		var page = require('page').new_page(options);
		
		return page;
	}
    
	
});