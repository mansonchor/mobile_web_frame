/**
  *	 view滚动控制
  *	 针对支持overflow:scroll和低版本系统分别处理
  *	 @author Manson
  *  @version 2013.2.16
  */
define("wo/placard",["base_package","page_control","commom_function","wo_config","get_template","footer_view","refresh_btn","scroll","page","page_back_btn"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	
    
    exports.route = { "placard": "placard" }

	exports.new_page_entity = function()
	{
		var view_scroll_obj
		var user_info_obj
		var _page_view 


		var options = {
			route : { "placard": "placard" },		
			transition_type : 'slide',
			dom_not_cache : true
		}
		
		options.initialize = function()
		{
			this.render();
		}
		
		var footer_view_obj
		options.render = function()
		{
			
            var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><h3 class="clearfix" style="display:inline-block;width:100%;text-align:center"><span class="pl20">领取你的门牌</span></h3></header><div class="content-10 main_wraper" style="padding: 0 10px;"><div class="placard mt10 font_wryh pb10" style="position:relative;padding-top:45px;"><div class="content font_wryh " id="container" style="padding:15px 20px;background:#fff;position:relative"><div style="width: 100%;text-align:center" class="bolder notice">公告</div><div style="margin-top: 10px;height:5px;text-align: center;margin-bottom: 20px;background:url(images/intro_line.png) center center no-repeat;background-size:226px 5px;"></div><p class="bolder" style="margin-top: 25px;font-size:14px;font-weight:normal">POCO世界新上线了门牌功能，在你发布照片，评论，喜欢等交互的时候，能够获得一枚枚独特有趣的门牌。</p><div style="margin-top:25px;font-size:16px;color: #249AC6;font-weight: bold;"><label style="margin-right:10px">●</label>门牌，是身份的象征</div><div style="font-size:16px;color: #52af17;font-we25ight: bold;"><label style="margin-right:10px">●</label>门牌，是社交个性的标示</div><div style="font-size:16px;color: #ff9000;margin-bottom:30px;font-weight: bold;"><label style="margin-right:10px">●</label>门牌，是自己的财富</div><div class="logo" style="text-align:right"><img src="images/intro_logo.png" style="width: 65px;height: 15px"/></div></div><div class="footer_btn"><table border="0" cellspacing="0" cellpadding="0" width="100%"><tr><td width="100%"><div class="footer_btn_style font_wryh bolder" data-nav_to_decoration><span style="-webkit-border-radius: 2px;">查看我的门牌</span></div></td></tr></table></div></div></div></div>'						 

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
			'tap [data-nav_to_decoration]' : function()
            {
                if(page_control.page_transit_status()) return false                                
                
				var poco_id = common_function.get_local_poco_id()
	           
                if(poco_id==0)
                {
                    page_control.navigate_to_page("login")    
                }
                else
                {                    
                    //var page_from_url = "http://m.poco.cn/mobile/#complete_publish"                    
                    //page_control.navigate_to_page("publish",{page_from_url : page_from_url,key_word : "装修活动" ,camera_sharestr : "#POCO装修季#一图一世界，等你"})
                    
                    page_control.navigate_to_page("doorplate_list/"+poco_id)     
                }
                
                
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

       
		//页面初始化时
		options.page_init = function(page_view)
		{
			var that = this;
			
			_page_view = page_view		
			
           
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

		}

		var page = require('page').new_page(options);
		
		return page;
	}
    
	
});