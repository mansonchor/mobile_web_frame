define("wo/message_list", ['base_package', 'frame_package', "btn_package", "wo_config", "commom_function", "get_template", "new_alert_v2", "emoticon_module", "notice"], function(require, exports)
{
    var $ = require("zepto");
    var wo_config = require("wo_config");
    var page_control = require("page_control");
    var Backbone = require("backbone");
    var common_function = require("commom_function");
    var Mustache = require("mustache");

    var new_alert_v2 = require("new_alert_v2")
    var ua = require('ua')
    var emoticon_module = require("emoticon_module");

    var notice = require('notice')

    var can_cmt = 1
    var can_cmt_des = "";
    var normal_cmt_des = "";
    var to_user_id
    var can_click_pull_btn = false;

    exports.route =
    {
        "message_list/:query" : "message_list"
    }

    exports.new_page_entity = function()
    {
        var options =
        {
            route :
            {
                "message_list/:query" : "message_list"
            },
            transition_type : "slideup",
            dom_not_cache : true,
            ignore_exist : true
        };

        // 列表子项对象
        var message_list_item_model = Backbone.Model.extend(
        {
            defaults :
            {

            }
        });
        var page_count = 20;
        //cmt数据重新整合  modify by manson 2013.5.10
        var collection_options =
        {
            ajax_load_finish : function(model, response, ajax_failed)
            {
                /* 判断关系进行私信，
                 if(response.no_relation)
                 {
                 new_alert_v2.show({ text:"你和ta尚未互相关注，无法私信",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){

                 page_control.back()
                 }})

                 return false
                 }
                 */

                cur_page_view.find("[data-message_person]").html(response.nickname)

                message_list_view_obj.more_btn_reset();

                if (response == null)
                    return

                if (response.list == false || response.list.length < page_count)
                {
                    message_list_view_obj.hide_more_btn();
                }
                if (response.list && response.list.length == 0)
                {
                    cur_page_view.find('.tigs-letter').show()
                }
                else
                {
                    cur_page_view.find('.tigs-letter').hide()
                }

            },
            before_refresh : function()
            {
            },
            before_get_more : function()
            {
                message_list_view_obj.more_btn_loading();
            }
        }
        // 列表数据集
        var message_list_collection = Backbone.Collection.extend(
        {
            model : message_list_item_model,
            refresh : function(is_real_data)
            {

                collection_options.data =
                {
                    to_user_id : to_user_id
                };

                if ( typeof (is_real_data) != "undefined")
                {
                    collection_options.data.is_real_data = 1
                }

                common_function.collection_refresh_function.call(this, collection_options);

            },
            get_more_item : function()
            {
                collection_options.data =
                {
                    to_user_id : to_user_id
                };
                common_function.collection_get_more_function.call(this, collection_options);
            },
            url : wo_config.ajax_url.get_message_list,
            parse : function(response)
            {
                if(response.result_data.is_pull_back)
                {
                    cur_page_view.find('[data-pull_back_btn] .filter_text').html("恢复");
                    cur_page_view.find('[data-pull_back_btn]').attr("can_pull_back",0);
                }
                else
                {
                    cur_page_view.find('[data-pull_back_btn] .filter_text').html("拉黑");
                    cur_page_view.find('[data-pull_back_btn]').attr("can_pull_back",1);
                }
                
                if (response && typeof (response.result_data.list) != "undefined")
                {

                    return response.result_data.list
                }
                else
                {
                    return response
                }
            }
        })

        var reply_cmt_id = 0

        //  对方的列表子项视图
        var other_side_item_view = Backbone.View.extend(
        {
            tagName : "tr",
            className : "reply-letter",
            initialize : function()
            {

                var model_data = this.model.toJSON()

                var template = '<td width="35" valign="top" class="message-list-td"><div class="re"><div class="reply-person-pic-wrap" data_to_person></div><div class="person-pic middle-center"><img src="{{user_icon}}" class="max-width-height"></div></div></td><td class="message-list-td"><div class="letter-content dib re radius-2px"><em class="icon"></em><div class="lh16 f12">{{{content}}}</div><p class="time f10 mt5 color999">{{add_time}}</p></div></td><td width="35">&nbsp;</td>'

                this.send_user_id = model_data.send_user_id
                this.user_name = model_data.user_name

                var html = Mustache.to_html(template, model_data)
                $(this.el).html(html);

            },
            events :
            {
                //头像
                "tap [data-user_profile_anchor]" : function(event)
                {
                    page_control.navigate_to_page("user_profile/" + this.user_id)
                },
				//点击头像
		        "tap [data_to_person]" : function()
                {
                  page_control.navigate_to_page("user_profile/"+this.send_user_id);
                }
					
            }
        })

        //  本人的列表子项视图
        var myself_item_view = Backbone.View.extend(
        {
            tagName : "tr",
            className : "send-letter",
            initialize : function()
            {

                var model_data = this.model.toJSON()
				
                var template = '<td width="35" >&nbsp;</td><td align="right" class="message-list-td"><div class="letter-content dib re radius-2px"><em class="icon"></em><div class="lh16 f12">{{{content}}}</div><p class="time f10 mt5 color999">{{add_time}}</p></div></td><td width="35" align="right" valign="top" class="message-list-td"><div class="re"><div class="send-person-pic-wrap" data_to_person></div><div class="person-pic middle-center"><img src="{{user_icon}}" class="max-width-height"></div></div></td>'
                this.send_user_id = model_data.send_user_id
				
                var html = Mustache.to_html(template, model_data)

                $(this.el).html(html);

            },            
			events :
            {
				//点击头像
		        "tap [data_to_person]" : function()
                {
                  page_control.navigate_to_page("user_profile/"+this.send_user_id);
                }
					
            }
        })

        // 列表控制器
        var message_list_view = Backbone.View.extend(
        {
            initialize : function()
            {
                var that = this;
                //加载更多按钮
                var load_more_btn = require("load_more_btn")();
                load_more_btn.$el.css(
                {
                    height : "auto"
                });

                load_more_btn.$el.removeClass("pb15")

                //没有底部时
                $(this.el).parent().append(load_more_btn.$el);
                that.load_more_btn = load_more_btn;
                this.load_more_btn.hide();
            },
            add_list_item : function(item_view)
            {
                $(this.el).append(item_view.$el);
                this.load_more_btn.show();
            },
            clear_list : function()
            {
                $(this.el).html("");
                this.load_more_btn.hide();
            },
            hide_more_btn : function()
            {
                this.load_more_btn.hide();
            },
            more_btn_loading : function()
            {
                this.load_more_btn.loadding();
            },
            more_btn_reset : function()
            {
                this.load_more_btn.reset();
            },
            show_more_btn : function()
            {
                this.load_more_btn.reset();
            }
        });
        options.initialize = function()
        {
            //loading.show_loading();
            this.render();
        };
        options.render = function()
        {
            var template_control = require("get_template")

            var template_obj = template_control.template_obj()

            var init_html = template_obj.message_list

            this.$el.append($(init_html))
        };
        var message_send_tag = false;

        var poco_id;

        var em_list_show_tag = false;

        options.events =
        {
            'swiperight' : function()
            {
                if (!common_function.get_ua().is_uc)
                {
                    page_control.back()
                }
            },
            "tap .ui-btn-prev-wrap" : function(ev)
            {

                page_control.back();
            },
            "tap .data-more_btn" : function()
            {
                if (page_control.page_transit_status())
                    return false
                message_list_collection_obj.get_more_item();
            },
            // 发送评论
            "tap .send-btn" : function(event)
            {

                if (page_control.page_transit_status())
                    return false

                if (can_cmt == 0)
                {
                    return;
                }

                if (poco_id == 0)
                {
                    page_control.navigate_to_page("login");
                    return;
                }
                if (message_send_tag)
                {
                    return;
                }
                message_send_tag = true

                var content = cur_page_view.find("textarea");
                var cur_btn = $(event.currentTarget)

                if (content.val() == "")
                {
                    new_alert_v2.show(
                    {
                        text : "私信内容为空",
                        type : "info",
                        auto_close_time : 2000
                    })

                    message_send_tag = false;
                    return;
                }

                cur_btn.text("发送中...")

                send_message(
                {
                    to_user_id : to_user_id,
                    content : content.val(),
                    success : function(data)
                    {
                        if (data.result == 1)
                        {

                            message_list_collection_obj.refresh(true);
                            //交互操作
                            view_scroll_obj.scroll_to(0);
                            content.val("");

                            window.refresh_message = true;

                        }
                        
						else if (data.result == -2)
                        {
                            new_alert_v2.show(
                            {
                                text : "抱歉！两个用户非互相关注，不能私信",
                                type : "info",
                                auto_close_time : 2000
                            })
                        }
                        else if (data.result == 3)
                        {
                            new_alert_v2.show(
                            {
                                text : data.err_msg,
                                type : "info",
                                auto_close_time : 2000
                            })
                        }
                        else
                        {
                            new_alert_v2.show(
                            {
                                text : data.err_msg,
                                type : "info",
                                auto_close_time : 2000
                            })

                        }

                        reply_cmt_id = 0
                        cur_btn.text("发送");

                        if (to_user_id == 100100)
                        {
                            content.attr("placeholder", "输入你宝贵的意见")
                        }
                        else
                        {
                            content.attr("placeholder", "写私信...")
                        }

                        content.blur();
                        message_send_tag = false
                    },
                    error : function()
                    {

                        message_send_tag = false;
                        cur_btn.text("发送");
                    }
                });

            },
            //表情层
            'tap .select-emotion' : function()
            {
                if (can_cmt == 0)
                {
                    return;
                }

                var emotion_btn_obj = cur_page_view.find('.select-emotion em')

                var is_emotion_open = emotion_btn_obj.hasClass('active_icon')

                if (is_emotion_open)
                {
                    emoticon_layer_control(false)

                }
                else
                {
                    emoticon_layer_control(true)

                }

                if (ua.isIDevice)
                {
                    cur_page_view.find('textarea').blur()
                }
            },
			'tap .gift-emotion' : function()
			{
				send_gift_refresh
				
				page_control.navigate_to_page("send_gift/" + to_user_id , send_gift_refresh )
			},
            'tap [data-pull_back_btn]' : function(ev)
            {                
                
                var cur_btn = $(ev.currentTarget);  
                
                var can_pull_back = parseInt(cur_btn.attr("can_pull_back"));
                
                var str;
                
                var pull_back_tag ;
                
                if(cur_btn.attr("can_pull_back") == 1)
                {
                    str = "确定拉黑该好友？"
                    
                    pull_back_tag = 1
                }        
                else
                {
                    str = "确定恢复该黑名单好友？"
                    
                    pull_back_tag = 0
                }                      
                
                if(confirm(str))
                {
                    if(can_click_pull_btn)
                    {
                        return 
                    }
                    
                    can_click_pull_btn = true; 
                    
                    common_function.send_request(
                    {
                        url : wo_config.ajax_url.pull_back,
                        data :
                        {                        
                            to_user_id : to_user_id,
                            pull_back_tag : pull_back_tag
                        },
                        callback : function(data)
                        {                
                            can_click_pull_btn = false;
                            
                            if(data.code == 1)
                            {                                                               
                                var btn_str = "";
                                
                                if(!data.tag)
                                {
                                    btn_str = "恢复";         
                                    
                                    cur_btn.attr("can_pull_back",0)                                                                        
                                    
                                    page_control.back();                            
                                }
                                else
                                {
                                    btn_str = "拉黑";
                                    
                                    cur_btn.attr("can_pull_back",1)
                                                                        
                                }
                                
                                window.refresh_message = true;
                                
                                cur_btn.find(".filter_text").html(btn_str);
                                                                
                            }
                            else
                            {
                                new_alert_v2.show(
                                {
                                    text : data.txt,
                                    type : "info",
                                    auto_close_time : 1000
                                })
                            }
                                    
                        },
                        error : function()
                        {
                            can_click_pull_btn = false;
                        }
                    });
                   
                }
            }
        }
		
		var send_gift_refresh = false

        options.window_change = function(page_view)
        {
            var cmt_height = window.innerHeight - cur_page_view.find('.top_set').height() - 45 - 10//10是间距
            var list_container = $(page_view.el).find(".message-list-comment");
            list_container.css("height", cmt_height);
        }

		options.page_back_show = function()
		{
			message_list_collection_obj.refresh()
		}

        options.page_show = function(page_view, params_arr)
        {
            // 重置所有回复按钮
            $(page_view.el).find("[data-reply_btn]").attr("selected_cmt", 0);
            _params_arr = params_arr;

            if (can_cmt != 0)
            {
                // 避免文本框聚焦误操作
                $(page_view.el).find("textarea").removeAttr("readonly")
            }

        };
        var view_scroll_obj;
        var message_list_collection_obj;
        var cur_page_view;
        var _params_arr;
        var message_list_view_obj;
        var _state;
        var refresh_btn;
        var _selection_pos = 0
        var emoticon_module_obj
        var poco_id
        //页面初始化时
        options.page_init = function(page_view, params_arr, state)
        {
            poco_id = common_function.get_local_poco_id()

            //未登录处理
            if (poco_id <= 0)
            {
                new_alert_v2.show(
                {
                    text : "尚未登录",
                    type : "info",
                    is_fade : false,
                    is_cover : true,
                    auto_close_time : 1000,
                    closed_callback : function()
                    {

                        page_control.back()
                    }
                })

                return false
            }

            cur_page_view = $(page_view.el);
            _params_arr = params_arr;
            _state = state;
			
			/*
            //刷新按钮  add by manson 2013.5.7
			
            refresh_btn = require("refresh_btn")();
            page_view.$el.find(".header").append(refresh_btn.$el)

            */
            to_user_id = params_arr[0];

            //评论内容滚动
            var view_scroll = require("scroll")
            var list_container = $(page_view.el).find(".message-list-comment")
            var cmt_height = window.innerHeight - cur_page_view.find('.top_set').height() - 45 - 10//20是间距

            view_scroll_obj = view_scroll.new_scroll(list_container,
            {
                view_height : cmt_height
            })

            //表情模块
            emoticon_module_obj = new emoticon_module(
            {
                click_icon_callback : function(emoticon_str)
                {
                    var textarea = cur_page_view.find("textarea");

                    var val = textarea.val();

                    val += emoticon_str

                    textarea.val(val)
                }
            })

            cur_page_view.find(".top_set").after(emoticon_module_obj.$el)

            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)

            message_list_view_obj = new message_list_view(
            {
                el : $(page_view.el).find(".person-letter-send-item table")
            });
            // 初始化数据集
            message_list_collection_obj = new message_list_collection();
            //刷新列表监听
            message_list_collection_obj.bind("reset", re_render_list, page_view);
            //加载更多监听
            message_list_collection_obj.bind("add", add_render_list, page_view);
            message_list_collection_obj.refresh()

            notice.update_unread_status_by_type("message")

            notice.footer_notice_ui_refresh()

            if (_state && _state.state_tag == "from_message")
            {
                notice.update_unread_status_by_type("message", _state.unread_count)

                _state.unread_count = 0;
            }

            if (to_user_id == 100100)
            {
                cur_page_view.find("textarea").attr("placeholder", "输入你宝贵的意见")
				cur_page_view.find(".gift-emotion").hide()
				cur_page_view.find("[data-pull_back_btn]").hide();
				
            }

        }


        function re_render_list()
        {

            if (message_list_collection_obj.models[0] && message_list_collection_obj.models[0].attributes.relation_id == false)
            {
                new_alert_v2.show(
                {
                    text : "作品不存在或已被原作者删除",
                    type : "info",
                    is_fade : false,
                    is_cover : true,
                    auto_close_time : 2000,
                    closed_callback : function()
                    {

                        page_control.back()
                    }
                })

                return false
            }

            var that = this;
            message_list_view_obj.clear_list();
            message_list_collection_obj.each(function(item_model)
            {
                if (item_model.attributes.send_user_id == poco_id)
                {
                    // 本人

                    var item_view = new myself_item_view(
                    {
                        model : item_model
                    });
                    //每次add入列表
                    message_list_view_obj.add_list_item(item_view);
                }
                else
                {
                    // 对方

                    var item_view = new other_side_item_view(
                    {
                        model : item_model
                    });
                    //每次add入列表
                    message_list_view_obj.add_list_item(item_view);
                }

            });

            emoticon_layer_control(false)

            //滚回顶部
            view_scroll_obj.scroll_to(0)
        }

        function add_render_list(item_model)
        {
            var item_view = new myself_item_view(
            {
                model : item_model
            });
            //每次add入列表
            message_list_view_obj.add_list_item(item_view);
        }

        function send_message(options)
        {
            var to_user_id = options.to_user_id, content = options.content, success = options.success ||
            function()
            {
            }, error = options.error ||
            function()
            {
            };

            common_function.send_request(
            {
                url : wo_config.ajax_url.add_message,
                data :
                {
                    send_user_id : poco_id,
                    to_user_id : to_user_id,
                    content : content
                },
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

        function emoticon_layer_control(show)
        {
            var emotion_btn_obj = cur_page_view.find('.select-emotion em')

            if (show)
            {
                emoticon_module_obj.show()

                cur_page_view.find('.message-list-comment').hide()

                emotion_btn_obj.removeClass('icon').addClass('active_icon')
            }
            else
            {
                emoticon_module_obj.hide()
                cur_page_view.find('.message-list-comment').show()

                emotion_btn_obj.removeClass('active_icon').addClass('icon')
            }
        }

        var page = require("page").new_page(options);
        return page;
    }
})

if(typeof(process_add)=="function")
{
	process_add()
}