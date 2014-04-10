define("wo/share", ["base_package", 'frame_package', "btn_package", "wo_config", "commom_function", "get_template", "footer_view", "notice", "new_alert_v2","ua"], function(require, exports)
{
    var $ = require('zepto')
    var wo_config = require('wo_config')
    var page_control = require('page_control')
    var Backbone = require('backbone')
    var common_function = require('commom_function')
    var Mustache = require('mustache')
    var notice = require('notice')
    var cookies = require('cookies')
    var ua = require('ua')

    var new_alert_v2 = require("new_alert_v2")

    exports.route =
    {
        "share" : "share"
    }

    exports.new_page_entity = function()
    {
        var options =
        {
            route :
            {
                "share" : "share"
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

            var init_html = '<header class="header re tc font_wryh">关于</header><div class="wraper_con"><div class="wraper_padding" style="padding-top:45px;"><div class="main_wraper about-page font_wryh color000"><div class="pop-personal-wrap w-100 oh color333" data-pop-personal="" ><div class="item bgcfaf"><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tbody><tr><td align="center" valign="middle" data-to_share="sina" class="td-report"><span class="icon-wrap radius-2px"><em class="icon icon-report icon-bg-common"></em></span><p class="mt10">新浪</p></td><td align="center" valign="middle" data-to_share="qqweibo" class="td-report"><span class="icon-wrap radius-2px"><em class="icon icon-report icon-bg-common"></em></span><p class="mt10">腾讯微博</p></td><td align="center" valign="middle" data-to_share="qqzone" class="td-refresh"><span class="icon-wrap radius-2px"><em class="icon icon-refresh icon-bg-common"></em></span><p class="mt10">QQ空间</p></td></tr></tbody></table></div><div class="btn-cancel tc" data-cancel="">取消</div></div></div></div></div>'

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
            'tap [data-to_share]' : function(ev)
            {
                var cur_share_tag = $(ev.currentTarget).attr("data-to_share")
                
                share_img(cur_share_tag);
            }
        }
        options.window_change = function(page_view)
        {
            $(page_view.el).find('.wraper_con').height(common_function.container_height_with_head())
        }        

        function setup_user_img_height()
        {
            var banner_img_height = parseInt((window.innerWidth-20) * (400 / 600))
            $(_page_view.el).find(".user-pic-photowall img").height(banner_img_height)
        }

        var view_scroll_obj
        var _page_view
        var _state
        
        //页面初始化时
        options.page_init = function(page_view, params_arr,state)
        {
            _page_view = page_view
            _state = state;

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
        
        function share_img(cur_share_tag)
        {
            if(_state&&_state!=null)
            {
                var shareImg = encodeURIComponent(_state.shareImg)
                var shareTxt = encodeURIComponent(_state.shareTxt)
                var shareUrl = encodeURIComponent(_state.shareUrl)
                
                switch(cur_share_tag)
                {
                     case "sina" :
                          var url = 'http://service.weibo.com/share/share.php?title='+shareTxt+'，点击欣赏：&url='+shareUrl+'&pic='+shareImg+'&appkey=1684948437&source=bookmark'                                                    
                          break;
                     case "qqweibo":
                          var url = 'http://share.v.t.qq.com/index.php?c=share&a=index&title='+shareTxt+'&url='+shareUrl+'&pic='+shareImg+'&source=bookmark'                          
                          break;
                     case "qqzone":                                                                             
                          var url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title='+shareTxt+'&summary='+shareTxt+'&desc='+shareTxt+'&url='+shareUrl+'&pics='+shareImg                                                                                                          
                          break;    
                }
                
                console.log(url)
                
                window.open(url)
            }
            
            
        }
			
        var page = require('page').new_page(options);
        
        

        return page;
    }
})