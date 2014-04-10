define("wo/encounter_game", ["base_package", 'frame_package', "btn_package", "wo_config", "commom_function", "get_template", "footer_view", "notice", "new_alert_v2"], function(require, exports)
{
    var $ = require('zepto')
    var wo_config = require('wo_config')
    var page_control = require('page_control')
    var Backbone = require('backbone')
    var common_function = require('commom_function')
    var Mustache = require('mustache')
    var notice = require('notice')
    var cookies = require('cookies')

    var new_alert_v2 = require("new_alert_v2")

    exports.route =
    {
        "encounter_game" : "encounter_game"
    }

    exports.new_page_entity = function()
    {
        var options =
        {
            route :
            {
                "encounter_game" : "encounter_game"
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

            var init_html = '<header class="header re tc font_wryh">邂逅游戏</header><div class="wraper_con"><div class="wraper_padding" style="padding-top:45px;"><div class="main_wraper encounter-game pt15 pl10 pr10 font_wryh"><div class="user-pic-photowall"><img src="images/img-600x400.jpg" class="w-100"></div><div class="txt f16 tc"><p>和喜欢的她／他，说：你好</p><p class="mt15 fb">世界因你而改变</p></div><div class="ui-btn-register f16" data_to_join><span>立即参与</span></div></div></div></div>'

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
            'tap [data_to_join]' : function(ev)
            {
                page_control.navigate_to_page("dating_game")
            }
        }
        options.window_change = function(page_view)
        {
            $(page_view.el).find('.wraper_con').height(common_function.container_height_with_head())
            setup_user_img_height()
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

            setup_user_img_height()
        }
        var page = require('page').new_page(options);

        return page;
    }
})

if(typeof(process_add)=="function")
{
	process_add()
}