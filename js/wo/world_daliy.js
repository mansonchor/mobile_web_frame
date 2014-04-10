define("wo/world_daliy", ["base_package", 'frame_package', "btn_package", "wo_config", "commom_function", "get_template", "footer_view", "notice", "new_alert_v2","slider","app_function","interact_module"], function(require, exports)
{
    var $ = require('zepto')
    var wo_config = require('wo_config')
    var page_control = require('page_control')
    var Backbone = require('backbone')
    var common_function = require('commom_function')
    var Mustache = require('mustache')
    var notice = require('notice')
    var cookies = require('cookies')
    var slider = require('slider');
    var app_function = require('app_function')
    var interact_module_view = require('interact_module')

    var new_alert_v2 = require("new_alert_v2")

    exports.route =
    {
        "world_daliy/:world_daliy_id(/:page)(/:preview)" : "world_daliy"
    }

    exports.new_page_entity = function()
    {
        var alert_tips
        var newspaper_id
        var newspaper_title = ''
        var newspaper_des = ''
        
        var options =
        {
            route :
            {
                "world_daliy/:world_daliy_id(/:page)(/:preview)" : "world_daliy"
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
            
            var share_btn = ''
            var world_daliy_no_share_footer = ''
            
            if( app_function.is_world_app() || app_function.is_poco_app())            
            {
                share_btn = '<li data-to_share><em class="share_icon icon icon-bg-common vam"></em><span style="margin-left:12px">分享</span></li>'
                                
            }
            else 
            {
                share_btn = ''
                
                world_daliy_no_share_footer = 'world_daliy_no_share_footer'
            }             
            
                     

            var init_html = '<div class="world-daliy-page_tips" style="display:none"><table cellspacing="0" cellpadding="0" border="0" class="w-100 h-100 colorfff"><tr><td align="center" valign="middle"><div class="txt font_wryh f14 colorfff mb20">侧滑可以查看更多照片哦</div><div style="width:157px;height:92px"><img src="http://m.poco.cn/mobile/images/guide-pic-314x184.png" class="max-width-height"></div></td></tr></table></div><div class="wraper_con world-daliy-page" style="position:relative;"><div><div class="fade-img w-100"></div><div class="top_btn_container"><div class="back_btn fl dib "><div class="back_icon icon icon-bg-common"></div></div><div class="num fr dib font-arial"><span data-cur_page>0</span>/<span data-total_page>0</span></div></div><div class="wraper_padding" data-mid_pics_container><div class="main_wraper font_wryh color000"><div class="slide_show"><div data-slide_show_container class="swipe" style="width: 100%;display:none"><div class="swipe-wrap h-100" ></div></div></div></div></div><div class="fade-img-btm w-100"></div><div class="user_des_container" style=""><div class="slide_show_des pl10 pr10"><table cellspacing="0" cellpadding="0" border="0" class="w-100 f12 colorfff"><tr><td width="43" valign="top" data-user_icon_td><div class="user_icon middle-center" style="width: 32px;height: 32px;background: rgba(149,149,149,0.1);"><img data-slide_user_icon class="max-width-height" src=""></div></td><td valign="top"><div class="user_des"><div><div data-user_des class="content_txt"></div></div></div></td></tr></table></div></div><div data-btn_container><div class="comment-love-mod footer-dating '+world_daliy_no_share_footer+'" data-bottom_btn><ul class="clearfix f10"><li data-to_guest><em class="guest_icon icon icon-bg-common vam"></em><span style="margin-left:12px">嘉宾</span></li><li data-to_world_daliy_cmt><em class="cmt_icon icon icon-bg-common vam"></em><span style="margin-left:12px">评论</span></li>'+share_btn+'</ul></div></div></div></div><div class="guest_page" style="display:none"><header class="header re tc font_wryh"><div class="ui-btn-header ui-btn-prev radius-2px" style="display:inline-block;position: absolute;left:11px"><span class="icon icon-arrow icon-bg-common"></span></div>本期的嘉宾</header><div class="wraper_padding main_container"><div style="padding-top: 54px;padding-bottom:10px" class="main_wraper font_wryh color000"><div data-guest_list class="pl10 pr10"></div></div></div><div data-guest_footer><div class="comment-love-mod footer-dating "><ul class="clearfix f10"><li data-to_send_article style="width:100%;color:#fff"><em class="send_article_icon icon icon-bg-common vam"></em><span style="margin-left:12px">立即投稿，成为日报的邀请嘉宾。</span></li></ul></div></div></div>'

            that.$el.append($(init_html))
        }

        options.events =
        {
            'tap .back_btn' : function(ev)
            {
                page_control.back()
            },
            'tap .ui-btn-prev' : function(ev)
            {
                _page_view.$el.find('.guest_page').hide();
                _page_view.$el.find('.world-daliy-page').show();
            },
            'swiperight' : function()
            {
                if (!common_function.get_ua().is_uc)
                {
                    control_tips_show(false);
                
                    window.localStorage.setItem('world_daliy_tips',1)
                }
            },
            'swipeleft' : function()
            {
                if (!common_function.get_ua().is_uc)
                {
                    control_tips_show(false);
                
                    window.localStorage.setItem('world_daliy_tips',1)
                }
            },
            'tap [data-to_guest]' : function()
            {
                _page_view.$el.find('.guest_page').show();
                _page_view.$el.find('.world-daliy-page').hide();
            },
            'tap [data-to_world_daliy_cmt]' : function()
            {
				page_control.navigate_to_page("cmt/"+newspaper_id+"/from_world_daliy")
            },
            'tap [data-to_share]' : function()
            {                
                interact_module_view_obj.show()
            }, 
            'tap [data-to_send_article]' : function()
            {
                page_control.navigate_to_page("theme_act")
            },
            'tap .world-daliy-page_tips' : function()
            {
                control_tips_show(false);
                
                window.localStorage.setItem('world_daliy_tips',1)
            },
			'tap [data-silde_show_idx]' : function(event)
			{

				var tap_x = event.gesture.center.pageX	
				var tap_y = event.gesture.center.pageY  							
				
				var window_half_width = window.innerWidth/2
				
				var idx = slide_show_obj.getPos()
                var total = slide_show_obj.getNumSlides()
                
                var cur_slider_container = _page_view.$el.find('[data-silde_show_idx]').eq(idx);
                
                if(cur_slider_container.attr('data-can_not_slide_tag') == 1)
                {
                    return;
                } 
                
                /*
                var cur_slider_container = _page_view.$el.find('[data-silde_show_idx]')                                                        
                
                var can_not_tap_obj = cur_slider_container.eq(-1).find('[data-can_not_slide_tap]')[0];
                
                var start_x = can_not_tap_obj.getBoundingClientRect().left
                
                var end_x = can_not_tap_obj.getBoundingClientRect().right
                
                var start_y = can_not_tap_obj.getBoundingClientRect().top
                
                var end_y = can_not_tap_obj.getBoundingClientRect().bottom                
                
                if((tap_x>=start_x&&tap_x<=end_x)&&(tap_y>=start_y&&tap_y<=end_y))
                {
                    return
                }
                */
                                
				if(tap_x >= window_half_width)
				{          
					if(idx == total-1)
					{						
						return
					}  

					slide_show_obj.next()
				}
				else
				{
					if(idx == 0)
					{	
						return
					}  

					slide_show_obj.prev();
				}
 
			},
			'tap [data-can_not_slide_tap]' : function(event)
            {                                         
                page_control.navigate_to_page("cmt/"+10+"/from_world_daliy")
            }            
            
        }
        options.window_change = function(page_view)
        {            
            var w_width = window.innerWidth
            
            var w_height = window.innerHeight
            
            $(page_view.el).find('[data-slide_td]').height(w_height-45)                                                     
           
            $(page_view.el).find('.wraper_con').height(w_height-45)  
            
            $(page_view.el).find('[data-mid_pics_container]').height(w_height-45)
            
            $(page_view.el).find('.main_container').height(common_function.container_height_with_head()-45)           
                
            $(_page_view.el).find('.world-daliy-page_tips').css({'width':w_width+"px",'height':w_height+"px"})
        }
        
        
        var view_scroll_obj
        var _page_view
        var slide_show_obj
        var slide_img_view_obj

        var world_daliy_id = 0;
        var direction_name = ""
        var interact_module_view_obj       
        var slide_show_container 
        var des_view_scroll_obj
        
        //页面初始化时
        options.page_init = function(page_view, params_arr)
        {
            _page_view = page_view            
            
            world_daliy_id = params_arr[0]                       
            
            slide_show_container = $(_page_view.el).find('[data-slide_show_container]')
            
            var view_scroll = require('scroll')
            
            //容器滚动
            var wraper_con = $(page_view.el).find('.wraper_con')                                   
           
            wraper_con.height(window.innerHeight-45)  
            
            $(page_view.el).find('[data-mid_pics_container]').height(window.innerHeight-45)  
            
            //嘉宾页面
            var guest_view_scroll_obj = view_scroll.new_scroll($(page_view.el).find('.main_container') ,
            {
                'view_height' : common_function.container_height_with_head()-45
            })                        
            
            //显示第一次提示
            var tips_value = window.localStorage.getItem('world_daliy_tips');
            
            if(!tips_value||tips_value==0)
            {
                control_tips_show(true);                                
            }
            else
            {
                control_tips_show(false);
            }
            
            
            // 判断内嵌是否出现分享按钮
            if( app_function.is_world_app())
            {                
                var share_weixin_btn_show = true
            }
            else if(app_function.is_poco_app())
            {                
                var share_weixin_btn_show = true                
            }
            else
            {
                var share_weixin_btn_show = false                
            } 
            
            // 多功能模块组件                        
            interact_module_view_obj = new interact_module_view
            ({
                just_show_lv2_layout : true,
                share_btn_obj : 
                {                    
                    show : true,
                    //count : 4, 每行显示的个数，默认是4个
                    show_share_btn_list : 
                    {
                        sina : true,
                        qqweibo : true,
                        qqzone : true,
                        weixin : share_weixin_btn_show
                    },
                    click_btn_callback : function()
                    {
                        
                    },
                    share_btn_list_click_callback : function(share_type)
                    {
                        var cur_img_obj = $(page_view.el).find('[data-silde_show_idx]').eq(0).find('.target_img');                        
                        
                        var shareImg = cur_img_obj.attr('src').replace('-c','')

                        if(share_type=='weixin')
                        {
                            shareImg = common_function.matching_img_size(shareImg,'ms')
                        }
                        else
                        {
                            shareImg = common_function.matching_img_size(shareImg,'mb')
                        }                                                                        
                        
                        var shareTxt = newspaper_title + " " + newspaper_des;
                        var shareUrl = "http://wo.poco.cn/world_share.php?share_page=world_daliy&daliy_id="+ newspaper_id                        

                        if( app_function.can_app_share() )
                        {
                            app_function.app_share(share_type,shareImg,shareTxt,shareUrl)
                        }
                        else
                        {                      
                            this.share_img(share_type,shareImg,shareTxt,shareUrl)
                        }
                    }
                }
            })
            
            wraper_con.parent().append(interact_module_view_obj.$el)
                        
            
            refresh_slide_data(function(total)
            {
                var slider_count = $(page_view.el).find('[data_can_slide_item]').length;  
                
                var total = total;                                                        
                
                $(_page_view.el).find('[data-total_page]').html(slider_count)                   
                
                setTimeout(function()
                {
                	var start_idx = 1;
                	
                	if(params_arr[1])
                    {                        
                       start_idx = params_arr[1]                                          
                    }
                    else
                    {                                             
                       start_idx = 1             
                    }
                           
                    
                    //_page_view.$el.find('.swipe-wrap').css('visibility','visible');                                                                                                                             
                	
                    slide_show_obj = new slider(_page_view.$el.find('[data-slide_show_container]')[0], 
                    {                           
                        speed: 400,
                        startSlide : parseInt(start_idx)-1,
                        auto: 0,
                        //scale_rate : setup_slider_height(),
                        continuous: true,
                        disableScroll: false,
                        stopPropagation: false,
                        init : function(index, elm)
                        {                            
                            
                            var index = index;
                            
                            var use_set_num = true;
                            
                            // 导航直接打开指定页数
                            if(start_idx)
			                {
			                    index = start_idx
			                    
			                    use_set_num = false
			                    
			                    set_num(parseInt(start_idx),parseInt(total))			                    
			                    
			                    show_slide_img(parseInt(start_idx)-1,parseInt(total),"",use_set_num)   
			                    			                    
			                }
			                else
			                {
			                    show_slide_img(index,parseInt(total)+1,"",use_set_num)    
			                }           
			                			                               			                
			                if(start_idx == 1)
                            {
                                $(elm).parent().find('[data-silde_show_idx]').eq(-1).css('visibility','hidden')
                                
                            }
                            else if(start_idx == parseInt(total)+1)
                            {
                                $(elm).parent().find('[data-silde_show_idx]').eq(0).css('visibility','hidden')
                            }                                                        
                                                        
                            //描述滚动                
                            var user_des = $(page_view.el).find('.user_des');                            
                            
                            des_view_scroll_obj = view_scroll.new_scroll(user_des,
                            {
                                'view_height' : 50
                            })
                            
                            $(page_view.el).find('.user_des_container').show();
                            
                        },
                        callback : function(index, elm)
                        {
                            var first_slide = $(elm).parent().find('[data-silde_show_idx]').eq(0)
                            var last_slide  = $(elm).parent().find('[data-silde_show_idx]').eq(-1)                            
                            
                            if(total == 2)
                            {
                                switch(index)
                                {
                                    case 0:
                                        first_slide.css('visibility','visible')
                                        last_slide.css('visibility','hidden')    
                                        break;
                                    case 1:
                                        first_slide.css('visibility','visible')
                                        last_slide.css('visibility','visible')
                                        break;
                                    case 2:
                                        first_slide.css('visibility','hidden')
                                        last_slide.css('visibility','visible')
                                        break;
                                }

                            }
                            else if(total >2)  
                            {
                                
                                if(index >= total-2)
                                {
                                    first_slide.css('visibility','hidden')
                                    last_slide.css('visibility','visible')
                                }
                                else if(index <= 2)
                                {
                                    first_slide.css('visibility','visible')
                                    last_slide.css('visibility','hidden')
                                }   
                            }                                                        
                            
                            
                        },
                        transitionEnd : function(index)
                        {                    
                            var cur_slider_container = _page_view.$el.find('[data-silde_show_idx]')
                            
                            var num_container = _page_view.$el.find('.num')                              
                
                            if(!cur_slider_container.eq(index).attr('data-can_not_slide_tag')==1)
                            {                                                                                   
                                set_num(parseInt(index)+1)    
                                
                                num_container.show()
                            }
                            else
                            {
                                num_container.hide()
                            }                                                                                                              
                                   
                            show_slide_img(index,total,"",false)                                                                                                                														
							
							des_view_scroll_obj.scroll_to(0)
														
                        },
                        moving : function(index,direction)
                        {   
                            direction_name = direction
                            
                            console.log("index:"+index)
                            console.log("total:"+total)                     
                                                                                                                                    
                            if(direction == 'left')
                            {                                                                                                
                                if(index == total)
                                {    
                                	// 禁止拉到左边尽头
                                    slide_show_obj.slide(0,0)                                       
                                    return;
                                }                                                                    
                            }
                            else
                            {   
                                if(index == 0)
                                {   
                                	// 禁止拉到右边尽头
                                    slide_show_obj.slide(total,0)                           
                                    return;
                                }                                                                   
                            }                                                          
                            
                        }
                    })                                      
    
                },100)     
            })

        }
        
        var slide_img_view = Backbone.View.extend
        ({
            initialize : function(options)
            {                                                                
                var that = this;                                                
                
                that.data = this.model
                
                that.data.idx = options.idx
                
                console.log(that.data.user_info.user_icon)
                
                that.data.user_icon = that.data.user_info.user_icon;
                
                that.data.user_id = that.data.user_info.user_id;
                
                if(that.data.user_info.nickname)
                {
                    that.data.nickname = that.data.user_info.nickname;    
                }                                        
                
                that.render()
            },
            render : function()
            {
                var that = this;          
                
                var td_height = window.innerHeight-45                         
                
                var template = '<div data_can_slide_item data-silde_show_idx="{{idx}}" class="slide_show_child_node" data-header_icon_url="{{user_icon}}" data-slide_user_id="{{user_id}}" data-user_nickname="{{nickname}}" data-user_des_content="{{content}}"><div class="slide_show_img"><table border="0" cellspacing="0" cellpadding="0" class="img-box-table w-100 h-100"><tbody><tr><td valign="middle" align="center" style="height:'+td_height+'px" data-slide_td><div class="loading_container"><div class="tb"><div class="icon-bg-common loading"></div></div></div><img class="target_img" data-ori_src="{{img_url}}"></td></tr></tbody></table></div></div>'
                
                var html = Mustache.to_html(template, that.data)
                
                $(this.el).html(html) 
                
                //描述滚动
                
                var user_des = $(this.el).find('.user_des');                

            }
        })
        
        var other_slider_view = Backbone.View.extend
        ({
            initialize : function(options)
            {
                var that = this;
                
                that.data = this.model || {}
                
                that.data.idx = options.idx
                
                that.render();
            },
            render : function()
            {
                var that = this;
                
                var td_height = window.innerHeight
                
                var template = '<div data-can_not_slide_tag="1" data-silde_show_idx="{{idx}}" class="slide_show_child_node" data-header_icon_url="{{user_icon}}" data-slide_user_id="{{user_id}}" data-user_nickname="{{nickname}}" data-user_des_content="{{content}}"><div class="slide_show_img"><table border="0" cellspacing="0" cellpadding="0" class="img-box-table w-100 h-100"><tbody><tr><td valign="middle" align="center" style="height:'+td_height+'px" data-slide_td><div class="loading_container"><div class="tb"><div class="icon-bg-common loading"></div></div></div><div style="position:relative;z-index:1003"><div class="world-news m10"><ul class="world-news-list bdb-line mb10 bgcfff"><li data-can_not_slide_tap="1" class="li-world-list pl10 pt10 pr10" data-test_link><div class="bdb-line-e6e pb10"><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tbody><tr><td width="75"><div class="img-box re"><img src="http://image15-c.poco.cn/mypoco/qing/20140228/16/16399676756571488101_120x120_320_170.jpg" class="img_buffer_bg w-100"><div class="fade colorfff w-100 tc f10"><p>03月01日</p></div></div></td><td><div class="f14 color333" style="font-size:16px">史上最萌植物，我来拉！</div></td></tr></tbody></table></div></li></div></div></td></tr></tbody></table></div></div>'
                
                var html = Mustache.to_html(template, that.data)
                
                $(this.el).html(html) 
            },
            events : 
            {
                
            }
        })
        
        var guest_view = Backbone.View.extend
        ({
            className : 'guest_view',
            initialize : function(options)
            {                                                                
                var that = this;                                                
                
                that.data = this.model  
                
                this.sex = that.data.sex;  
                
                that.user_id = that.data.user_id;            
                
                that.render()
            },
            render : function()
            {
                var that = this;                                                           
                
                var template = '<div class="art-user-info"><table border="0" cellspacing="0" cellpadding="0" class="w-100"><tbody><tr><td width="42"><div class="user-pic middle-center"><img class="max-width-height" src="{{user_icon}}"></div></td><td><h4 class="clearfix f12 lh14"><span class="color333 fl">{{nickname}}</span><i class="sex_icon fl icon-bg-common"></i></h4><span class="f12 font-arial color999">{{publish_count}}张照片</span></td></tr></tbody></table></div>'
                
                var html = Mustache.to_html(template, that.data)
                
                $(this.el).html(html)                 
              
                if (this.sex == "男")
                {
                    $(this.el).find('.sex_icon').addClass('icon-male')
                }
                else if (this.sex == "女")
                {
                    $(this.el).find('.sex_icon').addClass('icon-female')
                }
            },
            events : 
            {
                'tap': function()
                {
                    var that = this;
                    
                    page_control.navigate_to_page('user_profile/'+that.user_id)
                }
            }
        })
        
        function refresh_slide_data(success)
        {
            alert_tips = new_alert_v2.show({text:"图片加载中...",type : "loading",append_target : _page_view.$el,auto_close_time:false});
            
            common_function.send_request
            ({
                url : wo_config.ajax_url.get_world_daliy+"?newspaper_id="+world_daliy_id,
                callback : function(data)
                {
                    alert_tips.close();
                    
                    var model_data = data.result_data.newspaper_info.photo_list;
                    
                    var html_arr = [];
                    
                    $(model_data).each(function(i,obj)
                    {                       
                        if(i == 0)
                        {
                            newspaper_des = obj.content
                        }
                        
                        slide_img_view_obj = new slide_img_view
                        ({
                            model : obj,
                            idx : i
                        })  
                        
                        html_arr.push(slide_img_view_obj.$el.html());  
                    })
                    
                    var other_slider_view_obj = new other_slider_view
                    ({
                        idx : model_data.length
                    });
                    
                    html_arr.push(other_slider_view_obj.$el.html())
                    
                    _page_view.$el.find('[data-slide_show_container]').find('.swipe-wrap').html('')
                    
                    _page_view.$el.find('[data-slide_show_container]').find('.swipe-wrap').html(html_arr.join(""))
                    
                    _page_view.$el.find('[data-slide_show_container]').show();                                                                               
                    
                    if(typeof success == 'function')
                    {
                        success.call(this,model_data.length)
                    }
                    
                    // 渲染嘉宾列表
                    
                    var guest_list_obj = _page_view.$el.find('[data-guest_list]');
                    
                    guest_list_obj.html('');
                    
                    var guest_data = data.result_data.newspaper_info.user_list;
                    
                    $(guest_data).each(function(i,obj)
                    {
                        var user_guest_view = new guest_view
                        ({
                            model : obj
                        })  
                        
                        guest_list_obj.append(user_guest_view.$el)
                    })
                    
                    // 获取日报id
                    newspaper_id = data.result_data.newspaper_info.newspaper_info.newspaper_id;
                    
                    // 获取日报标题
                    newspaper_title = data.result_data.newspaper_info.newspaper_info.title;
                    
                },
                error : function()
                {
                    alert_tips.close();
                }
            }) 
        }

        
        function show_slide_img(idx,total,direction,use_set_num)
        {
            
        	var container = slide_show_container;
        	
        	var cur_slide_obj = container.find('[data-silde_show_idx="'+idx+'"]');
        	
        	var cur_img_obj = cur_slide_obj.find('.target_img');
        	
        	var cur_img_url = cur_img_obj.attr('data-ori_src');
        	
        	var cur_nick_name = cur_slide_obj.attr('data-user_nickname');
        	
        	cur_img_obj.attr('src',cur_img_url)
        	
        	var des = ''
        	
        	var icon = cur_slide_obj.attr('data-header_icon_url')
        	
        	if(!common_function.is_empty(cur_nick_name))
        	{
        	    des = cur_nick_name + "：" + cur_slide_obj.attr('data-user_des_content')
        	}
        	else
        	{
        	    des = cur_slide_obj.attr('data-user_des_content')
        	}
        	      
        	
            if(use_set_num)
            {
               set_num(parseInt(idx))    
            }        	        	
            
            set_header_des(icon,des)
        	
        	if(idx == 0)
        	{
        		// 显示第 2、3张
        		
        		var img_1 = container.find('[data-silde_show_idx]').eq(idx+1).find('.target_img');
        		
        		var img_2 = container.find('[data-silde_show_idx]').eq(idx+2).find('.target_img');
        		
        		img_1.attr('src',img_1.attr('data-ori_src'))
        		
        		img_2.attr('src',img_2.attr('data-ori_src'))
        	}
        	else if(idx % 2 == 0 && idx != total)
        	{
        		//正常情况显示前后两张        		        		
        		
        		var pre_img_1 = container.find('[data-silde_show_idx]').eq(idx-1).find('.target_img');
        		
        		var pre_img_2 = container.find('[data-silde_show_idx]').eq(idx-2).find('.target_img');
        		
        		var next_img_1 = container.find('[data-silde_show_idx]').eq(idx+1).find('.target_img');
        		
        		var next_img_2 = container.find('[data-silde_show_idx]').eq(idx+2).find('.target_img');
        		
        		pre_img_1.attr('src',pre_img_1.attr('data-ori_src'))
        		
        		pre_img_2.attr('src',pre_img_2.attr('data-ori_src'))
        		
        		next_img_1.attr('src',next_img_1.attr('data-ori_src'))
        		
        		next_img_2.attr('src',next_img_2.attr('data-ori_src'))
        	}
        	else if(idx == total)
        	{        	    
        	    
        	    var img_1 = container.find('[data-silde_show_idx]').eq(total-1).find('.target_img');
                
                var img_2 = container.find('[data-silde_show_idx]').eq(total-2).find('.target_img');
                
                img_1.attr('src',img_1.attr('data-ori_src'))
                
                img_2.attr('src',img_2.attr('data-ori_src'))
        	}
        	
        	
        	        	
        }
        
        function set_header_des(icon,des)
        {
            $(_page_view.el).find('[data-user_des]').html('')                       
            
            if(icon)
            {
                $(_page_view.el).find('[data-user_icon_td]').show();
            }
            else
            {
                $(_page_view.el).find('[data-user_icon_td]').hide();
            }                        
            
            $(_page_view.el).find('[data-slide_user_icon]').attr('src',icon)
                        
            
            $(_page_view.el).find('[data-user_des]').html(des)
        }
        
        function set_num(cur_num,total)
        {
        
            $(_page_view.el).find('[data-cur_page]').html(cur_num)
            
        }                
        
        function control_tips_show(tag)
        {
            if(tag)
            {
                var tips_layout_width = window.innerWidth
            
                var tips_layout_height = window.innerHeight
                
                $(_page_view.el).find('.world-daliy-page_tips').css({'width':tips_layout_width+"px",'height':tips_layout_height+"px"})
                
                $(_page_view.el).find('.world-daliy-page_tips').show()
            }
            else
            {
                $(_page_view.el).find('.world-daliy-page_tips').hide()
            }
            
            
        }
			
        var page = require('page').new_page(options);

        return page;
    }
})

if(typeof(process_add)=="function")
{
	process_add()
}