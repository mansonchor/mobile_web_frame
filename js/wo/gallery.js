define("wo/gallery", ["base_package", 'frame_package', "btn_package", "wo_config", "commom_function", "get_template", "footer_view", "notice", "new_alert_v2","app_function","carousel"], function(require, exports)
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
    var carousel = require('carousel') 

    var new_alert_v2 = require("new_alert_v2")

    exports.route =
    {
        "gallery" : "gallery"
    }

    exports.new_page_entity = function()
    {
        var options =
        {
            route :
            {
                "gallery" : "gallery"
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

            var init_html = '<div class="wraper_con last_big_img"><div class="wraper_padding"><div class="main_wraper about-page font_wryh color000"><div class="m-carousel m-fluid m-carousel-photos"><div class="m-carousel-inner "></div></div></div></div></div>'

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
                    //page_control.back()
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


            //容器滚动
            var wraper_con = $(page_view.el).find('.wraper_con')

            var view_scroll = require('scroll')
            view_scroll_obj = view_scroll.new_scroll(wraper_con,
            {
                'view_height' : common_function.container_height_with_head()
            })
            
            
            
            common_function.send_request
            ({
                url : wo_config.ajax_url.get_world_daliy+"?newspaper_id="+46,
                callback : function(data)
                {
                    var model_data = data.result_data.newspaper_info.photo_list;
                    
                    carousel.get_slide_big_img($(page_view.el).find('.m-carousel'),
                    {
                        data : model_data,
                        cur_page_view : $(page_view.el),
                        show_header : true,                     
                        carousel_config :
                        {
                            auto: 0,
                            layzload: true                            
                        },
                        back_btn_callback : function()
                        {
                            
                        },
                        after_slide_callback : function()
                        {
                            
                        }
                        
                    })
                },
                error : function()
                {
                    alert_tips.close();
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