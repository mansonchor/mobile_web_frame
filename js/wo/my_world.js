define("wo/my_world", ["base_package", 'frame_package', "btn_package", "wo_config", "commom_function", "get_template", "footer_view", "notice", "new_alert_v2","app_function"], function(require, exports)
{
    var $ = require('zepto')
    var wo_config = require('wo_config')
    var page_control = require('page_control')
    var Backbone = require('backbone')
    var common_function = require('commom_function')
	var app_function = require('app_function')
    var Mustache = require('mustache')
    var notice = require('notice')
    var cookies = require('cookies')

    var new_alert_v2 = require("new_alert_v2")

    exports.route =
    {
        "my_world" : "my_world"
    }

    exports.new_page_entity = function()
    {
        var options =
        {
            route :
            {
                "my_world" : "my_world"
            },
            transition_type : 'slide',
            dom_not_cache : true,
            ignore_exist : true
        };

        options.initialize = function()
        {
            this.render();
        }

        options.render = function()
        {
            var that = this

            var init_html = '<div class="wrap-box"><header class="header font_wryh fb tc re">我的世界</header><div class="content-25 no_login" style="display: none;"><div class="me-page-nologin font_wryh"><table border="0" cellspacing="0" cellpadding="0"><tr><td align="center"><p>你尚未登录，请点击按钮进行登录/注册。</p><div login_btn class="ui-btn-register mt20"><span >登录</span></div></td></tr></table></div></div><div class="content-padding0 main_wraper" ><div class="me-page font_wryh color000 f12" style="padding-top:45px;"><div class="me-center p10"><div class="love-box mb10 bdb-line"><div class="me-item item-border-top " data-to_edit="edit" ><table border="0" cellspacing="0" cellpadding="0"><tr><td><div class="clearfix"><div class="title fl" >编辑个人资料</div><em class="icon-new fr icon-bg-common mr10 data-edit_point" style="display: none;"></em></div></td><td width="8"><span class="icon-go icon-bg-common"></span></td></tr></table></div><div class="me-item item-border-top" data-to_my_grid><table border="0" cellspacing="0" cellpadding="0"><tr><td><div class="clearfix"><div class="title fl" >我的聚光片</div><em class="icon-new fr icon-bg-common mr10 data-my_grid_point" style="display: none;"></em></div></td><td width="8"><span class="icon-go icon-bg-common"></span></td></tr></table></div></div><div class="love-box mb10 bdb-line"><div class="me-item" data-like_photo_list_nav><table border="0" cellspacing="0" cellpadding="0"><tr><td><div class="title" data-like-msg>我喜欢的照片</div></td><td width="8"><span class="icon-go icon-bg-common"></span></td></tr></table></div><div class="me-item item-border-top " data-to_fans><table border="0" cellspacing="0" cellpadding="0"><tr><td><div class="title" data-my_doorplate>我的粉丝</div></td><td width="8"><span class="icon-go icon-bg-common"></span></td></tr></table></div><div class="me-item item-border-top " data-to_follow><table border="0" cellspacing="0" cellpadding="0"><tr><td><div class="title" data-my_doorplate>我的关注</div></td><td width="8"><span class="icon-go icon-bg-common"></span></td></tr></table></div><div class="me-item item-border-top " data-to_doorplate=""><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div class="title" data-my_doorplate="">我的门牌</div></td><td width="8"><span class="icon-go icon-bg-common"></span></td></tr></tbody></table></div></div><div class="love-box mb10 bdb-line"><div class="me-item" data-setup_nav><table border="0" cellspacing="0" cellpadding="0"><tr><td><div class="clearfix"><div class="title fl">偏好设置</div><em class="icon-new fr icon-bg-common mr10 data-setup_point" style="display: none;"></em></div></td><td width="8"><span class="icon-go icon-bg-common"></span></td></tr></table></div><div class="me-item item-border-top" data-bind_share_platform style="display:none"><table border="0" cellspacing="0" cellpadding="0"><tr><td><div class="clearfix"><div class="title fl">绑定分享平台</div><em class="icon-new fr icon-bg-common mr10 data-setup_point" style="display: none;"></em></div></td><td width="8"><span class="icon-go icon-bg-common"></span></td></tr></table></div></div></div></div><div style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);" ></div></div></div><footer class="footer"></footer></div>'

            that.$el.append($(init_html))
        }

        options.events =
        {
            'tap .ui-btn-prev-wrap' : function(ev)
            {
                page_control.back()
            },
            'swiperight' : function()
            {
                if (!common_function.get_ua().is_uc)
                {
                    page_control.back()
                }
            },            
            'tap [data-to_edit]' : function()
            {
                if(_page_view.page_lock) return false                                        
                
                page_control.navigate_to_page("edit",
                {
                   mark_from_my_world : true
                 }
				)
            },
            'tap [data-to_my_grid]' : function()
            {
                if(_page_view.page_lock) return false                                   
                
                page_control.navigate_to_page("my_image_wall")
            },
            "tap [data-setup_nav]" : function()
            {
                if(_page_view.page_lock) return false                               

                page_control.navigate_to_page("setup")
            },
            "tap [data-like_photo_list_nav]" : function()
            {
                if(_page_view.page_lock) return false                               

                page_control.navigate_to_page("like_photo_list")
            },
            "tap [data-to_fans]" : function()
            {
                if(_page_view.page_lock) return false                               

                page_control.navigate_to_page("fans/"+user_id,{nick_name : "我"})
            },
            "tap [data-to_follow]" : function()
            {
                if(_page_view.page_lock) return false                               

                page_control.navigate_to_page("follow/"+user_id,{nick_name : "我"})
            },
			"tap [data-to_doorplate]" : function()
            {
                if(_page_view.page_lock) return false                               

                page_control.navigate_to_page("doorplate_list/"+user_id,{nick_name : "我"})
            },
            'tap [login_btn]' : function()
            {
                if(page_control.page_transit_status()) return false

                page_control.navigate_to_page("login")
            },
			'tap [data-bind_share_platform]' : function()
			{
				app_function.app_share_setup()
			}

        }
        
        //页面显示时
        var is_login_tag = true
        options.page_before_show = function(page_view)
        { 
            $(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
            
            $(page_view.el).find('.no_login').height(common_function.container_height_with_head())             
            
            var poco_id = common_function.get_local_poco_id()            
                   
            if(poco_id==0)
            {
                
                page_view.$el.find('.header').hide() 
             
                page_view.$el.find('.no_login').show()
                
                page_view.$el.find('.main_wraper').hide().css('visibility','visible')
                                
                
                is_login_tag = false
            }
            else
            {                                    
                page_view.$el.find('.header').show() 
             
                page_view.$el.find('.no_login').hide()
                
                page_view.$el.find('.main_wraper').show().css('visibility','visible')
            }
        }
        
        options.window_change = function(page_view)
        {
            $(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
        }
        
        var view_scroll_obj
        var _page_view
        var user_id 

        //页面初始化时
        options.page_init = function(page_view, params_arr)
        {
            _page_view = page_view
            
            user_id = common_function.get_local_poco_id()

            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)

            // 记录我的页面的设置红点
            window.localStorage.setItem('my_world',1)

			
			if( app_function.is_world_app() )
			{
				page_view.$el.find('[data-bind_share_platform]').show()
			}						


            //容器滚动
            var wraper_con = $(page_view.el).find('.main_wraper')

            var view_scroll = require('scroll')
            view_scroll_obj = view_scroll.new_scroll(wraper_con,
            {
                'view_height' : common_function.container_height_with_head()
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