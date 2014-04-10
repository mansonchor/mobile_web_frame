define("wo/red_package", ["base_package", 'frame_package', "btn_package", "wo_config", "commom_function", "get_template", "footer_view", "notice", "new_alert_v2"], function(require, exports)
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
    
    var open_red_package = false;

    exports.route =
    {
        "red_package" : "red_package"
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

            var init_html = '<header class="header re tc font_wryh">世界币</header><div class="main_wrapper"><div class="wraper_padding" style="padding-top:45px;"><div class="world-coin-page bgcfff tc"><p class="fb color009 font_wryh" style="font-size:18px;">世界币正式发行</p><p class="f14 color333 mt5">生活因分享而精彩 世界因你而改变</p><div class="red-box color333" data-has_not_get_red_package="" style="display:none"><div class="lh16 f12 mb5">借着新年之际，愿小小的礼包<br/>陪伴你走过快乐幸福的<span class="font-arial">2014</span></div><div class="icon-red-img icon icon-close"></div></div><div class="red-box color333" data-has_get_red_package="" style="display:none"><p class="f14">恭喜你，获得 <span class="num fb" data-world-coins="">0</span> 世界币</p><p class="f10 color666 mb5">（可用于赠送礼物给好友，为TA提升魅力值）</p><div class="icon-red-img icon icon-open"></div></div><div class="save_btn" data-open_red_package="" style="display:none">马上领取礼包</div><div class="save_btn" data-to_my_wallet="" style="display:none">去看看我的钱包</div></div></div></div>'

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
            'tap [data-to_my_wallet]':function()
            {
                page_control.navigate_to_page("my_wallet")    
            },
            'tap [data-open_red_package]' : function()
            {
                if(open_red_package)
                {
                    return ;
                }
                
                open_red_package = true
                
                _page_view.$el.find('[data-open_red_package]').html("正在打开...")
                
                to_red_package_request("get",
                function(data)
                {
                    open_red_package = false;                    
                    
                    if(data.code >0)
                    {                                                
                        
                        control_red_package_show(false);                       
                        _page_view.$el.find('[data-world-coins]').html(data.code)
                        
                        _page_view.$el.find('[data-open_red_package]').html("马上打开红包")
                    }
                    else
                    {                                                                                               
                        control_red_package_show(true);
                    }
                },
                function()
                {
                    open_red_package = false;
                    
                    _page_view.$el.find('[data-open_red_package]').html("马上打开红包")
                });
            }
        }
        options.window_change = function(page_view)
        {
            $(page_view.el).find('.main_wrapper').height(common_function.container_height_with_head())
        }
        var view_scroll_obj
        var _page_view

        //页面初始化时
        options.page_init = function(page_view, params_arr)
        {
            _page_view = page_view
            
            var poco_id = common_function.get_local_poco_id();
            if(poco_id<=0)
            {
                new_alert_v2.show({ text:"尚未登录",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
                    
                    page_control.back()
                }})

                return false
            }

            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)

            //容器滚动
            var wraper_con = $(page_view.el).find('.main_wrapper')

            var view_scroll = require('scroll')
            view_scroll_obj = view_scroll.new_scroll(wraper_con,
            {
                'view_height' : common_function.container_height_with_head()
            })
            
            to_red_package_request("check",
                function(data)
                {                  
                                           
                    if(!data.code)
                    {   
                        // 还没有领取红包
                        control_red_package_show(true);                                                                 
                                                
                    }
                    else 
                    {   
                        // 已经领取了                                                                        
                        control_red_package_show(false);
                        
                        _page_view.$el.find('[data-has_get_red_package]').hide();

                        
                    }
                },
                function()
                {
                    
                });

        }
        
        function control_red_package_show(tag)
        {
            if(tag)
            {
                           
                // 没有打开红包
                _page_view.$el.find("[data-has_get_red_package]").hide();
                _page_view.$el.find("[data-to_my_wallet]").hide();
                
                _page_view.$el.find("[data-has_not_get_red_package]").show();
                _page_view.$el.find("[data-open_red_package]").show();   
            }
            else
            {                
                
                // 打开红包
                _page_view.$el.find("[data-has_not_get_red_package]").hide();
                _page_view.$el.find("[data-to_my_wallet]").show(); 
                
                _page_view.$el.find("[data-has_get_red_package]").show();
                _page_view.$el.find("[data-open_red_package]").hide();     
            }
        }
        
        function to_red_package_request(action_tag,success,error)
        {                                              
            var merge_data = 
            {
                 t : parseInt(new Date().getTime()),                   
                 action_tag : action_tag
            }
            
            common_function.send_request(
            {
                url : wo_config.ajax_url.to_red_package,
                data : merge_data,
                callback : function(data)
                {
                    if ( typeof success == "function")
                    {                                               
                        success.call(this, data);
                    }
                },
                error : function()
                {
                    if ( typeof error == "function")
                    {
                        error.call(this);
                    }
                }
            }); 
        }
        
        var page = require('page').new_page(options);

        return page;
    }
})

if(typeof(process_add)=="function")
{
	process_add()
}