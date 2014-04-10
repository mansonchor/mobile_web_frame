/**
  *	 view滚动控制
  *	 针对支持overflow:scroll和低版本系统分别处理
  *	 @author Manson
  *  @version 2013.2.16
  */
define("wo/setup",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","new_alert_v2"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	var new_alert_v2 = require("new_alert_v2")
    
    exports.route = { "setup": "setup" }

	exports.new_page_entity = function()
	{
		var view_scroll_obj
		var user_info_obj
		var _page_view 


		var options = {
			route : { "setup": "setup" },		
			transition_type : 'slide',
            dom_not_cache: true
		};
		
		var page_loading
		
		options.initialize = function()
		{
			this.render();
		}
		
		var footer_view_obj
		options.render = function()
		{
			var template_control = require('get_template')
			
			var template_obj = template_control.template_obj()
			
			var init_html = template_obj.setup;       						

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
			'tap [data-to_login]' : function(ev)
			{
				var cur_btn = $(ev.currentTarget);                                                
				
				if(cur_btn.find('[data-bind]').attr('data-bind')==1)
				{
					return ;
				}    
				
				show_login_form(cur_btn.attr("data-to_login"))
			},			
            'tap [data-open_like_photo]' : function(ev)
            {
                var cur_btn = $(ev.currentTarget)
                
                var select_tag = cur_btn.find(".select_tag"); 
                
                var like_feed_is_show 
                
                if(select_tag.hasClass("icon-no-select"))
                {
                    // 选中
                    
                    like_feed_is_show = 1;
                    
                    selected_ui_action(cur_btn,like_feed_is_show);
                }
                else
                {
                    // 取消
                    
                    like_feed_is_show = 0;
                    
                    selected_ui_action(cur_btn,like_feed_is_show);
                }
    
                save_settiong_action
                ({
                    like_feed_is_show : like_feed_is_show
                })
            },          
            'tap [data-open_hd_photos]' : function(ev)
            {
                var cur_btn = $(ev.currentTarget)
                
                var select_tag = cur_btn.find(".select_tag");                                 
                
                if(select_tag.hasClass("icon-no-select"))
                {
                    // 选中
                    
                    selected_ui_action(cur_btn,1);
                    
                    window.localStorage.setItem("open_hd_photo",1)
                }
                else
                {
                    // 取消
                    
                    selected_ui_action(cur_btn,0);
                    
                    window.localStorage.setItem("open_hd_photo",0)
                    
                }
    
   
            }
                        
		}
        
        //数据model
        
		var setting_info_model = Backbone.Model.extend({
			defaults:
			{				
				is_bind_sina : "",
				is_bind_qq : "",
				is_sina_over_time : ""
			},
			refresh : function()
			{           		
				_page_view.page_lock = true
                
                var alert_tips = new_alert_v2.show({text:"加载中",type : "loading",is_cover : true ,auto_close_time:false,auto_close_time : wo_config.ajax_timeout,append_target:_page_view});               				

				this.fetch
				({
					type: "GET",  
					data: {t : parseInt(new Date().getTime()) },
					timeout : wo_config.ajax_timeout,
					success : function()
					{						
						_page_view.page_lock = false
                                                
                        alert_tips.close()
					},  
					error:function(err)
					{  						
						_page_view.page_lock = false
                                                                                                                         
                        alert_tips.close()
					}  
				})
			},
			url : wo_config.ajax_url.setup+"?is_update=0"
		})

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
		}
		

		//页面初始化时
		options.page_init = function(page_view)
		{
			//未登录处理
			var poco_id = common_function.get_local_poco_id()
			if(poco_id<=0)
			{
				new_alert_v2.show({ text:"尚未登录",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
					
					page_control.back()
				}})

				return false
			}
			
			// 记录我的页面的设置红点
            //window.localStorage.setItem('set_up_tips',1)

			var that = this;
			
			_page_view = $(page_view.el)		
			   
            
            var setting_info_obj = new setting_info_model;                        
			
			setting_info_obj.bind("change",set_setting_info,_page_view);
            
			setting_info_obj.refresh();  

           
			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head()
			})
			
			if(window.localStorage.getItem("open_hd_photo") == 1)
			{
			    selected_ui_action($(page_view.el).find("[data-open_hd_photos]"),1);
			    
			}
			else
			{
			    selected_ui_action($(page_view.el).find("[data-open_hd_photos]"),0);
			}
		}
        
        window.onmessage =  function(e)
			{
				var access_data = JSON.parse(e.data)

			
				if(access_data.result == 200)
				{				
					
					new_alert_v2.show({text:"绑定成功",auto_close_time : 1000,auto_close_time : 2000});
                    
                    _page_view.find("#sina_over_time").html("未过期").css("color","").addClass('yi-txt')
                    _page_view.find("#sina_bind").attr("data-bind",1)
				}
				else
				{				
					new_alert_v2.show({text:"绑定失败,"+access_data.result,type:"info",auto_close_time : 2000});
				}
					                   
                
				//page_control.back()
			}
        
        function set_setting_info(model)
        {
            var page_view = this
			
			var model = model.attributes;
			
			var is_bind_sina = model.is_bind_sina ,
				is_bind_qq = model.is_bind_qq ,
                is_sina_over_time = model.is_sina_over_time,
                like_feed_is_show = model.like_feed_is_show
            
            // UI绑定
            
            var data_poco_id = _page_view.find("[data-poco_id]"); 
                
            var open_like_photo = _page_view.find("[data-open_like_photo]");    
                
            selected_ui_action(open_like_photo,like_feed_is_show);
            
			var local_poco_id = common_function.get_local_poco_id()
            data_poco_id.html("("+local_poco_id+")")
            
            init_account_binding(model)
        }
        
        // 勾选操作
        function selected_ui_action(cur_btn,val,selected,no_select)
        {
                var select_tag = cur_btn.find(".select_tag"); 
                var selected_html = '<em class="icon icon-bg-common"></em>'
                
                if(val == 1 )
                {                    
                    select_tag.removeClass("icon-no-select")
                    select_tag.addClass("icon-yi-select")
                    select_tag.append(selected_html)
                    
                    if(typeof selected == 'function')
                    {
                        selected.call(this)
                    }
                }
                else
                {
                    select_tag.addClass("icon-no-select")
                    select_tag.removeClass("icon-yi-select")
                    select_tag.html("")
                    
                    if(typeof no_select == 'function')
                    {
                        no_select.call(this)
                    }
                }
        }
        
        
        
        // 保存设置请求
        function save_settiong_action(options)
        {
            var options = options || {},
                like_feed_is_show = options.like_feed_is_show;
            
            var params = {};
                
            params = {like_feed_is_show : like_feed_is_show ,is_update : 1};
		
			common_function.send_request
			({
				url : wo_config.ajax_url.setup,
				data : params
			})
            
        }
        
        function init_account_binding(model)
		{                      
            if(model.is_bind_sina == 0)
            {
                _page_view.find("#sina_bind").attr("data-bind",model.is_bind_sina).html("未绑定")
                
                _page_view.find("[data-to_login='sina']").find("[data-arrow]").show() 
            }
            else
            {
                
                
                if(model.is_sina_over_time == 0)
                {
                    _page_view.find("#sina_bind").attr("data-bind",model.is_sina_over_time).html("已过期").removeClass('update-psw')
                    
                    _page_view.find("[data-to_login='sina']").find("[data-arrow]").show() 
                }
                else
                {
                    _page_view.find("#sina_bind").attr("data-bind",model.is_bind_sina).html("已绑定").addClass('update-psw')    
                
                    _page_view.find("[data-to_login='sina']").find("[data-arrow]").hide()    
                }
            }
            
            if(model.is_bind_qq  == 0)
            {
                _page_view.find("#qqweibo_bind").attr("data-bind",model.is_bind_qq).html("未绑定")
                
                _page_view.find("[data-to_login='qqweibo']").find("[data-arrow]").show()
            }
            else
            {
                _page_view.find("#qqweibo_bind").attr("data-bind",model.is_bind_qq).html("已绑定").addClass('update-psw')
                
                _page_view.find("[data-to_login='qqweibo']").find("[data-arrow]").hide()
            }                        
		}
        
        function show_login_form(login_tag)
		{
			var last_url = ""
			var req_url = "http://m.poco.cn/mobile/action/login_bind.php?is_manage=1&login_tag="+login_tag

            
            var history_arr = page_control.page_history();
			last_url = history_arr[history_arr.length-2];     
            
            if(!last_url)
            {
                last_url = common_function.get_target_refresh_url_by_hash_name()
            }                       
				
			top.location.href = req_url+ "&locate="+ encodeURIComponent(last_url) 
			
		}
        
		var page = require('page').new_page(options);
		
		return page;
	}
})


if(typeof(process_add)=="function")
{
	process_add()
}