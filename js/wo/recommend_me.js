define("wo/recommend_me", ["base_package", 'frame_package', "btn_package", "wo_config", "commom_function", "get_template", "footer_view", "notice", "new_alert_v2"], function(require, exports)
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
        "recommend_me" : "recommend_me"
    }

    exports.new_page_entity = function()
    {
        var options =
        {
            route :
            {
                "recommend_me" : "recommend_me"
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

            var init_html = '<header class="header re tc font_wryh">推我</header><div class="wraper_con"><div class="wraper_padding" style="padding-top:45px;"><div class="main_wraper recommend_me_page font_wryh"><div class="txt tc"><p class="tit fb color009 f16">让自己出现在邂逅游戏</p><p class="lh20 f14 mt15 color333">只需要发一张“自拍”照片，<br/>并带上#邂逅游戏# 的关键字就行了。</p></div><div class="ui-btn-register f16" data_to_send_photo><span>立刻发照片</span></div><p class="tigs color666 lh16 mt15">PS：照片能体现你最真实的，最美好的生活或者才艺，会获得更多人的喜欢的。</p></div></div></div>'

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
            'tap [data_to_send_photo]' : function()
            {
                var hash = location.hash.replace("#", "") 
                
                // 进入普通发布页 hdw                
                var stat_img = new Image()
                stat_img.src = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/publish_btn?url_hash="+hash+"&tmp="+new Date().getTime()

                var login_requirement = common_function.publish_login_requirement()
                if(login_requirement)
                {
                    page_control.navigate_to_page("login") 
                }
                else
                {                   
                    var page_from_url = common_function.get_target_refresh_url_by_hash_name('dating_game/2')                                        
                    
                    page_control.navigate_to_page("publish",{ key_word : "邂逅游戏" , camera_sharestr : "#邂逅游戏#",page_from_url:page_from_url})
                }
            }
        }

        options.window_change = function(page_view)
        {
            $(page_view.el).find('.wraper_con').height(common_function.container_height_with_head())
        }
        var view_scroll_obj
        var _page_view


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