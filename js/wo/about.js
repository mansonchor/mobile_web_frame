define("wo/about", ["base_package", 'frame_package', "btn_package", "wo_config", "commom_function", "get_template", "footer_view", "notice", "new_alert_v2","app_function"], function(require, exports)
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
        "about" : "about"
    }

    exports.new_page_entity = function()
    {
        var options =
        {
            route :
            {
                "about" : "about"
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

            var init_html = '<header class="header re tc font_wryh">关于</header><div class="wraper_con"><div class="wraper_padding" style="padding-top:45px;"><div class="main_wraper about-page font_wryh color000"><div class="box1 tc"><div class="logo oh ma"><img src="images/app_icon-114x114.png" class="w-100"></div><p class="version-num pt15 pb15 lh10" data-vol_num></p><p class="f14 lh16">最高质量的生活照片分享平台</p></div><div class="bg-line oh w-100"></div><div class="box2 mt20"><table border="0" cellspacing="0" cellpadding="0" class="f12 ma"><tr><td width="40"><div class="box-wrap radius-2px pt5"><em class="icon-micro-msg icon-bg-common db ma"></em></div></td><td><div class="lh16"><p>订阅我们的微信公众号：<span class="poco-txt fb"><em class="font-arial fsn">POCO</em>世界精选</span></p><p>每日为你推送最新最精彩的手机照片。</p></div></td></tr></table></div></div></div></div><div class="copyright w-100 lh16 tc color999 f10 pb10"><p>POCO荣誉出版&nbsp;&nbsp;版权所有</p><p>欢迎访问POCO原创图片社区：WWW.POCO.CN</p></div>'

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
			'hold .logo' : function()
			{
				app_function.get_package_ver(function(response)
				{
					alert(response.packageVer)
				})
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
            
            // 记录我的页面的设置红点
            //window.localStorage.setItem('about_tips',1)
            
            //版本显示
            $(page_view.el).find("[data-vol_num]").html("V"+wo_config.version);

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