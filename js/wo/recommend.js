/**
  *	 好友推荐页
  *	 @author Manson
  *  @version 2013.2.16
  */
define("wo/recommend",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","notice","user_list_collection","new_alert_v2"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	var notice = require('notice')
    var cookies = require('cookies') 
    
    var new_alert_v2 = require("new_alert_v2")
    
	exports.route = { "recommend": "recommend" }

	exports.new_page_entity = function()
	{
		var options = {
			route : { "recommend": "recommend" },		
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true
		};
		
		var poco_id
		
		var page_count = 10                

		var user_list_view_obj
		
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed,index_page)
			{
			    selected_list_obj().contoller_obj.show_more_btn() 
			 
				selected_list_obj().contoller_obj.more_btn_reset()
                
				refresh_btn.reset()		             
                
                var data_seletc_type = _page_view.find("[data-select_type='"+select_type+"']") 

                _page_view.find('[data-for_list="'+select_type+'"] .loading').hide() 
                
                _page_view.find('[data-for_list="'+select_type+'"] .list-comment-item').show()                           
                                                
                
                try
                {

                    if(response.is_bind_sina == 0)
                    {
                        _page_view.find('[data-for_list="sinaweibo"] .list_container').hide()
                        
                        _page_view.find('[data-for_list="sinaweibo"] .bind_btn').show();
                        
                        _page_view.find('[data-for_list="sinaweibo"] [data-text]').html("你的新浪微博账号尚未绑定。")
                        
                        selected_list_obj().contoller_obj.hide_more_btn()
                        
                        data_seletc_type.attr("has_read",true)

                        return false
                    }
                    else
                    {
                        if(response.is_sina_over_time == 0)
                        {
                            _page_view.find('[data-for_list="sinaweibo"] .list_container').hide()
                        
                            _page_view.find('[data-for_list="sinaweibo"] .bind_btn').show();
                        
                            _page_view.find('[data-for_list="sinaweibo"] [data-text]').html("由于新浪微博的相关规定，每次绑定世界的 有效期为90天。过期需要重新绑定。")
                        
                            selected_list_obj().contoller_obj.hide_more_btn()
                        
                            data_seletc_type.attr("has_read",true)
                            
                            return false;
                        }
                    }

                    if(response.is_bind_qq == 0)
                    {
                        _page_view.find('[data-for_list="qqweibo"] .list_container').hide()
                        
                        _page_view.find('[data-for_list="qqweibo"] .bind_btn').show();
                        
                        selected_list_obj().contoller_obj.hide_more_btn()
                        
                        data_seletc_type.attr("has_read",true)

                        
                        return false
                    }	    
                }
                catch(err)
                {
                    
                }
				
				if(response!=null)
				{
					data_seletc_type.attr("has_read",true)
				}
				else
				{
					return false
				}
				

				if(response == false && index_page ==1)
				{
					show_no_data()
				}
				
                if(response==false || response.length < page_count)
				{            					                        
					selected_list_obj().contoller_obj.hide_more_btn()
				}                                                           
							
			},
			before_refresh : function()
			{
				refresh_btn.loadding()    
                
                selected_list_obj().contoller_obj.hide_more_btn()       
                
                hide_no_data()   
                
                var bind_btn_status = _page_view.find('[data-for_list="'+select_type+'"] .bind_btn')
                
                if(bind_btn_status.css("display") == "none" || bind_btn_status.length<=0 )
                {
                    _page_view.find('[data-for_list="'+select_type+'"] .list-comment-item').hide()
                    
                    _page_view.find('[data-for_list="'+select_type+'"] .loading').show()
                    
                }
                                            

			},
			before_get_more : function()
			{
				selected_list_obj().contoller_obj.more_btn_loading()
                
                hide_no_data()
                
			},
			error_no_alert : true
		}
		
		

		//初始化数据
		var new_user_list_collection = require('user_list_collection')
		
        var select_type = "world";
        var handle
        var load_more_handle
        var collection_class = 
        {
			url : wo_config.ajax_url.recommend_friend_list,
			refresh : function()
			{
			    collection_options.data = {friend_type : select_type} 
                
				handle = common_function.collection_refresh_function.call(this,collection_options)
			},
			get_more_item : function()
			{
				var that = this

				collection_options.data = { order_key : that.models[that.models.length-1].attributes.order_ukey,friend_type : select_type}

				handle = common_function.collection_get_more_function.call(this,collection_options)
			}
		}		
        
        var poco_list_collection_obj = new_user_list_collection(collection_class)

        var sina_list_collection_obj = new_user_list_collection(collection_class)
        
        var qq_list_collection_obj = new_user_list_collection(collection_class)
		
		// 列表子项视图
		var user_list_item_view = require('user_list_view')

		
		// 列表视图
		var user_list_view = require('user_list_controler')
		

		options.initialize = function()
		{
			//loading.show_loading();

			this.render();
		}
			
		options.render = function()
		{
			var template_control = require('get_template')
			
			var template_obj = template_control.template_obj()
			
			var init_html = template_obj.recommend;                           
                        

			this.$el.append($(init_html))

		}
		
		options.events = {
			
			//刷新
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false
                
                if(select_type == "world") return false                
                
                selected_list_obj().collection_obj.refresh()
			},
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
            'tap [data-to_search]' : function()
            {
                page_control.navigate_to_page("search_result/"+select_type)

				
            },
            //刷新
			'tap .bind_btn' : function()
			{
				page_control.navigate_to_page("setup")
			},
            //加载更多
			'tap .data-more_btn' : function()
			{
				if(page_control.page_transit_status()) return false  
                
                selected_list_obj().collection_obj.get_more_item()
			}   
            ,
            'tap [data-select_type]' : function(ev)
            {     
				// 有数据但没有读取过                                        
                handle && handle.abort() 

                refresh_btn.reset()			                                
                
                var cur_type = $(ev.currentTarget).attr("data-select_type");
                
                var selector_str = '[data-for_list="'+cur_type+'"]'                                                

                var data_for_list = _page_view.find('[data-for_list]')
                
                var cur_data_for_list =  _page_view.find(selector_str)
                
                var main_wraper = _page_view.find(selector_str+' .scroll_contianer')                                                         
                    
                view_scroll_obj = view_scroll.new_scroll(main_wraper,{
			        'view_height' : view_height
                })
                
                select_type = cur_type                                                                                                            
                
                
                // 菜单高亮选中
                _page_view.find("[data-select_type]").removeClass("cur");
                
                $(ev.currentTarget).addClass("cur")                                
                                                
                
                var water_str = ""                
                
                // 设置搜索框水印
                switch(select_type)
                {
                    case "world" :
                         water_str = "搜索世界好友的昵称或者ID";
                         break;
                    case "poco" :
                         water_str = "搜索POCO好友的昵称或者ID";
                         break;
                    case "sinaweibo" :
                         water_str = "搜索新浪微博好友的昵称";
                         break;
                    case "qqweibo" :                                
                         water_str = "搜索腾讯微博好友的昵称";
                         break;
                         
                }
                
                _page_view.find("[data-search_input]").attr("placeholder",water_str)
                
                data_for_list.css({"opacity":"0","visibility":"hidden","z-index":0,"left":9999,"top":9999})                                 
                cur_data_for_list.css({"opacity":"1","visibility":"visible","z-index":9999,"left":0,"top":0})
                
                if(select_type == 'world')
                {
                    return;
                }
                
                if(!$(ev.currentTarget).attr("has_read"))
                {
                    selected_list_obj().collection_obj.refresh()
                }                         
            },
            'tap [data-to_dating]' : function(ev)
            {
                var cur_val = $(ev.currentTarget).attr("data-to_dating");
                
                window.localStorage.setItem("select_sex",cur_val); 
                page_control.navigate_to_page("dating_list")
            },
            'tap [data-to_dating_game]' : function()
            {
                page_control.navigate_to_page("dating_game")
            },
			//魅力男女
			'tap [data-to_charm_rank]' : function()
            {
                page_control.navigate_to_page("charm_rank")
            },
			//财富榜、
			'tap [data-to_wealth_rank]' : function()
            {
                page_control.navigate_to_page("wealth_rank")
            }
			
			
		}

		options.window_change = function(page_view)
		{ 
		    //容器滚动
			var main_wraper = cur_data_list.find('.scroll_contianer')
              
			main_wraper.height(view_height)
		}

		var view_scroll_obj
		var user_info_obj
		var _page_view 
		var _params_arr    
        var __page_view
		var refresh_btn
        var view_height
        var view_scroll
        var poco_list_view_obj
        var sina_list_view_obj
        var qq_list_view_obj
        var cur_data_list
                
		//页面初始化时
		options.page_init = function(page_view,params_arr)
		{
			var that = this;
			
			//add by manson 2013.6.4
			notice.set_recommend_tips_close_storage(true)

			
			poco_id = common_function.get_local_poco_id();
            
            //未登录处理			
			if(poco_id<=0)
			{
				new_alert_v2.show({ text:"尚未登录",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
					
					page_control.back()
				}})

				return false
			}
            
            // 记录我的页面的添加好友红点
            //window.localStorage.setItem('friend_recommend_points_tips',1)
            
			
			_page_view = $(page_view.el)
            __page_view = page_view
			_params_arr = params_arr
            
			
			//刷新按钮  add by manson 2013.5.7
			refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(refresh_btn.$el)
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
            
            cur_data_list   = $(page_view.el).find('[data-for_list="'+select_type+'"]')
			
			//容器滚动
			var main_wraper = cur_data_list.find('.scroll_contianer')
                
			view_scroll = require('scroll')  
            
            
            view_height =  window.innerHeight - wo_config.header_height-104;// 104 为导航栏+搜索框的高度
            
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : view_height
			})            
            

            
            poco_list_view_obj = new user_list_view
			({
				el : _page_view.find('[data-for_list="poco"] .list-comment-item')
			})
            
            sina_list_view_obj = new user_list_view
			({
				el : _page_view.find('[data-for_list="sinaweibo"] .list-comment-item')
			})
            
            qq_list_view_obj = new user_list_view
			({
				el : _page_view.find('[data-for_list="qqweibo"] .list-comment-item')
			})
						
            
            //刷新列表监听
			poco_list_collection_obj.bind('reset', re_render_list , page_view)
			
			//加载更多监听
			poco_list_collection_obj.bind('add', add_render_list , page_view)
            
            //刷新列表监听
			sina_list_collection_obj.bind('reset', re_render_list , page_view)
			
			//加载更多监听
			sina_list_collection_obj.bind('add', add_render_list , page_view)
            
            //刷新列表监听
			qq_list_collection_obj.bind('reset', re_render_list , page_view)
			
			//加载更多监听
			qq_list_collection_obj.bind('add', add_render_list , page_view)

		}
        
        function selected_list_obj()
        {
            var selected_list_obj = {};
            
            switch(select_type)
            {

                case "poco" :
                     selected_list_obj.contoller_obj = poco_list_view_obj;
                     selected_list_obj.collection_obj = poco_list_collection_obj; 
                     break;
                case "sinaweibo" :
                     selected_list_obj.contoller_obj = sina_list_view_obj;
                     selected_list_obj.collection_obj = sina_list_collection_obj; 
                     break;
                case "qqweibo" :                                
                     selected_list_obj.contoller_obj = qq_list_view_obj;
                     selected_list_obj.collection_obj = qq_list_collection_obj; 
                     break;                                                         
            }
            
            return selected_list_obj ;
        }    
	   
		function re_render_list()
		{
			var that = this;
            
            var tpl_type = "";			        
			
			selected_list_obj().contoller_obj.clear_list()
			            
            var collection_obj = selected_list_obj().collection_obj
            
			collection_obj.each(function(item_model)
			{
				if(item_model.attributes.relationship && item_model.attributes.relationship == "error")
                {
                    return true;
                }                                
                
                if(item_model.attributes.user_id!=0)
                {
                    
                    tpl_type = "recommend" 
                    
                    if(item_model.attributes.is_world_user ==0&&select_type=='poco')
                    {
                        tpl_type = "invite"
                    }
                }
                else
                {
                    tpl_type = "invite"
                }   
                                
             
				var item_view = new user_list_item_view({ 
					model : item_model,
					tpl_type : "recommend",  
                    select_type : select_type                
				})		
						
				
				//每次add入列表
				selected_list_obj().contoller_obj.add_list_item(item_view) 
								 
			})
			

			//针对banner特殊处理 modify by manson 2013.8.12
			if(select_type=="world")
			{
				_page_view.find('[world_banner="1"]').prepend('<div class="title pl10 pr10 bgcd2d color999" data-master_title="">已加入世界的好友</div>')
				_page_view.find('[recommend_banner="1"]').prepend('<div class="title pl10 pr10 bgcd2d color999" data-master_title="">推荐达人</div>')
			}
					
			
			//滚回顶部
			view_scroll_obj.scroll_to(0)
		}
		
		function add_render_list(item_model)
		{
		    if(item_model.attributes.relationship && item_model.attributes.relationship == "error")
            {
                return ;
            }
            
            var tpl_type;  
          
            if(item_model.attributes.user_id!=0)
            {
                
                tpl_type = "recommend" 
                
                if(item_model.attributes.is_world_user ==0&&select_type=='poco')
                {
                    tpl_type = "invite"
                }
            }
            else
            {
                tpl_type = "invite"
            }   
            
			var item_view = new user_list_item_view({ 
				model : item_model,
				tpl_type : "recommend",    
                select_type : select_type       
			})

			//每次add入列表
			selected_list_obj().contoller_obj.add_list_item(item_view)           
			  
		}
       
        
        
		function show_no_data()
		{		    
			var data_for_list = _page_view.find('[data-for_list="'+select_type+'"]')

			data_for_list.find(".list-comment-item").hide()
			data_for_list.find(".no_data_txt").show()
		}
        
        function hide_no_data()
        {   
            var data_for_list = _page_view.find('[data-for_list="'+select_type+'"]')
            
			data_for_list.find(".list-comment-item").show()
			data_for_list.find(".no_data_txt").hide()			
        }

		var page = require('page').new_page(options);
		
		return page
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}