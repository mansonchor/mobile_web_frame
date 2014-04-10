define("wo/font_page", ["base_package", 'frame_package', "btn_package", "wo_config", "commom_function", "get_template", "footer_view", "notice", "new_alert_v2","app_function"], function(require, exports)
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
        "font_page" : "font_page"
    }

    exports.new_page_entity = function()
    {
        var options =
        {
            route :
            {
                "font_page" : "font_page"
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

            var init_html = '<div class="wraper_con"><div class="wraper_padding" style="padding-top:45px;"><div class="main_wraper about-page font_wryh color000"><div class="bg-line oh w-100"></div><div class="box2 mt20"><table border="0" cellspacing="0" cellpadding="0" class="f12 ma"><tr><td><div class="lh16"><div class="btn-mod btn-register color000 mt10 bgcf0f" data-register style="width:280px;height:45px;line-height:45px;">注册</div><div class="btn-mod btn-register colorfff mt10 bgc03a" data-login style="width:280px;height:45px;line-height:45px;">登录</div></div></td></tr></table></div></div></div></div>'

            that.$el.append($(init_html))
        }

        options.events =
        {
            'tap [data-register]' : function()
            {
                page_control.navigate_to_page("register");
            },
            'tap [data-login]' : function()
            {
                page_control.navigate_to_page("login",{url_form_font_page:true});
            }                        			
        }
        options.window_change = function(page_view)
        {
            $(page_view.el).find('.wraper_con').height(common_function.container_height_with_head())
        }
        var view_scroll_obj
        var _page_view

        function setup_user_img_height()
        {
            var banner_img_height = parseInt((window.innerWidth-20) * (400 / 600))
            $(_page_view.el).find(".user-pic-photowall img").height(banner_img_height)
        }

        //页面初始化时
        options.page_init = function(page_view, params_arr)
        {
            _page_view = page_view

            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)

            //容器滚动
            var wraper_con = $(page_view.el).find('.wraper_con')

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