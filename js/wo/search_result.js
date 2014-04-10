define("wo/search_result",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	var new_alert_v2 = require("new_alert_v2")
    
    var follow_tag = false;
    
    exports.route = { "search_result/:query": "search_result" }

	exports.new_page_entity = function()
	{
		var view_scroll_obj
		
		var _page_view 


		var options = {
			route : { "search_result": "search_result" },		
			transition_type : 'fade',
			dom_not_cache : true,
            ignore_exist : true            
		}
        
        
		var poco_id
        var friend_type
		var page_count = 20
		var user_list_view_obj
		
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
				user_list_view_obj.more_btn_reset()
				
				user_list_view_obj.hide_more_btn()  
                
                hide_loading()
                
                hide_no_data()     
                
                _page_view.find('.no_data [data-text]').html("")
                
                if(response.is_bind_sina == 0)
                {
                    _page_view.find('.has_data').hide();
                    
                    _page_view.find('.no_data [data-text]').html("你的新浪微博账号尚未绑定。")
                    
                    _page_view.find('.no_data').css("display","table");
                    
                    user_list_view_obj.hide_more_btn()
                    
                    return false
                }
                else 
                {
                    if(response.is_sina_over_time == 0)
                    {
                        _page_view.find('.has_data').hide();
                    
                        _page_view.find('.no_data [data-text]').html("由于新浪微博的相关规定，每次绑定世界的 有效期为90天。过期需要重新绑定。")
                        
                        _page_view.find('.no_data').css("display","table");
                        
                        user_list_view_obj.hide_more_btn()
                        
                        return false
                    }
                }
                
                
                if(response.is_bind_qq == 0)
                {
                    _page_view.find('.has_data').hide()
                    
                    _page_view.find('.no_data [data-text]').html("你的腾讯微博账号尚未绑定，需重新绑定。")
                    
                    _page_view.find('.no_data').css("display","table");
                    
                    user_list_view_obj.hide_more_btn()
                    
                    return false
                }           
                
                _page_view.find('.no_data').hide();
                _page_view.find('.has_data').show()
                
                if(response == false || response.length<=0)
                {
                    no_data()
                }	
			},
			before_refresh : function()
			{
			    show_loading() 
                
                _page_view.find(".no_data_txt").hide()
			},
			before_get_more : function()
			{
				user_list_view_obj.more_btn_loading()
			}
		}
		
		options.initialize = function()
		{
			this.render();
		}
        
        //初始化数据
		var new_user_list_collection = require('user_list_collection')
		
        var user_list_collection_obj = new_user_list_collection({
			url : wo_config.ajax_url.search,
			refresh : function(query)
			{   
			    collection_options.data = {query : query,friend_type : friend_type} 
			 
				common_function.collection_refresh_function.call(this,collection_options)
			}
		})
		
		// 列表子项视图
		var user_list_item_view = require('user_list_view')

		
		// 列表视图
		var user_list_view = require('user_list_controler')
        
		
		options.render = function()
		{
            var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><h3 class="tc"><span ><label data-doorplate_name></label>好友搜索</span></h3></header><div class="main_wraper" style="padding-top:45px;"><div class="search_result pb10 font_wryh" style="position:relative "><div class="content-10 search-item"><div class="search-box radius-2px"><table border="0" cellspacing="0" cellpadding="0"><tr><td><input type="text" data-search_input class="input-class font_wryh" placeholder="" style="width: 100%;" autofocus/></td><td data-to_search style="padding-left:15px" width="19"><span class="icon-search icon-bg-common"></span></td></tr></table></div></div><div class="has_data" style="border-top: 1px solid #c3c3c3;"><div class="font_wryh content" style="padding:0" id="container"><div class="list-comment-item content-10" style="padding-bottom: 10px;"></div><div class="middle_container" style="display: none;"><div class="loading ui-btn-refresh" style="display: none;"><table cellspacing="5" cellpadding="0" style="font-size: 14px;margin: 0 auto;color:#666"><tr><td width="60"><span>正在搜索</span></td><td><span class="icon icon-bg-common icon-load" style="margin-top:0px"></span></td></tr></table></div><div style="display: none;" class="no_data_txt">对不起！<br/>没有找到你搜索条件的用户。</div></div></div></div><div class="no_data" style="border-top: 1px solid #c3c3c3;display: none;"><div style="vertical-align: middle;padding: 30% 25px 0 25px;" class="bind_btn"><div style="text-align: left;" data-text></div><div class="save_btn mt10 bolder" data-to_bind><span class="radius-2px">重新绑定</span></div></div></div></div></div></div>'

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
            'tap [data-to_search]' : function(ev)
            {
                var query = _page_view.find("[data-search_input]").val();
                
                if(query == "")
                {   
                    return
                }
   
                user_list_collection_obj.refresh(query)          
            },
			'change [data-search_input]' : function()
			{
				var query = _page_view.find("[data-search_input]").val();
                
                if(query == "")
                {   
                    return
                }
   
                user_list_collection_obj.refresh(query)
			},
            'tap .bind_btn' : function()
            {
                page_control.navigate_to_page("setup")
            }
		}

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(view_height)
		}
		

		//页面显示时
        var search_result_obj
        var _params_arr
        var alert_tips
        var view_height
        


		//页面初始化时
		options.page_init = function(page_view,params_arr)
		{
			var that = this;
            
            //未登录处理
            poco_id = common_function.get_local_poco_id();
            
            if(poco_id<=0)
			{
				new_alert_v2.show({ text:"尚未登录",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
					
					page_control.back()
				}})

				return false
			}
			
			_page_view = $(page_view.el)		
			_params_arr = params_arr
           
			//容器滚动
			var main_wraper = $(page_view.el).find('#container')
            
            view_height =  window.innerHeight - wo_config.header_height-60;// 60 为搜索框的高度

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : view_height
			})                        
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
            
            friend_type = _params_arr[0]
            
            var water_str = ""
            
            switch(friend_type)
            {
                case "world" :
                     water_str = "世界好友的昵称或ID";
                     break;
                case "poco" :
                     water_str = "POCO好友的昵称";
                     break;
                case "sinaweibo" :
                     water_str = "新浪微博好友的昵称";
                     break;
                case "qqweibo" :                                
                     water_str = "腾讯微博好友的昵称";
                     break;
            }
            

            _page_view.find("[data-search_input]").attr("placeholder",water_str)
            
            user_list_view_obj = new user_list_view
			({
				el : $(page_view.el).find('.list-comment-item')
			})
			
			//刷新列表监听
			user_list_collection_obj.bind('reset', re_render_list , page_view)
			

			setTimeout(function(){
				page_view.$el.find('[data-search_input]').focus()
			},500)
		}
        
        function re_render_list()
		{
			var that = this;			        
			
			user_list_view_obj.clear_list()
			
			user_list_collection_obj.each(function(item_model)
			{
			    if(item_model.attributes.relationship && item_model.attributes.relationship == "error")
                {
                    return true;
                }       
             
				var item_view = new user_list_item_view({ 
					model : item_model,
					tpl_type : "search",
					poco_id : poco_id                
				})		
						
				
				//每次add入列表
				user_list_view_obj.add_list_item(item_view) 
								 
			})
					
			//滚回顶部
			view_scroll_obj.scroll_to(0)
			
			_page_view.find('[data-search_input]').blur()
		}
		
		
        function no_data()
		{		    
            hide_list()
            _page_view.find(".no_data_txt").show()		
		}
        
        function hide_no_data()
        {            
            _page_view.find(".no_data_txt").hide()
            show_list()
        }
        
        function hide_loading()
        {            
            _page_view.find(".loading").hide()            
            show_list()
        }
        
        function show_loading()
        {
            hide_list()
            _page_view.find(".loading").show()
        }
        
        function show_list()
        {
            _page_view.find(".list-comment-item").show()
            _page_view.find(".middle_container").hide()
        }
        
        function hide_list()
        {
            _page_view.find(".list-comment-item").hide()
            _page_view.find(".middle_container").show()
        }

		var page = require('page').new_page(options)
		
		return page
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}