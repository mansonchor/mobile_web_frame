define("wo/my_wallet",["base_package","page_control","commom_function","wo_config","get_template","footer_view","refresh_btn","scroll","page","page_back_btn"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	
    
    exports.route = { "my_wallet": "my_wallet" }

	exports.new_page_entity = function()
	{
		var view_scroll_obj
		var _page_view 


		var options = {	
			transition_type : 'slide',
			dom_not_cache : true
		}
		
		options.initialize = function()
		{
			this.render()
		}
		
		var footer_view_obj
		options.render = function()
		{
			var template_control = require('get_template')
			var template_obj = template_control.template_obj()
			
			console.log(template_obj)

			var init_html = template_obj.my_wallet

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
			'tap [data-anchor-send-gift]' : function(ev)
			{
				page_control.navigate_to_page("get_friends_list/from_message")
			}
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

			var that = this
			
			_page_view = page_view		
			
			window.localStorage.setItem('my_wallet',1)
           
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
			
			
			common_function.send_request({
				url : 'http://m.poco.cn/mobile/action/my_wallet.php',
				callback : function(data)
				{
					page_view.$el.find('.score_value').html(data.score_value)
					
					page_view.$el.find('[user_icon]').attr('src',data.user_icon)
					
				}
			})
		}

		var page = require('page').new_page(options);
		
		return page;
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}