/*
 *  新版世界列表模块
 *  @author Manson
 *	@version 2013.10.28
 */
define("wo/module/world_list_module", [ "base_package", "commom_function" ,'frame_package' ,"ua"],function(require, exports)
{
	var wo_config = require('wo_config')
	var $ = require('zepto')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var page_control = require('page_control')
	var template_control = require('get_template')
	var new_alert_v2 = require("new_alert_v2")
	var ua = require('ua')
	var Mustache = require('mustache')
	var interact_module_view = require('interact_module')
	var app_function = require('app_function')
	
	function return_world_list_module_class()
	{
		var global_options

		//世界列表通用model数据结构
		var world_list_model_class = Backbone.Model.extend({
			defaults:
			{
				art_id : "",						//作品ID
				add_time : "",						//作品时间
				cmt_count : "",						//评论数
				like_count : "",					//喜欢数
				cover_img_width : "",				//图片宽
				cover_img_height : "",				//图片高
				cover_img_url : "",					//图片地址
				summary : "",						//内容
				had_like : "",						//是否喜欢过（针对登录用户）
				user_icon : "",						//作者头像
				user_id : "",						//作者ID
				user_nickname : "",					//作者昵称
				user_sex : "",						//作者性别
				order_ukey : "",
				subject_tag : "",
				user_tag : ""
			}
		})

		
		

		//世界列表collection控制类
		var world_list_collection_class = Backbone.Collection.extend({

			model : world_list_model_class,
			index_page : 1,
			onload : false,
			__ajax : function(no_order_key_filter,callback,error)
			{
				var that = this
				
				var no_order_key_filter = no_order_key_filter || false
				
				if( common_function.is_empty(that.length) || no_order_key_filter)
				{
					var order_ukey = 0
				}
				else
				{
					var order_ukey = that.models[that.length - 1].attributes.order_ukey
				}

				var merge_data = $.extend(global_options.data,{ page : that.index_page , order_ukey : order_ukey ,t : parseInt(new Date().getTime()) })
				
				that.onload = true

				this.fetch
				({ 
					type: "GET",
					data : merge_data,
					timeout : wo_config.ajax_timeout,
					success : function()
					{
						that.onload = false
						
						
						if(typeof(global_options.oncomplete)=="function")
						{
							global_options.oncomplete.call(that)
						}
						
						setTimeout(function()
						{
						    if(typeof(callback)=="function")
                            {                            
                                callback.call(that)
                            }
						},500)
					},
					error : function()
					{
						new_alert_v2.show({text:"数据请求失败，请重试",type:"info",auto_close_time : 2000})

						that.onload = false

						if(typeof(global_options.oncomplete)=="function")
						{
							global_options.oncomplete.call(that)
						}
					}
				})
			},
			get_data : function(page,callback)
			{
				var that = this

				var page = page || false
				
				if(that.onload) return
				
				if(page)
				{
					that.index_page = page
				}
				else
				{
					that.index_page = 1
				}
				

				that.__ajax(true,callback)
			},
			get_next_page_data : function()
			{
				var that = this

				if(that.onload) return
				
				that.index_page++

				that.__ajax(false)
			},
			get_pre_page_data : function()
			{
				var that = this

				if(that.onload) return
				
				that.index_page--
				
				if(that.index_page<=0) that.index_page = 1

				that.__ajax(true)
			}
		})				
		
		// 分享弹出层view
		var interact_module_view_obj

		//大图列表item类
		var world_list_big_img_item_class = Backbone.View.extend({
			tagName :  "div",
			className : "item-act bdb-line",
			art_id : "",
			user_id : "",
			user_nickname : "",
			cover_img_url : "",
			on_like : false,
			initialize : function() 
			{
				var template_control = require('get_template')
				var template_obj = template_control.template_obj()		           
				this.template_html = template_obj.photo_txt			     			
                
                console.log(this)
                
                this.user_nickname = this.model.attributes.user_nickname
                this.cover_img_url = this.model.attributes.cover_img_url    
                				  
				//this.theme_keyword = options.theme_keyword || ""
			},
			events : {
				'tap .art-user-info' : function()
				{
					if(page_control.page_lock_status()) return false
		
					page_control.navigate_to_page("user_profile/"+this.user_id)
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
				//关键字 链接
				'tap .tag-grid' : function(ev)
				{
					var target = ev.currentTarget
					
					var tag = $(target).text()

					var encode_tag = encodeURIComponent( tag )

					page_control.navigate_to_page("user_photo/"+ this.user_id +"/" + encode_tag)
				},
				'tap .tag-theme' : function(ev)
				{
					var target = ev.currentTarget
					
					var tag = $(target).text()

					var encode_tag = encodeURIComponent( tag )

					page_control.navigate_to_page("theme_pic_list/" + encode_tag)
				},
				'tap .btn-comment' : function()
				{
					page_control.navigate_to_page("cmt/" + this.art_id)	
				},
				'tap .btn-love' : 'like_action',
				'hold .img' : function()
				{
					var that = this
					
					if( !common_function.is_empty(global_options.custom_data.theme_keyword) && !common_function.is_empty(that.is_admin))
					{
						if(confirm("是否排除出该主题?"))
						{
							common_function.send_request({
								url : 'http://m.poco.cn/mobile/action/del_keyword.php',
								data : { keyword : global_options.custom_data.theme_keyword , art_id : that.art_id }
							})
						}
					}

					
					if( !common_function.is_empty(global_options.custom_data.category_list) && !common_function.is_empty(that.is_admin))
					{
						if(confirm("是否排除出该分类?"))
						{
							common_function.send_request({
								url : 'http://m.poco.cn/mobile/action/cancel_article_category.php',
								data : { keyword : global_options.custom_data.theme_keyword , art_id : that.art_id }
							})
						}
					}
				},
                'tap [data_more_btn]' : function()
                {
                    var that = this;   
                    
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
                    
                    var extend_params =
                    {
                        user_id : that.user_id,
                        art_id : that.art_id,
                        cover_img_url : that.cover_img_url,
                        user_nickname : that.user_nickname
                          
                    }                                                                
                    
                    if(interact_module_view_obj)
                    {
                        interact_module_view_obj.show();                                                                              
                        
                        $.extend(interact_module_view_obj.extend_params,extend_params)
                                                                                
                    }                    
                    else
                    {
                        console.log('__init_interact_module_view')                                                                                                                                  
                        
                        interact_module_view_obj = new interact_module_view(
                        {
                            // 按钮排序根据传入的按钮对象进行排列
                            show_share_btn_list : share_btn, //share_btn,   
                            extend_params : extend_params,                                                    
                            message_btn_obj : 
                            {
                                show : true,
                                click_btn_callback : function()
                                {                                   
                                    
                                    // 点击发私信
                                    this.control_nav_to_message_list(interact_module_view_obj.extend_params.user_id)
                                    
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
                                        var select_report_obj = this.init_report_select_control(interact_module_view_obj.extend_params.art_id);
                                        
                                        select_report_obj.open();
                                    }
                                                                          
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
                                share_btn_list_click_callback : function(share_type)
                                {
                                    var shareImg = interact_module_view_obj.extend_params.cover_img_url.replace('-c', '')

                                    if (share_type == 'weixin')
                                    {
                                        shareImg = common_function.matching_img_size(shareImg, 'ms')
                                    }
                                    else
                                    {
                                        shareImg = common_function.matching_img_size(shareImg, 'mb')
                                    }

                                    //分享了 manson 在POCO世界的照片，希望你也能来看看>>

                                    var shareTxt = "分享了 " + interact_module_view_obj.extend_params.user_nickname + " 的精彩照片，（来自 #POCO世界# 手机拍照社区） "
                                    var shareUrl = "http://wo.poco.cn/world_share.php?share_page=last&art_id=" + interact_module_view_obj.extend_params.art_id

                                    //alert(shareTxt)

                                    if (app_function.can_app_share())
                                    {
                                        app_function.app_share(share_type, shareImg, shareTxt, shareUrl)
                                    }
                                    else
                                    {
                                        this.share_img(share_type, shareImg, shareTxt, shareUrl)
                                    }
                                }
                            }
                                                        
                        })
                        
                        //interact_module_view_obj = $.extend(interact_module_view_obj,{art_id :that.art_id,user_id : that.user_id,user_nickname : that.user_nickname })

                        global_options.page_view.append(interact_module_view_obj.$el)
                        
                        interact_module_view_obj.show();

                    }
                    
                    
                 }

                                                                
                    
                    
			},
			render : function()
			{
				var that = this
				var data = this.model.toJSON()

				//没有图片的item,过滤掉
				if(common_function.is_empty(data.cover_img_url))
				{
					that.$el.hide()
					return false
				}
				
				//模块内记 art_id
				this.art_id = data.art_id
				this.user_id = data.user_id
				this.is_admin = data.is_admin

				this.$el.attr('art_id',this.art_id)
				
				var sort_model_data = this.img_size_sort(data)
		
				if(sort_model_data.like_count<=0)
				{
					sort_model_data.like_count = "";
				}						
				
				if(sort_model_data.cmt_count<=0)
				{
					sort_model_data.cmt_count = "";   
				}			
				

				var html = Mustache.to_html(this.template_html, sort_model_data)
				
				$(this.el).html(html)	
			},
			img_size_sort : function(model_data)
			{
				model_data.cover_img_url_s = common_function.matching_img_size(model_data.cover_img_url,"mb")
				
				//是否喜欢处理
				if(model_data.had_like == 1)
				{
					model_data.like_style = 1
				}
		
				if(model_data.user_sex == "女")
				{
					model_data.sex_type = "icon-female"
				}
				else if(model_data.user_sex == "男")
				{
					model_data.sex_type = "icon-male"
				}
				
				if(!model_data.nickname)
				{
					model_data.nickname = model_data.user_nickname
				}
				
				model_data.img_show_height = common_function.get_last_page_zoom_height_by_zoom_width(model_data.cover_img_width,model_data.cover_img_height)                             								
				return model_data
			},
			//操作UI交互和数据交换封装
			like_action : function()
			{
				if(page_control.page_lock_status()) return false
		
				var that = this
		
				var poco_id = common_function.get_local_poco_id()
			
				if(poco_id == 0)
				{
					page_control.navigate_to_page("login")
					return
				}
						 
				var btn_love_i = that.$el.find('.btn-love i')
				
				if(that.on_like)
				{                   
					return
				}
													  
				that.on_like = true
				   
				var counts_obj = that.$el.find("[replace_like_count]");             
				var counts_num = 0;
				
				if(counts_obj.html()!="")
				{
					counts_num = parseInt(counts_obj.html());
				}
		
				//判断是取消还是喜欢
				if(btn_love_i.hasClass("cur"))
				{
					btn_love_i.removeClass("cur")
					
					if(this.btn_love_obj) { this.btn_love_obj.removeClass("cur") }
					
					if(counts_num-1 <= 0 )
					{
					   counts_obj.html("")
					}
					else
					{
						counts_obj.html(counts_num-1 )
					}
					
					
					var is_like = 0
				}
				else
				{
					btn_love_i.addClass("cur")
					
					if(this.btn_love_obj) { this.btn_love_obj.addClass("cur") }
					
					counts_obj.html(counts_num+1)
					var is_like = 1
				}   
		
		
				// 发送喜欢请求                    
				common_function.like_photo_action(that.art_id,is_like,"detail");
												 
				that.on_like = false
			}   
		})
		

		//瀑布流item视图类
		var world_list_photowall_item_class = Backbone.View.extend({
			tagName :  "div",
			className : "photowall_item font_wryh",
			events : {
				'tap [data-anchor]' : function()
				{	
					if(this.art_id == 0)
					{
						return; // 不存在 art_id 时 不能进入最终页以及喜欢操作 ，常用于显示第三方图片
					}
					
					if(this.photowall_item_type == "index_list")
					{
						var editor_stat = 'http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/editor?url_hash=last&txt='+encodeURIComponent('首页作品')+'&tmp=' + new Date().getTime()
						var stat_img = new Image()
						stat_img.src = editor_stat
					}
					
					this.btn_love_obj = this.$el.find('.icon-love')
					

					if(!common_function.is_empty(this.source_page))
					{
						var source_url = "/from_" + this.source_page
					}
					else
					{
						var source_url = ""
					}

					//(this.photowall_item_type !="")? "/from_"+this.photowall_item_type : ""
					
					page_control.navigate_to_page("#last/" + this.art_id + source_url,{cover_img_width : this.cover_img_width,cover_img_height : this.cover_img_height,btn_love_obj : this.btn_love_obj,photo_txt_view : this.$el })
				},
				'hold [data-anchor]' : function()
				{
					var that = this
					
					if( that.source_page=="new" && !common_function.is_empty(that.is_admin))
					{
						if(confirm("是否排除出最新图片?"))
						{
							common_function.send_request({
								url : 'http://m.poco.cn/mobile/action/blacklist_user_from_new.php',
								data : { from : "new" , art_id : that.art_id }
							})
						}
					}	

					if( that.source_page=="hot" && !common_function.is_empty(that.is_admin))
					{
						if(confirm("是否排除出热门图片?"))
						{
							common_function.send_request({
								url : 'http://m.poco.cn/mobile/action/blacklist_user_from_new.php',
								data : { from : "hot" , art_id : that.art_id }
							})
						}
					}
					

					if( !common_function.is_empty(global_options.custom_data.theme_keyword) && !common_function.is_empty(that.is_admin))
					{
						if(confirm("是否排除出该主题?"))
						{
							common_function.send_request({
								url : 'http://m.poco.cn/mobile/action/del_keyword.php',
								data : { keyword : global_options.custom_data.theme_keyword , art_id : that.art_id }
							})
						}
					}

					
					if( !common_function.is_empty(global_options.custom_data.category_list) && !common_function.is_empty(that.is_admin))
					{
						if(confirm("是否排除出该分类?"))
						{
							common_function.send_request({
								url : 'http://m.poco.cn/mobile/action/cancel_article_category.php',
								data : { keyword : global_options.custom_data.theme_keyword , art_id : that.art_id }
							})
						}
					}
				},
				'tap [data-user-info]' : function()
				{	
					var user_id = parseInt(this.user_id)
					if(user_id>0)
					{
						page_control.navigate_to_page("user_profile/"+ user_id)
					}
				},
				'tap .love-div' : function()
				{
					if(page_control.page_lock_status()) return false

					var that = this
					
					if(this.art_id == 0)
					{
						return; // 不存在 art_id 时 不能进入最终页以及喜欢操作 ，常用于显示第三方图片
					}

					poco_id = common_function.get_local_poco_id()
				
					if(poco_id == 0)
					{
						page_control.navigate_to_page("login")
						return
					}
							 
					if(that.on_like)
					{                   
						return
					}
														  
					that.on_like = true
					   
					var love_count_wrap = that.$el.find('.love_count_wrap')
					var btn_love_i = that.$el.find('.icon-love')  
					
					var love_count = that.$el.find('.love_count')
					
					var cur_like_count = parseInt( love_count.html() ) 
										

					//判断是取消还是喜欢
					if(btn_love_i.hasClass("cur"))
					{
						var after_like_count = cur_like_count - 1
						if(after_like_count<0) after_like_count = 0
						
						if(after_like_count==0)
						{
							love_count_wrap.css('display','none')
						}

						love_count.html(after_like_count)

						btn_love_i.removeClass("cur")
						var is_like = 0
					}
					else
					{
						love_count.html(cur_like_count + 1)

						if(cur_like_count + 1 > 0)
						{
							love_count_wrap.css('display','block')
						}

						btn_love_i.addClass("cur")
						var is_like = 1
					}
					
		  
					// 发送喜欢请求                    
					common_function.like_photo_action(that.art_id,is_like,"list");
													 
					that.on_like = false
				}
			},
			initialize : function(options) 
			{
				//没有图片的item,过滤掉
				if(common_function.is_empty(this.model.toJSON().cover_img_url))
				{
					return false
				}

				var options = options || {}
				

				if(ua.ios_version<"6")
				{
					this.$el.addClass('fixed_scroll_blink')
				}                                
				
				var sort_model_data = this.img_size_sort(this.model.toJSON())
				   
				
				//内部数据记录
				this.art_id = sort_model_data.art_id
				this.user_id = sort_model_data.user_id
				this.cover_img_width = sort_model_data.cover_img_width
				this.cover_img_height = sort_model_data.cover_img_height
				this.is_admin = sort_model_data.is_admin
				this.source_page = sort_model_data.source_page

				//this.photowall_item_type = options.photowall_item_type || ""
				
				var no_art_id_tpl = ''
				var no_poco_pic_tpl = ''

				var love_btn_tpl = '<div class="love-div"><em class="icon-love icon-bg-common  {{#like_style}}cur{{/like_style}}"></em></div>'
				
				if(this.source_page == "profile"  ||  global_options.photowall_content_type == "profile")
				{
					var user_btn_tpl = '<div data-anchor class="me-pic-info"><div class="txt lh16">{{list_summary}}</div><div class="love-box color999 clearfix"><span class="love_count_wrap mr10 fl"><em class="icon-love icon-bg-common fl mr5"></em><i class="love_count fsn fl">{{like_count}}</i></span><span class="cmt_wrap fl"><em class="icon-comment icon-bg-common fl mr5"></em><i class="comment-count fsn fl">{{cmt_count}}</i></span></div></div>'
				}
				else if(this.source_page == "new" || global_options.photowall_content_type == "new")
				{
					var user_btn_tpl = '<div class="new-img-item"  data-user-info><table border="0" cellspacing="0" cellpadding="0"><tr><td width="40"><div class="img middle-center"><img lazyload_src="{{user_icon}}" class="max-width-height" /></div></td><td><div class="info-box color999"><h4 class="fwn color000 clearfix"><span class="fl">{{user_nickname}}</span><em class="{{sex_icon_type}} sex_icon icon-bg-common fl"></em></h4><div class="area">{{location_string}}</div></div></td></tr></table></div>'
				}
				else
				{
					var user_btn_tpl = '<div class="user-pic-info" data-user-info><table border="0" cellspacing="0" cellpadding="0"><tr><td width="40"><div class="img middle-center"><img lazyload_src="{{user_icon}}" class="max-width-height" /></div></td><td><div class="info-box color999"><h4 class="fwn color333"><span class="fl">{{user_nickname}}</span><em class="{{sex_icon_type}} sex_icon icon-bg-common fl"  style="margin-top:0px;"></em></h4><div class="love-cmt-box clearfix"><span class="love_count_wrap mr10 fl"><em class="icon-love icon-bg-common fl mr5 {{#like_style}}cur{{/like_style}}"></em><i class="love_count fsn fl">{{like_count}}</i></span><span class="cmt_wrap fl"><em class="icon-comment icon-bg-common fl mr5"></em><i class="comment-count fsn fl">{{cmt_count}}</i></span></div></div></td></tr></table></div>'
				}

				if(this.art_id == 0)
				{
					love_btn_tpl = ''                                        
				}

				var template = '<div class="item bdb-line"   art_id="{{art_id}}"  cover_img_width="{{cover_img_width}}"  cover_img_height="{{cover_img_height}}"><div data-anchor class="cover_img"><img  lazyload_src="{{{cover_img_url_s}}}"  style="height:{{img_show_height}}px;width:100%;"  class="img_buffer_bg"/></div>'+user_btn_tpl+love_btn_tpl+''                				

				var html = Mustache.to_html(template, sort_model_data)                                
				
				$(this.el).html(html)	
				
				
				//判断评论数是否为O
				var cmt_wrap = this.$el.find('.cmt_wrap')
				var comment_count = this.$el.find('.comment-count')
				var cur_cmt_count = parseInt( comment_count.html() ) 

				if(cur_cmt_count==0)
				{
					cmt_wrap.css('display','none')
				}
				else
				{
					cmt_wrap.css('display','block')	
				}


				//判断喜欢数是否为O				   
				var love_count_wrap = this.$el.find('.love_count_wrap') 
				var love_count = this.$el.find('.love_count')
				var cur_like_count = parseInt( love_count.html() ) 
				
				if(cur_like_count==0)
				{
					love_count_wrap.css('display','none')
				}
				else
				{
					love_count_wrap.css('display','block') 
				}
			},
			img_size_sort : function(model_data)
			{
				model_data.cover_img_url_s = common_function.matching_img_size(model_data.cover_img_url,"mm")
				model_data.img_show_height = common_function.get_photowall_zoom_height_by_zoom_width(model_data.cover_img_width,model_data.cover_img_height)
				
				//是否喜欢处理
				if(model_data.had_like == 1)
				{
					model_data.like_style = 1
				}

				
				//地区字符串合并处理  add by manson 2013.9.4
				if( model_data.location_city == model_data.location_province || common_function.is_empty(model_data.location_city) )
				{
					model_data.location_string = model_data.location_province
				}
				else
				{
					model_data.location_string = model_data.location_province + "·" + model_data.location_city
				}
				

				//判断是用户性别
				if(model_data.user_sex == "男")
				{
					model_data.sex_icon_type = "icon-male"
				}
				else if(model_data.user_sex == "女")
				{
					model_data.sex_icon_type = "icon-female"
				}
				
				
				return model_data
			}
		})

		
		//瀑布流特殊item(首页特殊入口用)
		var world_list_photowall_other_item_class = Backbone.View.extend({
			tagName :  "div",
			className : "other_photowall_item photowall_item font_wryh",
			events : 
			{
				'tap [data_to_link]' : 'nav_to_page'
			},
			initialize : function() 
			{
				if(ua.ios_version<"6")
				{
					this.$el.addClass('fixed_scroll_blink')
				}                                
				
				//this.type = options.type || ""
				
				var sort_model_data = this.img_size_sort(this.model.toJSON())   
					
				this.link_url = sort_model_data.link_url
				this.summary = sort_model_data.summary
				this.cover_img_height = sort_model_data.img_show_height


				var template = '<div class="item bdb-line" data_to_link  cover_img_width="{{cover_img_width}}"  cover_img_height="{{cover_img_height}}"><div data-anchor class="cover_img"><img  lazyload_src="{{{cover_img_url_s}}}"  style="height:{{img_show_height}}px;width:100%;"  class="img_buffer_bg"/></div><div class="pop">{{summary}}</div>'        				
				var html = Mustache.to_html(template, sort_model_data)                                
				
				$(this.el).html(html)	
			},
			img_size_sort : function(model_data)
			{
				model_data.cover_img_url_s = common_function.matching_img_size(model_data.cover_img_url,"mm")
				model_data.img_show_height = common_function.get_photowall_zoom_height_by_zoom_width(model_data.cover_img_width,model_data.cover_img_height)
				
			
				return model_data
			},
			nav_to_page : function(ev)
			{
				var that = this

				if(!common_function.is_empty(that.link_url))
				{
					var editor_stat = 'http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/editor?url_hash=' + encodeURIComponent(that.link_url) + '&txt=' + encodeURIComponent(that.summary) + '&tmp=' + new Date().getTime()
					var stat_img = new Image()
					stat_img.src = editor_stat

					page_control.navigate_to_page(that.link_url)
				}
				   
			}
		})


		//总调用入口view，所有参数和控制设置都在这里
		var world_list_view_class = Backbone.View.extend({
			tagName : "section",
			className : "world_list_mvc",
			events : {
				//翻页事件
				'tap .next_paging_btn' : function()
				{
					var that = this
					if( that.load_more_btn.get_next_page_btn_ban_mode() ) return false

					that.__start_paging()
				},
				'tap .pre_paging_btn' : function()
				{
					var that = this
					if( that.load_more_btn.get_pre_page_btn_ban_mode() ) return false

					that.__start_paging(true)
				},
				'tap [photowall_type_btn]' : function()
				{
					if(this.index_list_type=="photowall") return

					this.__change_list_type_style(this.index_list_type)

					window.localStorage.setItem('user_choose_list_type','photowall')
					
					this.__render_list(true)
				},
				'tap [onelist_type_btn]' : function()
				{
					if(this.index_list_type=="big_img_list") return
					
					this.__change_list_type_style(this.index_list_type)

					window.localStorage.setItem('user_choose_list_type','big_img_list')
					
					this.__render_list(true)
				}
			},
			initialize : function(options)
			{
				var that = this
				

				var options = options || {}
						
				//初始全局参数
				global_options = {
					url : "",															//数据源url，用来给collection  fetch
					data : {},															//请求参数（后期控制可动态修改）
					parse : "",
					main_container : "",												//承载整个列表模块的最外层容器
					no_more_control : false,											//是否有加载更多或分页控制
					list_type : "both",													//列表可供用户切换选择(both : 大图和瀑布流；photowall ； big_img_list )
					force_type : false,													//强制一开始显示列表是什么类型(list_type为both时有效)
					init_page : 1,														//开始页数
					page_count : 20,													//一页数据个数（默认20）用以控制翻页按钮的控制判断
					custom_data : {},													//自定义传递数据
					photowall_content_type : false,
				    page_view : {},
						
					onloading : "",														//collection fetch触发
					onreset : "",														//collection reset触发
					oncomplete : ""	,													//ajax完成
					onlisttypechange : ""
				}
				
				//合并自定义参数
				global_options = $.extend(global_options,options)


				//数据集初始化
				that.world_list_collection = new world_list_collection_class
				
				
				if(!common_function.is_empty(global_options.url))
				{
					that.world_list_collection.url = global_options.url
				}
				
				if(!common_function.is_empty(global_options.parse))
				{
					that.world_list_collection.parse = global_options.parse
				}								
				
				that.world_list_collection.bind('reset', that.__collection_reset , that)
				
				that.__init_render()						

			},
			//初始布局html准备
			__init_render : function()
			{
				var that = this

				if(!common_function.is_empty(global_options.main_container))
				{
					var template_obj = template_control.template_obj()
					
					//var html = template_obj.photo_wall_tb

					var html = '<div class="list_type_control_container fixed_scroll_blink pt15 pb5" style="display:none;"><div append_html_container style="height:32px;position:absolute;left:0;max-width:60%;overflow:hidden;"></div><div class="ui-switch-btn-wrap border-style bgc-fff-e2e radius-2px"><div photowall_type_btn class="icon-photowall-select"><span class="icon-bg-common icon "></span></div><div onelist_type_btn class="icon-big-img-select"><span class="icon-bg-common icon"></span></div></div></div><div class="waterfall-item pt10 clearfix"><div class="imglist-item fl"><div class="mr5 left_colume"></div></div><div class="imglist-item fr "><div class="ml5 right_colume"></div></div><div class="actbox-item clearfix"  style="display:none"></div></div>'
					
					that.$el.html(html)
					global_options.main_container.html(that.$el)   

					
					if(!common_function.is_empty(global_options.append_html))
					{
						that.$el.find('[append_html_container]').append(global_options.append_html)
					}
					

					var load_more_btn = require('paging_btn')()
					
					if(common_function.is_empty(global_options.no_more_control))
					{
						$(that.el).append(load_more_btn.$el)
					}

					that.load_more_btn = load_more_btn

					
					//列表类型切换  add by manson 2013.10.13
					that.one_colume = $(that.el).find('.actbox-item')
					that.photowall_type_btn = $(that.el).find('[photowall_type_btn]')
					that.big_img_type_btn = $(that.el).find('[onelist_type_btn]')

					if(global_options.list_type=="both")
					{
						that.$el.find('.list_type_control_container').show()
					}


					that.left_colume = $(that.el).find('.left_colume')
					that.right_colume = $(that.el).find('.right_colume')
				}
			},
			__change_list_type_style : function(type)
			{
				var that = this
				
				
				if(type=="photowall")
				{
					that.photowall_type_btn.addClass('cur')
					that.big_img_type_btn.removeClass('cur')
				}
				else
				{
					that.photowall_type_btn.removeClass('cur')
					that.big_img_type_btn.addClass('cur')
				}
			},
			__left_colume_height : 0,
			__right_colume_height : 0,
			//把瀑布流item塞进瀑布流列表
			__add_item_to_photowall_list : function(world_list_photowall_item)
			{
				var that = this
				var add_left = false
				var add_right = false

				
				if( global_options.main_container.css('display')!="none" )
				{
					var left_colume_height = that.left_colume.height()
					var right_colume_height = that.right_colume.height()

					
					//添加禁瀑布流规则修改，哪边矮塞哪边  modify by manson 2013.5.18深夜
					if(left_colume_height<=right_colume_height)
					{
						add_left = true
					}
					else
					{
						add_right = true
					}
				}
				else
				{
					var item_height = world_list_photowall_item.cover_img_height
				
				
					//针对容器display none不能获取列表高度的兼容处理  add by manson 2013.11.29
					if(that.__left_colume_height <= that.__right_colume_height)
					{
						add_left = true
						
						item_height && (that.__left_colume_height += item_height)
					}
					else
					{
						add_right = true
						
						item_height && (that.__right_colume_height += item_height)
					}
				}
				
				if(add_left)
				{
					that.left_colume.append(world_list_photowall_item.$el)
				}
				else
				{
					that.right_colume.append(world_list_photowall_item.$el)
				}
				
				that.load_more_btn.show()
			},
			//把大图item塞进大图列表
			__add_item_to_big_img_list : function(world_list_big_img_item)
			{
				var that = this

				that.one_colume.append(world_list_big_img_item.$el)
				
				that.load_more_btn.show()
			},
			//清空列表（包括瀑布流和大图列表）
			__empty_world_list : function()
			{
				var that = this
				
				that.__left_colume_height = 0
				that.__right_colume_height = 0

				that.one_colume.html("")
				that.left_colume.html("")
				that.right_colume.html("")
			},
			//collection reset监听
			__collection_reset : function()
			{
				var that = this
				
				that.__render_list()
				
				
				

				if(typeof(global_options.onreset)=="function")
				{
					global_options.onreset.call(that,that.world_list_collection.index_page)
				}
			},
			__render_list : function(is_list_type_change_action)
			{
				var that = this

				var is_list_type_change_action = is_list_type_change_action || false
				
				if(is_list_type_change_action)
				{
					global_options.force_type = false
				}

				//先清空列表
				that.__empty_world_list()
				

				//类型处理
				if(common_function.is_empty(global_options.list_type) || global_options.list_type=="both")
				{
					var list_type = global_options.force_type || window.localStorage.getItem('user_choose_list_type') || "photowall"			//用户没选择时默认photowall
				}
				else
				{
					var list_type = global_options.list_type
				}

				that.index_list_type = list_type
				
				this.__change_list_type_style(that.index_list_type)

				that.world_list_collection.each(function(item_model)
				{
					if(list_type=="photowall")
					{
						that.one_colume.hide()
						that.left_colume.show()
						that.right_colume.show()
						

						if(item_model.attributes.is_insert_special_item==1)
						{
							var world_list_photowall_item = new world_list_photowall_other_item_class({ 
								model : item_model
							})
						}
						else
						{
							var world_list_photowall_item = new world_list_photowall_item_class({ 
								model : item_model
							})
						}
						
						world_list_photowall_item.render()
						
						//每次add入瀑布流控制
						that.__add_item_to_photowall_list(world_list_photowall_item)
					}
					else
					{
						that.one_colume.show()
						that.left_colume.hide()
						that.right_colume.hide()					

						var world_list_big_img_item = new world_list_big_img_item_class({ 
							model : item_model
						})

						world_list_big_img_item.render()
						
						//每次add入瀑布流控制
						that.__add_item_to_big_img_list(world_list_big_img_item)
					}
				})
				
				//控制分页
				that.__control_paging_btn(that.world_list_collection.index_page , that.world_list_collection.length)
				
				if(is_list_type_change_action && typeof(global_options.onlisttypechange)=="function")
				{
					global_options.onlisttypechange.call(that)
				}
			},
			__control_paging_btn : function(page,fetch_count)
			{
				var that = this

				//是第一页,屏蔽上一页按钮
				if(page<=1)
				{
					that.load_more_btn.ban_pre_page_btn()
				}
				else
				{
					that.load_more_btn.open_pre_page_btn()
				}

				if(global_options.page_count > fetch_count)
				{
					that.load_more_btn.ban_next_page_btn()
				}
				else
				{
					that.load_more_btn.open_next_page_btn()
				}
			},
			__start_paging : function(is_pre_page)
			{
				var that = this

				var is_pre_page = is_pre_page || false
				
				if(is_pre_page)
				{
					that.world_list_collection.get_pre_page_data()
				}
				else
				{
					that.world_list_collection.get_next_page_data()
				}
				

				that.__onload_trriget()
			},
			__onload_trriget : function()
			{
				var that = this
				
				that.load_more_btn.loadding()
				

				if(typeof(global_options.onloading)=="function")
				{
					global_options.onloading.call(that)
				}
			},
			//对外API，开始获取第一页数据
			start_reset : function(page,callback)
			{
				var that = this										

				that.__onload_trriget()
				
				that.world_list_collection.get_data(page,callback) 
			},			
			//改变传递的参数
			set_data : function(change_data)
			{
				var that = this
				
				global_options.data = change_data
			},
			set_options : function(new_options)
			{
				global_options = $.extend(global_options,new_options)
			}
		})
		

		return world_list_view_class
	}

	return return_world_list_module_class
})

if(typeof(process_add)=="function")
{
	process_add()
}