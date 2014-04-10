define("wo/dating_game", ["base_package", 'frame_package', "btn_package", "wo_config", "commom_function", "get_template", "footer_view", "notice", "new_alert_v2", "world_list_module"], function(require, exports)
{
    var $ = require('zepto')
    var wo_config = require('wo_config')
    var page_control = require('page_control')
    var Backbone = require('backbone')
    var common_function = require('commom_function')
    var Mustache = require('mustache')
    var notice = require('notice')
    var cookies = require('cookies')        
    
    var box_count = 0    
    
    var sex = ""
    
    exports.route =
    {
        "dating_game(/:sex)" : "dating_game"
    }

    exports.new_page_entity = function()
    {
        var options =
        {

            route :
            {
                "dating_game(/:sex)" : "dating_game"
            },
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
            var that = this            
            
            var init_html = '<div class="wrap-box dating_game_page"><header class="header font_wryh tc re"><div class="tap-select-wrap"><span class="header_title"></span><div class="tab-select re bgc-fff-e2e"><ul class="clearfix"><li data-select_sex="女"><span>女生</span><em class="pop-empty pop-empty-1"></em></li><li data-select_sex="男"><span>男生</span></li><li data-select_sex="me"><span>我</span><em class="pop-empty pop-empty-2"></em></li></ul></div></div></header><div class="main_wraper" style="position:relative"><div class="friend-act font_wryh " style="padding-top:45px;"><div class="friend_ori dating_game" style="width: 100%;"><div data-male_container class="list_container color000 clearfix" style="display:none"><div><div class="big_img_container re oh"><table border="0" cellspacing="0" cellpadding="0" class="img-box-table w-100 h-100"><tr><td valign="middle" align="center"><div class="icon-bg-common loading"></div><img class="big_img img_buffer_bg" data-big_img src=""></td></tr></table></div></div></div><div data-female_container class="list_container color000 clearfix"><div><div class="big_img_container re oh"><table border="0" cellspacing="0" cellpadding="0" class="img-box-table w-100 h-100"><tr><td valign="middle" align="center"><div class="icon-bg-common loading"></div><img class="big_img img_buffer_bg" data-big_img src=""></td></tr></table></div></div></div><div data-my_container class="list_container color000 clearfix"><div><div class="big_img_container re oh"><table border="0" cellspacing="0" cellpadding="0" class="img-box-table w-100 h-100"><tr><td valign="middle" align="center"><div class="icon-bg-common loading"></div><img class="big_img img_buffer_bg" data-big_img src=""></td></tr></table></div></div></div></div></div><div class="txt_info colorfff pt10 pb10 pl10"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td valign="top"><div class="user_info" style="color:#fff"><span class="name mr5" style="font-size:12px"></span><span class="location_name f10"></span></div></td></tr><tr><td valign="top"><div class="instrest_tags oh"></div></td></tr></table></div><div class="fade_txt_info w-100 bgc-0-85"></div><div style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);"></div></div></div><div class="comment-love-mod footer-dating-publish"><ul class="clearfix"><li publish_btn class="publish w-100"><em class="icon icon-bg-common dib mr5 vam"></em>换一张</li></ul></div><div class="comment-love-mod footer-dating" style="display:none"><ul class="clearfix f10"><li class="his-home-page"><em class="icon icon-bg-common"></em>Ta的主页</li><li class="send-letter"><em class="icon icon-bg-common"></em>发私信</li><li class="next-per cur"><em class="icon icon-bg-common"></em>换一个</li></ul></div></div>'

            that.$el.append($(init_html))
        }

        options.events =
        {
   
            "tap .ui-btn-prev-wrap": function(ev) {

                page_control.back();
            },  
            'tap .his-home-page' : function()
            {
                var user_id                
                    
                if(sex == "男")
                {
                    user_id = males_obj.user_id                                     
                }   
                else if(sex == "女")
                {
                    user_id = females_obj.user_id
                
                }
                else
                {
                    user_id = me_obj.user_id
                }
                
                page_control.navigate_to_page("user_profile/" + user_id)
            },
            'tap .send-letter' : function()
            {
                var login_requirement = common_function.publish_login_requirement()
                if(login_requirement)
                {
                    page_control.navigate_to_page("login") 
                    
                    return;
                }
                
                var user_id                
                    
                if(sex == "男")
                {
                    user_id = males_obj.user_id                                     
                }   
                else if(sex == "女")
                {
                    user_id = females_obj.user_id
                
                }
                else
                {
                    user_id = me_obj.user_id
                }
                
            
                
                page_control.navigate_to_page("message_list/" + user_id)
            },
            'tap [data-select_sex]' : function(ev)
            {
                var cur_btn = $(ev.currentTarget);                                                                             
                                                 
                if(cur_btn.attr("data-select_sex") == "me" && me_obj.length<=0)
                {
                    page_control.navigate_to_page("recommend_me")
                    
                    return;
                }
                
                sex = cur_btn.attr("data-select_sex")
                
                _page_view.find("[data-select_sex]").removeClass("cur")
                
                cur_btn.addClass("cur")                                
                
                jude_controler(sex)                                                                              
                
                if(common_function.is_empty(list_controler.find('.big_img').attr("user_id"))&&sex!="me")
                {                    
                    user_info_collection_obj.refresh();
                }             
                else
                {
                    var item_model ;
                    
                    if(sex == "男")
                    {
                        item_model = males_obj                                     
                    }   
                    else if(sex == "女")
                    {
                        item_model = females_obj                                                                
                    }
                    else
                    {
                        item_model = me_obj                                               
                        
                        set_user_img(item_model)
                        
                        
                    }                                   
                                           
                    set_user_info(item_model)    
                }
                
                
                                                               
            },
            'tap .next-per' : function()
            {
                user_info_collection_obj.refresh();
            },
            'tap .footer-dating-publish' : function()
            {
                page_control.navigate_to_page("recommend_me")
            },
            'swiperight' : function()
            {
                user_info_collection_obj.refresh();
            },
            'swipeleft' : function()
            {
                user_info_collection_obj.refresh();
            }            
           
        }
        
        var collection_options = 
        {
            ajax_load_finish : function(model,response)
            {

            },
            before_refresh : function()
            {

                                 
            },
            before_get_more : function()
            {
                
            }
        }
        
        //数据model
        var user_model = Backbone.Model.extend({
            defaults:{}
        })
        
        //初始化数据
        var user_info_collection = Backbone.Collection.extend
        ({ 
            model : user_model,
            url : function()
            {
                return wo_config.ajax_url.get_dating_game_pics
            },
            refresh : function()
            {                
                collection_options.data = { sex : encodeURIComponent(sex) }                                                            

                common_function.collection_refresh_function.call(this,collection_options)
                
                common_function.page_pv_stat_action()

            },
            get_more_item : function(page)
            {
                var that = this
                
                console.log(sex)
                
                collection_options.data = { sex : encodeURIComponent(sex) }

                common_function.collection_get_more_function.call(this,collection_options)
            },
            parse: function(response) 
            {                
                if(response && typeof(response.result_data.info)!="undefined")
                {
                    sex = response.result_data.sex
                    
                    jude_controler(sex)  
                    
                    _page_view.find("[data-select_sex]").removeClass("cur")
                
                    _page_view.find("[data-select_sex='"+sex+"']").addClass("cur")
                    
                    me_obj = response.result_data.my_info
                    
                    return response.result_data.info
                }
                else
                {
                    return response
                }
                                
            }
        })
            

        
        var _page_view
        var _params_arr
        var view_scroll_obj
        var list_controler
        var males_obj = {}
        var females_obj = {}
        var me_obj = {}                
        var user_info_collection_obj
         

        //页面初始化时
        options.page_init = function(page_view, params_arr)
        {

            _page_view = $(page_view.el);
            _params_arr = params_arr;                        
            
            switch(parseInt(params_arr[0]))
            {
                case 0:
                    sex = "女";
                    break;
                case 1:
                    sex = "男";
                    break;  
                case 2:
                    sex = "me";
                    break;                    
                default:
                    sex = "女";
                    
            }                                         

            var view_scroll = require('scroll')

            var list_container = $(page_view.el).find('.main_wraper');
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
            
            
            /*
            view_scroll_obj = view_scroll.new_scroll(list_container,
            {
                'view_height' : common_function.container_height_with_head_and_nav()
            })
            */
            
            user_info_collection_obj = new user_info_collection;                           
            
            //刷新列表监听
            user_info_collection_obj.bind('reset', init_user_info , page_view)
            
            //加载更多监听
            user_info_collection_obj.bind('add', init_user_info , page_view)
            
            user_info_collection_obj.refresh()
                        
            

        }

        options.window_change = function(page_view)
        {
            //$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())

            set_img_container_height()
        }
        
        
        
        function init_user_info()
        {
            // 初始化            

            var item_model = user_info_collection_obj.models[0].attributes                                                                                 
                                                                                   
            if(sex == "男")
            {
                males_obj = item_model                
            }   
            else if(sex == "女")
            {
                females_obj = item_model                  
            }
            else if(sex == "me")
            {                                         
                
                item_model = me_obj
            }
            
            set_user_img(item_model)                             
                                   
            set_user_info(item_model)
            
            //滚回顶部
            //view_scroll_obj.scroll_to(0)
        } 
                                     
        
        function jude_controler(sex)
        {
            if(sex == "男")
            {
                list_controler = _page_view.find("[data-male_container]");
                
                _page_view.find("[data-male_container]").show()
                
                _page_view.find("[data-female_container]").hide()
                
                _page_view.find("[data-my_container]").hide()
            }
            else if(sex == "女")
            {
                list_controler = _page_view.find("[data-female_container]");
                
                _page_view.find("[data-female_container]").show()
                
                _page_view.find("[data-male_container]").hide()
                
                _page_view.find("[data-my_container]").hide()
            }
            else
            {
                list_controler = _page_view.find("[data-my_container]");
                
                _page_view.find("[data-female_container]").hide()
                
                _page_view.find("[data-male_container]").hide()
                
                _page_view.find("[data-my_container]").show()
            }                      

        }
        
        function set_user_img(item_model)
        {
            set_img_container_height()
            
            var img = new Image();
            
            img.src = common_function.matching_img_size(item_model.cover_img_url,"mb")
            
            list_controler.find('.big_img').hide();
            
            list_controler.find('.loading').show();
            
            img.onload = function()
            {               
                list_controler.find('.big_img').attr({"src":this.src,"user_id":item_model.user_id})
                
                list_controler.find('.loading').hide();
                
                list_controler.find('.big_img').show();
            }
        }
        
        function set_user_info(item_model)
        {
            console.log(item_model)
            
            list_controler.find('.instrest_tags').html("");
            
            list_controler.find('.name').html("");
            
            list_controler.find('.location_name').html("");
            
            _page_view.find('.name').html(item_model.nickname)
            
            var location_name = ""
            
            if(!common_function.is_empty(item_model.location_city))
            {
                location_name = item_model.location_province + "·" + item_model.location_city
            }
            else
            {
                location_name = item_model.location_province     
            }
            
            _page_view.find('.location_name').html(location_name)
            
            var tags = '';                                       
            
            if($(item_model.interest_tags).length>0)
            {
                _page_view.find('.instrest_tags').show()
                
                $(item_model.interest_tags).each(function(i,tag)
                {
                    tags += '<span class="tag_text f10 radius-2px">'+tag+'</span>'
                })    
            }
            else
            {
                _page_view.find('.instrest_tags').hide()
            }
                        
            
            _page_view.find('.instrest_tags').html(tags);
            
            if(sex == "me")
            {
                _page_view.find('.footer-dating-publish').show();
                
                _page_view.find('.footer-dating').hide();
            }
            else
            {
                _page_view.find('.footer-dating-publish').hide();
                
                _page_view.find('.footer-dating').show();
            }            
            
        }
        
        function set_img_container_height()
        {
            var img_container_height = window.innerHeight - 45 - 45;                                                           
            
            list_controler.find('.big_img_container').height(img_container_height)
        }
        
      

        
        var page = require('page').new_page(options);

        return page;
    }
});

if(typeof(process_add)=="function")
{
	process_add()
}