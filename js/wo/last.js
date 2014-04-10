define("wo/last",["base_package",'frame_package',"btn_package","commom_function","wo_config","new_alert_v2","select_module","interact_module","app_function"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var wo_config = require('wo_config')
    var new_alert_v2 = require("new_alert_v2")
	var Mustache = require('mustache')
	var select_module_class = require("select_module")()
	var app_function = require('app_function')
	

	function new_page_entity()
    {
		var alert_tips ;
        
        var select_module_class = require("select_module")()
        
        var select_data = [				
				{ key : "自拍" , val : "自拍" },
				{ key : "旅游" , val : "旅游" },
				{ key : "美食" , val : "美食" },
				{ key : "萌宠" , val : "萌宠" },
				{ key : "玩物" , val : "玩物" },
				{ key : "摄影" , val : "摄影" },
				{ key : "玩乐" , val : "玩乐" },
				{ key : "我的城市" , val : "我的城市" },
				{ key : "心情" , val : "心情" }
			]

	   
		//数据model
		var photo_info_model = Backbone.Model.extend({
			defaults:
			{
				art_id : "",
				summary : "",
				cover_img_url : "",
				nickname : "",
				user_icon : "",
				like_count : "",
				cmt_count : "",
				had_like : "",
				user_id : "",
                author_self : ""
			},
			url : wo_config.ajax_url.last
		})

		var custom_options = custom_options || {}

		var options = {
			route : { "last/:art_id(/from_:source)": "last" },
			manual_title : true,
			transition_type : custom_options.custom_tansition || 'slide',
			without_his : custom_options.without_his,
			dom_not_cache : true,
			ignore_exist : true
		};
		
		

		options.initialize = function()
		{
			this.render()
		}
		
		options.render = function()
		{
			var template_control = require('get_template')
			var template_obj = template_control.template_obj()
				
			var init_html = template_obj.last

			
			this.$el.html(init_html) 
    
		}
		
		
		options.events = {
			
			//后退
			'tap .ui-btn-prev-wrap' : function(ev)
			{
				page_control.back()                                
			},
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{
					page_control.back()
				}
			},
            'tap .art-user-info' : function(ev)
			{
				if(_page_view.page_lock) return false

                var user_id = photo_info_class.attributes.user_id
                
				page_control.navigate_to_page("user_profile/"+user_id)
			},
			//评论按钮（包括还剩下多少条评论的按钮）
			'tap [cmt_btn]' : function()
			{
				if(_page_view.page_lock) return false
				
				var art_id = photo_info_class.attributes.art_id

				page_control.navigate_to_page("cmt/"+art_id)
			},
            'tap [data-del_btn]' : function(){ delete_img() },
			//关键字 链接
			'tap .tag-grid' : function(ev)
			{
				var target = ev.currentTarget
				
				var tag = $(target).text()

				var encode_tag = encodeURIComponent( tag )

				var user_id = photo_info_class.attributes.user_id

				page_control.navigate_to_page("user_photo/"+ user_id +"/" + encode_tag)
			},
			'tap .tag-theme' : function(ev)
			{
				var target = ev.currentTarget
				
				var tag = $(target).text()

				var encode_tag = encodeURIComponent( tag )

				page_control.navigate_to_page("theme_pic_list/" + encode_tag)
			},
			//@人 链接
			'tap poco_at' : function(ev)
			{
				var at_target = ev.currentTarget

				var user_id = $(at_target).attr('user_id')

				if(user_id>0)
				{
					page_control.navigate_to_page("user_profile/"+user_id)
				}
			},
			// 点击私信按钮弹出私信入口
			'tap .ui-btn-letter' : function()
			{
				interact_module_view_obj.show()
	
			},
			//点击文字遮罩层
            'tap .fade-page' : function()
			{
                hide_fade_txt()
				window.localStorage.setItem("last_page_record",1)
			},
			//点击关闭文字箭头提示层
			'tap [data_tigs_close]' : function()
			{
                hide_fade_txt()
				window.localStorage.setItem("last_page_record",1)
	
			},
			//喜欢操作
			'tap [love_btn]' : function(ev)
			{
				if(_page_view.page_lock) return false

				var poco_id = common_function.get_local_poco_id()
        
				if( common_function.is_empty(poco_id) )
				{
					page_control.navigate_to_page("login")
					return
				}	
				
				
				var target = ev.currentTarget
				var heart_icon = $(target).find('em')
				
				var replace_like_count = _page_view.$el.find('[replace_like_count]')
				var cur_like_count = parseInt( replace_like_count.html() )

				if(heart_icon.hasClass("cur"))
				{
					heart_icon.removeClass("cur")
					var is_like = 0

					var after_like_count = cur_like_count - 1
					if(after_like_count<0) after_like_count = 0
					
					if(after_like_count==0)
					{
						_page_view.$el.find('.love-box').hide()
					}
					replace_like_count.html(after_like_count)
					

					if(_state && _state.btn_love_obj)
					{
						_state.btn_love_obj.removeClass("cur")
					}
				}
				else
				{
					heart_icon.addClass("cur")
					var is_like = 1
					
					
					_page_view.$el.find('.love-box').show()
					replace_like_count.html(cur_like_count + 1)
					

					if(_state && _state.btn_love_obj)
					{
						_state.btn_love_obj.addClass("cur")
					}
				}
				
				var art_id = photo_info_class.attributes.art_id
				// 发送喜欢请求                    
				common_function.like_photo_action(art_id,is_like,"detail")
			},
            // 分类按钮
            "tap [data-sort_btn]" : function(ev)
            {
                var action_type = "sort";
                var art_id = _params_arr[0];
                
                var select_module_obj_for_sort = new select_module_class
                ({ 
        			options_data : select_data,			
        			onchange : function()
        			{
        				var select_data = this.get_select_data()		  
                        
                        if(common_function.is_empty(select_data.val))
                        {
                            alert_tips = new_alert_v2.show({ text:"请选择类别",type : "info" ,auto_close_time : 1000})
                            return;
                        }      				        				
        
        				var cat_name = encodeURIComponent(select_data.val)
                        
                        manage_action
                        ({
                            data : {art_id : art_id ,action_type : action_type,cat_name:cat_name},
                            success : function(data)
                            {                                
                                
                                alert_tips = new_alert_v2.show({ text:"分类成功",type : "info" ,auto_close_time : 1000})
                            }
                        })
        				
        			}
        		})
                
                select_module_obj_for_sort.open()
            },
            "tap [data-push_to_hot_btn]" : function(ev)
            {
                var action_type = "push_to_hot";
                var art_id = _params_arr[0];
                
                manage_action
                ({
                    data : {art_id : art_id ,action_type : action_type},
                    success : function(data)
                    {
                        console.log(data)
                        
                        alert_tips = new_alert_v2.show({ text:"已推为热门",type : "info" ,auto_close_time : 1000})
                    }
                })
            },
            "tap [data-reject_pass_btn]" : function(ev)
            {
                if(confirm("确定拒绝通过?"))
                {
                    var action_type = "reject_pass";
                    var art_id = _params_arr[0];
                    
                    manage_action
                    ({
                        data : {art_id : art_id ,action_type : action_type},
                        success : function(data)
                        {
                            console.log(data)
                            
                            alert_tips = new_alert_v2.show({ text:"已拒绝",type : "info" ,auto_close_time : 1000})
                        }
                    })
                }
                
            }
		}

		options.window_change = function(page_view)
		{
			page_view.$el.find('.content-10').height(common_function.container_height_with_head_and_nav())
			page_view.$el.find('[replace_cover_img_url]').css({height:'auto'})
            
            if(window.localStorage.getItem("manage_mode") == 1)
            {
                page_view.$el.find('.manage_btn').width(manage_btn_size())
            }
			
			var tig_img_height = window.innerWidth*264/640
			
			_page_view.$el.find('.tigs-pic-item img').height(tig_img_height)
		}

		options.page_before_show = function()
		{
			if(page_title)
			{
				document.title = page_title
			}
		}
		
		var view_scroll_obj
		var photo_info_class
		var _page_view
        var _params_arr
        var _state
		var source
		var refresh_btn
		var page_title
		var interact_module_view
		var interact_module_view_obj
		
		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{ 
			_page_view = page_view
            _params_arr = params_arr
		    _state = state		

			//锁定页面
			_page_view.page_lock = true  
            /*
			//刷新按钮  add by manson 2013.5.7
			refresh_btn = require("refresh_btn")();
			page_view.$el.find(".header").append(refresh_btn.$el);
			*/
			
			// 送礼物、发信信弹出层
            interact_module_view = require('interact_module')                       
           

			if(app_function.can_app_share())
			{
				var share_btn = true;
				var share_weixin_btn_show = true
			}
			else
			{
				var share_btn = false
			    var share_weixin_btn_show = false
			}
			
			if( app_function.is_world_app() )
			{
				var download_btn_show = true
			}
			else
			{
				var download_btn_show = false
			}


            interact_module_view_obj = new interact_module_view
            ({
                // 按钮排序根据传入的按钮对象进行排列
                show_share_btn_list : share_btn,//share_btn,
                message_btn_obj : 
                {
                    show : true,
                    click_btn_callback : function()
                    {
                        // 点击发私信
                        this.control_nav_to_message_list(photo_info_class.attributes.user_id)
                        
                    }
                },                                
                download_btn_obj : 
                {
                    show : download_btn_show,
                    click_btn_callback : function()
                    {
                        var downloadImg = photo_info_class.attributes.cover_img_url.replace('-c','')

                        PocoWebViewJavascriptBridge.callHandler('PocoWorld.file.download',{'imgUrl': downloadImg },function(response)
                        {
                            /*if(response.code == '0000')
                            {
                                new_alert_v2.show({text:"下载成功",type:"success",auto_close_time : 1000})
                            }
                            else
                            {
                                new_alert_v2.show({text:"下载失败",type:"info",auto_close_time : 1000})
                            }*/
                        })
                    }
                },
                report_btn_obj : 
                {
                    show : true,
                    click_btn_callback : function(select_report_obj)
                    {
                        if(select_report_obj)
                        {
                            select_report_obj.open();
                        }
                        else
                        {
                            var art_id = _params_arr[0];
                            
                            var select_report_obj = this.init_report_select_control(art_id);
                            
                            select_report_obj.open();
                        }
                                                              
                    }
                },
                refresh_btn_obj :
                {
                    show : true,
                    click_btn_callback : function()
                    {                        
                        last_page_refresh(1)
                    }
                },
                share_btn_obj : 
                {
                    show : share_btn, //share_btn,
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
                        var shareImg = photo_info_class.attributes.cover_img_url.replace('-c','')

                        if(share_type=='weixin')
                        {
                            shareImg = common_function.matching_img_size(shareImg,'ms')
                        }
                        else
                        {
                            shareImg = common_function.matching_img_size(shareImg,'mb')
                        }                        
                        
                        //分享了 manson 在POCO世界的照片，希望你也能来看看>>
                        
                        var shareTxt = "分享了 " + photo_info_class.attributes.nickname + " 的精彩照片，（来自 #POCO世界# 手机拍照社区） "
                        var shareUrl = "http://wo.poco.cn/world_share.php?share_page=last&art_id=" + photo_info_class.attributes.art_id
                        
                        //alert(shareTxt)

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
            
            
            

            page_view.$el.find('.wrap-box').append(interact_module_view_obj.$el)								
           
			//初始图片高度  add by manson 2013.5.9
			if(state)
			{
				var show_height = common_function.get_last_page_zoom_height_by_zoom_width(state.cover_img_width,state.cover_img_height)
				page_view.$el.find('[replace_cover_img_url]').css('height',show_height)   
			}
			

			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head_and_nav()
			})
            
            // 设置管理员按钮大小
            if(window.localStorage.getItem("manage_mode") == 1)
            {
                page_view.$el.find('[data-manage_btn]').show()
                page_view.$el.find('.manage_btn').width(manage_btn_size())
            }
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)

            
			source = params_arr[1]
			

			photo_info_class = new photo_info_model
			photo_info_class.bind('change', get_info_finish , page_view)
			

			last_page_refresh()
		}
		
		var ajax_loading = false 
		function last_page_refresh(user_refresh)
		{
			if(ajax_loading) return false
			ajax_loading = true

			var user_refresh = user_refresh || 0

			var art_id = _params_arr[0]
			/*
			refresh_btn.loadding()
			*/

			photo_info_class.fetch
			({
				type: "GET",  
				timeout : wo_config.ajax_timeout,
				data: {art_id : art_id , t : parseInt(new Date().getTime()),source : source ,user_refresh : user_refresh},
				success : function()
				{
					ajax_loading = false
					
					_page_view.$el.find('.ui-btn-letter').show()
					/*
					refresh_btn.reset()
					*/
					
					_page_view.$el.find('.tigs-pic-item img').height(tig_img_height)
                     if(app_function.can_app_share())
					 {
					     if(window.localStorage.getItem("last_page_record") != 1)
			             {
				             _page_view.$el.find('.tigs-pic-item').show() 
							  
						     _page_view.$el.find('.fade-page').show()
			             } 
						 else
					     {
						     hide_fade_txt()
					     }
					 }
				},
				error : function()
				{
					new_alert_v2.show({text:"网络不给力，刷新试试",type:"info",auto_close_time : 1000})

					ajax_loading = false
					/*
					refresh_btn.reset()	
					*/
				}
			})
		}


		// 列表子项视图
		var cmt_item_view = Backbone.View.extend({
			tagName: "div",
			className: "border-btm",
			initialize: function() {
			 
			    var model_data = this.model
				
				this.user_id = model_data.user_id
				this.cmt_id = model_data.cmt_id
				this.user_name = model_data.user_name
                this.art_id = model_data.art_id
                var user_sex = model_data.user_sex
			    var sex_class = ""
				//用户性别
				if(user_sex == "男")
				{
				    sex_class = "icon-male"
				}
				else if(user_sex == "女")
				{
				    sex_class = "icon-female"
				}
				
				var template = '<table border="0" cellspacing="0" cellpadding="0"> <tr  > <td width="35" data-user_profile_anchor ><div class="user-img middle-center" ><img src="{{user_icon}}" class="max-width-height" /></div></td> <td> <div class="user-info" data-reply_btn data-cmt_id={{cmt_id}} style="position: relative;"> <div class="clearfix"><span class="name lh16 fl">{{user_name}}</span><em class="sex_icon icon-bg-common ' + sex_class + '"></em></div><p class="txt lh20 mt5 mb5"> {{#reply_user_name}} 回复 <span class="name">{{reply_user_name}}</span>：{{/reply_user_name}}{{{content}}}</p> <div class="clearfix mt5"> <time class="time font-arial fl">{{add_time}}</time> <span class="icon icon-bg-common fr"></span> </div> </div>     </td> </tr> </table>';

				
				
				var html = Mustache.to_html(template, model_data)
				$(this.el).html(html)
				
				
				
			},
			events : {
				//回复人的头像
				"tap [data-user_profile_anchor]": function(event) 
				{
					page_control.navigate_to_page("user_profile/" + this.user_id)
				},
				"tap [data-reply_btn]": function(evt) 
				{
					var current_tag = evt.target.tagName.toLowerCase()

					if(current_tag=="poco_at") return

					var art_id = this.art_id
					var cmt_id = this.cmt_id
					var nickname = this.user_name

					var cmt_info = 
					{
						cmt_id : cmt_id,
						nickname : nickname
					}
								
					page_control.navigate_to_page("cmt/"+art_id,cmt_info)
				}
			}
		})


		get_info_finish = function(model)
		{
			var model_data = model.attributes
            
			if(model_data.art_id==false)
			{
				new_alert_v2.show
                ({
                    text:"作品不存在或已被原作者删除",
                    type : "info",
                    is_cover : true,
					is_fade : false,
                    auto_close_time : 1000,
                    closed_callback:function()
    				{
    					page_control.back()
    				}
                })

				return false
			}
			
			//解锁
			_page_view.page_lock = false
			

            var summary = model_data.summary
			var cover_img_url = common_function.matching_img_size(model_data.cover_img_url,"mb")
			
			var user_icon = model_data.user_icon
			var nickname = model_data.nickname
			var like_count = model_data.like_count
			var cmt_count = model_data.cmt_count
			var had_like = model_data.had_like
			var user_id = model_data.user_id
			var add_time = model_data.add_time
			var user_sex = model_data.user_sex
            var user_tag = model_data.user_tag
			var subject_tag = model_data.subject_tag
			

			//标签处理  add by manson 2013.12.4
			var subject_tag_html = ""
			$(subject_tag).each(function(i,obj)
			{
				subject_tag_html += '<span class="tag-item tag-theme radius-2px"><i class="icon icon-theme icon-bg-common mr5"></i>' + obj.tag + '</span>'
			})


			var user_tag_html = ""
			$(user_tag).each(function(i,obj)
			{
				user_tag_html += '<span class="tag-item tag-grid radius-2px"><i class="icon icon-grid icon-bg-common mr5"></i>' + obj.tag + '</span>'
			})
			
			_page_view.$el.find('.tag-box-wrap').html('')
			_page_view.$el.find('.tag-box-wrap').append(subject_tag_html).append(user_tag_html)
            _page_view.$el.find('.tag-box-wrap').addClass('empty_hide')
            
			//内容
			//_page_view.$el.find('.txt-box').show()
			_page_view.$el.find('[replace_summary]').html(summary)
			_page_view.$el.find('.txt-box').addClass('empty_hide')


			_page_view.$el.find('[replace_cover_img_url]').attr({'src':cover_img_url,'alt':'POCO'})
			
			//common_function.setup_weixin_share_img(cover_img_url)
			
			
			_page_view.$el.find('[replace_nickname]').html(nickname)
			_page_view.$el.find('[replace_user_icon]').attr('src',user_icon)
			_page_view.$el.find('[replace_add_time]').html(add_time)
			
			
			page_title = nickname + ' 的照片'
			document.title = page_title

			//喜欢数处理
			if(like_count>0)
			{
				_page_view.$el.find('.love-box').show()
			}
			_page_view.$el.find('[replace_like_count]').html(like_count)

			
			//是否已喜欢处理
			if(had_like)
			{
				_page_view.$el.find('[love_btn] em').addClass('cur')
			}
			else
			{
				_page_view.$el.find('[love_btn] em').removeClass('cur')
			}

			
			//评论数处理
			_page_view.$el.find('.comment-box').show()
			
			if(cmt_count == 0)
			{
				_page_view.$el.find('[have_cmt_container]').hide()
				_page_view.$el.find('[no_cmt_container]').show()
			}
			else
			{
				_page_view.$el.find('[have_cmt_container]').show()
				_page_view.$el.find('[no_cmt_container]').hide()

				_page_view.$el.find('[replace_cmt_count]').html(cmt_count)

				//填充评论列表
				_page_view.$el.find('.list-comment').html('')

				var newest_cmt_list = model_data.newest_cmt_list
				$(newest_cmt_list).each(function(i,cmt_model)
				{
					var cmt_item_obj = new cmt_item_view({
						model: cmt_model
					})

					_page_view.$el.find('.list-comment').append(cmt_item_obj.$el)
				})
				

				var newest_cmt_show_count = 3
				//大于3条，显示查看更多按钮
				if(cmt_count > newest_cmt_show_count)
				{
					_page_view.$el.find('[check_cmt_btn]').show()
					_page_view.$el.find('[replace_rest_cmt_count]').html(cmt_count - newest_cmt_show_count)
				}
				//少于等于3条，把最后一条评论下面的线去掉
				else
				{
					_page_view.$el.find('.border-btm table').last().css('border','none')
				}

			}

			//用户性别
			if(user_sex=="女")
			{
				_page_view.$el.find('.art-user-info .sex_icon').addClass('icon-female')
			}
			else if(user_sex=="男")
			{
				_page_view.$el.find('.art-user-info .sex_icon').addClass('icon-male')
			}
			

			//删除按钮
			if(model_data.author_self == 1)
            {
                _page_view.$el.find('[data-del_btn]').show()
            }

		}


		function delete_img()
		{
			if(confirm("是否删除该照片"))
			{
				var art_id = _params_arr[0]
				
				var alert_tips = new_alert_v2.show({text:"删除中",type : "loading",append_target:_page_view.$el});
				
				common_function.send_request
				({
					url : wo_config.ajax_url.del_acticle,
					data : { art_id : art_id ,t : parseInt(new Date().getTime())},
					callback : function(data)
					{                            
						if(data.ret_code == 1)
						{  
							alert_tips.close(true);
							
							new_alert_v2.show
							({
								text:"删除成功",
								is_cover:false,
								type : "success",
								is_fade : false,
								auto_close_time : 1000,
								closed_callback : function()
								{
									if(_state && _state.photo_txt_view && _state.photo_txt_view.length>0)
									{
										_state.photo_txt_view.hide();   
									}                                                                        
									   
									page_control.back()    
								}
							})
						}
						else
						{                                                                
							alert_tips.close(true);
							
							new_alert_v2.show({text:"删除失败",type : "info",is_cover:false,auto_close_time : 2000});
						}
					},
					error:function()
					{
						alert_tips.close(true);
						
						new_alert_v2.show({text:"删除失败",type : "info",is_cover:false,auto_close_time : 2000});
					}
				})
			}
		}
        
        function manage_btn_size()
        {
            return parseInt((window.innerWidth - 50)/3);
        }
        
        function manage_action(options)
        {
            var options = options || {};   
            var merge_data = options.data || {};                     
            $.extend(options.data,{t: parseInt(new Date().getTime())});
            
            console.log(merge_data)
            
            common_function.send_request
            ({
                url: wo_config.ajax_url.manage_action,
				data: merge_data,
				callback: function(data) {
					if (typeof options.success == "function") {
						options.success.call(this, data);
					}
				},
				error: function() 
                {
					if (typeof options.error == "function") 
                    {
						options.error.call(this);
					}
				}
            })
        }

        function hide_fade_txt()
        {	
		    _page_view.$el.find('.fade-page').hide() 
				
           _page_view.$el.find('.tigs-pic-item').hide()
		}
		var tig_img_height = window.innerWidth*264/640
        /*
		 // 跳转写私信
        function control_nav_to_message_list()
        {  
			var user_id = photo_info_class.attributes.user_id
            
            if(login_id == user_id)
		    {			                    
                alert_tips = new_alert_v2.show({text:"你不能向自己发私信！",type : "info",is_cover : false ,auto_close_time:1000});	
			}
			else
			{
				page_control.navigate_to_page("message_list/"+user_id)
                                
			}
            
			interact_module_view_obj.hide()
        }

        */
		
		return options
	}

	return new_page_entity
})

if(typeof(process_add)=="function")
{
	process_add()
}