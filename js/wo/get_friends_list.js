define("wo/get_friends_list", ["base_package", 'frame_package', "btn_package", "commom_function", "wo_config", "get_template", "footer_view", "new_alert_v2"], function(require, exports)
{
    var $ = require('zepto')
    var page_control = require('page_control')
    var Backbone = require('backbone')
    var common_function = require('commom_function')
    var wo_config = require('wo_config')
    var Mustache = require('mustache')
    var new_alert_v2 = require("new_alert_v2")
    //var pinyin_lib = require("pinyin_lib")
    
    exports.route =
    {
        "get_friends_list(/:from_tag)" : "get_friends_list"
    }

    exports.new_page_entity = function()
    {
        var view_scroll_obj

        var _page_view
        
        var sit
        
        var key_down_tag = false;

        var options =
        {
            route :
            {
                "get_friends_list(/:from_tag)" : "get_friends_list"
            },
            transition_type : 'fade'
        }

        options.initialize = function()
        {
            this.render();
        }

        options.render = function()
        {
            var that = this
            var init_html = '<div class="friend-list-page"><header class="header"><h3 class="tc">好友列表</h3></header><div class="main_wraper pb10" style="padding-top:45px;"><div class="friend-list" style="position:relative;"><div class="search-item"><div class="search-box radius-2px"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><input type="text" data_search_input class="input-class" placeholder="查找好友" style="width: 100%;"/></td><td data_to_search style="padding-left:15px" width="19"><span class="icon-search icon-bg-common"></span></td></tr></tbody></table></div></div><div class="has_data" style="border-top:1px solid #c3c3c3;"><div class="re" id="container"><div data-list_container><div><div class="list-comment-item" data-for_words_list></div><div class="list-comment-item" data-for_other_list style="display:none"><div class="group_title_container"><div class="group_title lh20 f12 color000 fb">其他</div></div><div data-for_other_list_container></div></div><div class="load_more_btn_wraper ml10 mr10"></div></div></div><div class="middle_container font_wryh" style="display: none;width: 100%;"><div style="" class="no_data_txt w-100 h-100 f14 tc color666 dtc vam">你还没有好友哦。</div></div></div></div></div></div></div>'

            that.$el.append($(init_html))
        }

        var page_count = 20
        var can_click = false
        

        //朋友列表视图
        var get_friends_list_view = Backbone.View.extend(
        {
            tagName : "div",
            className : "border-btm",
            initialize : function(json_data)
            {
                this.render();                                

            },
            events :
            {
                'click .border-btm' : function()
                {
					if (!can_click) return false                                                                                                                                           
                    
                    test_arr.splice(0,0,{user_id:this.user_id,nickname : this.nickname})                                                                                                                     
                    
                    test_arr = unique(test_arr)                                                                                                                                      
                                                                                                                                                                                                               
                    if(test_arr.length>5)
                    {
                        test_arr.pop();   
                    }                                                                             
                    
                    var json_str = JSON.stringify(test_arr)
                    
                    window.localStorage.setItem("recent_contacts_arr",json_str)                                                                                                                                                
                    
                    switch(type)
                    {
                        case "at":

							console.log(_state)

                            if (_state && _state.textarea)
                            {
                                _state.at_params(this.user_id, this.nickname, this.params.at_name)                                                               

                                page_control.back();
                            }
                            break;
                        case "message":

                            page_control.navigate_to_page("message_list/" + this.user_id,
                            {
                                message_user_name : this.nickname
                            })

                            break;
                    }
                                        

                }
            },
            render : function()
            {
                var json_data = this.model                

                this.user_id = json_data.user_id
                
                this.nickname = json_data.nickname
                
                this.sort_key = json_data.first_key
                
                json_data.user_icon = 'http://myicon211-c.poco.cn/'+this.get_icon_filename(json_data.user_id,64)                
                
                this.params =
                {
                    user_id : this.user_id,
                    at_name : "@" + this.nickname + " "
                }

                var template = '<table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td valign="top" width="42" td_1><div class="user-img"><img data-user_icon lazyload_src="{{user_icon}}" class="img_buffer_bg"></div></td><td td_2><div class="user-info"><p class="txt"><span class="name color000">{{nickname}}</span></p></div></td></tr></tbody></table>'

                var html = Mustache.to_html(template, json_data)

                $(this.el).html(html)
                
                if(!common_function.is_empty(this.sort_key))
                {
                    $(this.el).attr("data-sort_key",this.sort_key.toLowerCase())    
                }
                
                

            },
            get_icon_filename : function (user_id,size)
            {
                var dir = parseInt(user_id / 10000);
                
                if (size)
                {
                    var path = dir + '/' + user_id + '_' + size + '.jpg'
                }
                else
                {
                    var path = dir + '/' + user_id + '.jpg'
                }
                return path;
            }                       

        })
        
        var group_title_view = Backbone.View.extend
        ({
            tagName : "div",
            className : "group_title_container",
            initialize : function()
            {
                this.render();
            },
            render: function()
            {
                var that = this;                
                
                that.key = this.model
                
                that.sort_key = that.key.toLowerCase();
                
                var html = '<div data class="group_title lh20 f12 color000 fb">'+that.key+'</div>'               

                $(this.el).html(html)
            }           
        
        })

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
            'tap .ui-btn-refresh-wrap' : function()
            {
                //get_friends_list_collection_obj.refresh()
                
                show_recent_contacts_tag = false;
                
                var recent_arr = window.localStorage.getItem("recent_contacts_arr");
                
                if(!common_function.is_empty(recent_arr))
                {
                    recent_contacts_user = JSON.parse(window.localStorage.getItem("recent_contacts_arr"));   
                }                                
                
                get_griends_list()
            },
            'change [data_search_input]' : function()
            {
                
            },
            //加载更多处理
            'tap .data-more_btn' : function()
            {
                if (page_control.page_transit_status())
                    return false

                get_friends_list_collection_obj.get_more_item()
            },
            'tap [data_to_search]' : function()
            {
                //keyword = _page_view.find('[data_search_input]').val()
                //get_friends_list_collection_obj.refresh()
            },
            'tap .middle_container' : function()
            {
                page_control.navigate_to_page("recommend");
            }
        }

        options.window_change = function(page_view)
        {
            view_height = window.innerHeight - wo_config.header_height - 60;
            // 60 为搜索框的高度

            $(page_view.el).find('[data-list_container]').height(view_height)

            $(page_view.el).find('.middle_container').height(view_height)
        }
		

        options.page_before_show = function(page_view, params_arr, state)
        {
            
            
            if(!window.localStorage.getItem("recent_contacts_arr"))
            {
                test_arr = []
            }
            else
            {
                test_arr = JSON.parse(window.localStorage.getItem("recent_contacts_arr")) 
            }
            
			view_height = window.innerHeight - wo_config.header_height - 60;
            // 60 为搜索框的高度

            $(page_view.el).find('[data-list_container]').height(view_height)

            $(page_view.el).find('.middle_container').height(view_height)


            _state = state
			
            
            sit = setInterval(function()
            {
                keyword = _page_view.find('[data_search_input]').val()                               
                
                search_friends_action()
                
                
            },700)      
				

			setTimeout(function()
            {
                can_click = true
            },1000)
            
            // 获取最近联系人数据
            var local_storage = window.localStorage; 
            
            if(!common_function.is_empty(local_storage.getItem("recent_contacts_arr")))
            {
               recent_contacts_user = JSON.parse(local_storage.getItem("recent_contacts_arr"));  
            }                                              
            
            
        }
        
        options.page_hide = function()
        {
			can_click = false

			_page_view.find('[data_search_input]').blur()

            clearInterval(sit)
        }
        //页面显示时
        var _params_arr
        var alert_tips
        var view_height
        var refresh_btn
        var get_friends_list_collection_obj
        var keyword = ""
        var load_more_btn
        var type = "at";
        var _state
        var friends_data 
        var orgin_friends_data
        var pinyin_obj
        var last_keyword = ""
		var pinyin_lib
		var recent_contacts_user = [];
		var show_recent_contacts_tag = false;
		var test_arr 
		
		
            
        //页面初始化时
        options.page_init = function(page_view, params_arr, state)
        {
            
            var that = this;

            _page_view = $(page_view.el)
            _params_arr = params_arr
            _state = state
                        

            if (_params_arr[0] == "from_at")
            {
                type = "at";
            }
            else
            {
                type = "message";
            }

            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)

            //刷新按钮
            refresh_btn = require('refresh_btn')()
            page_view.$el.find('.header').append(refresh_btn.$el)

            //加载更多按钮
            load_more_btn = require('load_more_btn')()
            page_view.$el.find('.load_more_btn_wraper').append(load_more_btn.$el)

            //容器滚动
            var main_wraper = $(page_view.el).find('[data-list_container]')

            view_height = window.innerHeight - wo_config.header_height - 60;
            // 60 为搜索框的高度

            var view_scroll = require('scroll')
            view_scroll_obj = view_scroll.new_scroll(main_wraper,
            {
                'view_height' : view_height,
                use_lazyload : true,
				scroll_start : function()
				{
					_page_view.find('[data_search_input]').blur()
				}
            })

            $(page_view.el).find('.middle_container').height(view_height)            
            
			
			alert_tips = new_alert_v2.show(
            {
                text : "获取中",
                type : "loading",
                append_target : _page_view.$el,
                is_cover : false,
                auto_close_time : false
            })

			require.async("pinyin_lib", function(data) 
            {                                
                
                if(data == null)
                {
                    new_alert_v2.show({ text:"加载失败",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
					   page_control.back()
				    }})
                    
                    return false;
                }   
                

                pinyin_lib = data
                
                // 初始化好友列表数据集
				get_griends_list()
            })
        }
        
        function get_griends_list()
        {
            before_get_data()
            
            common_function.send_request
            ({
                url : wo_config.ajax_url.get_friends_list,
                callback : function(data)
                {
                    // 加载结束函数
                    load_finish()
                    
                    // 原始数据
                    orgin_friends_data = data.result_data;
                    
                    if(orgin_friends_data.length == 0)
                    {
                        return;
                    }                    
                    
                    // 搜索拼音对象
                    pinyin_obj = pinyin_lib
                    ({
                        init_arr : orgin_friends_data
                    })                    
                    
                    // 根据拼音转换的数据
                    friends_data = pinyin_obj.sort_arr("pinyin")                                    
                                        
                    
                    // 渲染列表
                    render_friends_list(friends_data);                                       
 
                },
                error : function()
                {
                    alert_tips.close();
                }
            })
        }
        
        // 请求数据前
        function before_get_data()
        {
            
            refresh_btn.loadding()
        }
        
        // 加载结束
        function load_finish()
        {            
            //clearInterval(sit)
                
            setTimeout(function()
            {
                alert_tips.close()
            }, 300)

            load_more_btn.reset()

            refresh_btn.reset()
            
            //_page_view.find('[data_search_input]').focus()
        }
        
        function render_friends_list(data)
        {
            _page_view.find('[data-for_words_list]').html('')
            
            _page_view.find('[data-for_other_list_container]').html('')
            
            if(data.length == 0)
            {
                _page_view.find('[data-for_other_list]').hide();
            }
            
            $(data).each(function(i,item_model)
            {
                
                // 设置最近联系人
                if(recent_contacts_user.length>0)
                {                
                    
                    if(!show_recent_contacts_tag )
                    {
                        var group_title_for_recent_view_obj = new group_title_view
                        ({
                            model : "最近联系人"
                        })                                            
            
                        _page_view.find('[data-for_words_list]').prepend(group_title_for_recent_view_obj.$el)
                        
                        $(recent_contacts_user).each(function(i,obj)
                        {
                            var get_friends_list_view_obj = new get_friends_list_view(
                            {
                                model : obj,
                                tag : "recent_contacts_tag"
                            })
                            
                            _page_view.find('[data-for_words_list]').append(get_friends_list_view_obj.$el)
                        })
                        
                        
                        
                        show_recent_contacts_tag = true;
                    }
                    
                        
                }
                
                // 渲染标题
                if(item_model.title_key)
                {
                    var group_title_view_obj = new group_title_view
                    ({
                        model : item_model.title_key
                    })                                            

                    _page_view.find('[data-for_words_list]').append(group_title_view_obj.$el)
                }
                else // 渲染用户列表
                {
                    var get_friends_list_view_obj = new get_friends_list_view(
                    {
                        model : item_model
                    })
                    
                    _page_view.find('[data-for_words_list]').append(get_friends_list_view_obj.$el)
                }
                
                
            })
            
                                 
            
            

            view_scroll_obj.scroll_to(0)
            
            load_finish()
            

        }
        
        function search_friends_action()
        {
            keyword = _page_view.find('[data_search_input]').val()

			keyword = $.trim(keyword)			

			if(last_keyword == keyword)
            {
                return;
            }
                
            last_keyword = keyword
            
			if(keyword=="")
			{
			    show_recent_contacts_tag = false;
			    
				render_friends_list(friends_data)										
			}
			else
			{
				var arr = pinyin_obj.filter_arr_func(keyword)
			
				render_friends_list(arr)
										
			}
			
			console.log(keyword)
			
        }
        
        
        function unique(arr)
        {
            //var a1=((new Date).getTime())
            for (var i = 0; i < arr.length; i++)
                for (var j = i + 1; j < arr.length; j++)
                    if (arr[i].user_id === arr[j].user_id)
                    {
                        arr.splice(j, 1);
                        j--;
                    }
            //console.info((new Date).getTime()-a1)
            return arr.sort(function(a, b)
            {
                return a - b
            });
        }

        
        

        var page = require('page').new_page(options)

        return page
    }
})

if(typeof(process_add)=="function")
{
	process_add()
}