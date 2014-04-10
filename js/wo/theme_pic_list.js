/*
    hdw 主题图片列表页
*/
define("wo/theme_pic_list",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","world_list_module","interact_module","app_function","new_alert_v2"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var wo_config = require('wo_config')
	var app_function = require('app_function')
	var new_alert_v2 = require("new_alert_v2")
	
	exports.route = { "theme_pic_list/:query": "theme_pic_list" }

	exports.new_page_entity = function()
	{
		var options = {
			manual_title : true,
			route : { "theme_pic_list/:query": "theme_pic_list" },
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true
		}
		
		
		var request_url = ""                
		options.initialize = function()
		{
			this.render();
		}

		options.render = function()
		{		
			var template_control = require('get_template')
			
			var template_obj = template_control.template_obj()
			
			var init_html = template_obj.theme_pic_list;

			this.$el.append($(init_html))
		}
		
		options.page_hide = function()
        {
            interact_module_view_obj.hide()
        }
		
		
		options.events = {
					
			'tap .ui-btn-prev-wrap' : function()
			{
				page_control.back()		
			},
			'swipe' : function(ev)
			{			    
				if(ev.gesture.direction=="right"&&!common_function.get_ua().is_uc)
				{
					page_control.back()
				}
			},			
			'tap [hot_select_btn]' : function()
			{
				if(default_select=="hot") return 

				change_select_type("hot")
				
				//world_list_module_obj.set_options({ photowall_content_type : 'normal' })
				world_list_module_obj.set_data({ is_vouch : 1 , keyword : keyword })
				world_list_module_obj.start_reset()
			},
			'tap [new_select_btn]' : function()
			{
				if(default_select=="new") return 
				
				change_select_type("new")
				
				//world_list_module_obj.set_options({ photowall_content_type : 'new' })
				world_list_module_obj.set_data({ is_vouch : 0 , keyword : keyword })
				world_list_module_obj.start_reset()
			},
			'tap .icon-join-user-wrap' : function()
			{
				if(page_control.page_transit_status()) return false	
				
				page_control.navigate_to_page("theme_join_user_list/" + encodeURIComponent(keyword) )
			},
			//底部发布按钮
			'tap footer' : function()
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
					var keyword = decodeURIComponent(_params_arr[0])
					
					page_control.navigate_to_page("publish",{ key_word : keyword , camera_sharestr : "#"+keyword+"#"})
				}
			},
			'tap .ui-btn-letter' : function()
			{
			    if(!is_loading_tag)
			    {
			       interact_module_view_obj.show()    
			    } 
			    			    
			}
		}
		

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head_and_nav())
			$(page_view.el).find('.item-act .img img').css({height:'auto'})
		}
		        

		var view_scroll_obj
		var theme_list_view_obj
		var friend_list_collection_obj
		var _params_arr
		var _page_view
        var _params_obj
        var theme_title
		var world_list_module_obj
		var keyword
		var default_select
		var interact_module_view_obj	
		var is_loading_tag = true
		var share_img
		var alert_tips
		
		options.page_before_show = function()
		{
			document.title = keyword
		}

		//页面初始化时
		options.page_init = function(page_view,params_arr,params_obj)
		{
			_page_view = page_view
			_params_arr = params_arr
			_params_obj = params_obj
			
			keyword = decodeURIComponent(params_arr[0])
   

			change_select_type("hot")		
			
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)

			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head_and_nav(),
				use_lazyload : true
			})
			
			var ui_btn_letter = $(page_view.el).find('.ui-btn-letter'); 
			
			ui_btn_letter.show();
			
			// 送礼物、发私信、分享弹出层
            var interact_module_view = require('interact_module')
			
			
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
            
            interact_module_view_obj = new interact_module_view
            ({                
                show_share_btn_list : share_btn,//share_btn,
                share_btn_obj : 
                {
                    show : share_btn,
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
                        
                        var shareImg = share_img.replace('-c','')

                        if(share_type=='weixin')
                        {
                            shareImg = common_function.matching_img_size(shareImg,'ms')                                                       
                        }                                                                                      
                        
                        //分享了 主题活动 #我家附近最赞的美食#，（来自 #POCO世界# 手机拍照社区） + 链接
                        
                        var shareTxt = "分享了 主题活动"+" #"+theme_title+"#"+"，（来自 #POCO世界# 手机拍照社区） "
                        var shareUrl = "http://wo.poco.cn/world_share.php?share_page=theme_pic_list&theme_title=" + encodeURIComponent(theme_title)                                                                      
                        
                        if( app_function.can_app_share() )
                        {   
                            if(!app_function.is_world_app()&&share_type=='sina')
                            {
                                // iphone或者android版本的poco相机
                                shareUrl = encodeURIComponent(shareUrl)   
                            }                                                                
                                                                                                             
                            app_function.app_share(share_type,shareImg,shareTxt,shareUrl)                           
                        }
                        else
                        {                                              
                            this.share_img(share_type,shareImg,shareTxt,shareUrl)
                        }
                    }
                },               
                refresh_btn_obj :
                {
                    show : true,
                    click_btn_callback : function()
                    {
                        if(page_control.page_transit_status()) return false                                                                             
                
                        world_list_module_obj.start_reset()
                    }
                }               
            })
            
            $(page_view.el).find('.wrap-box').append(interact_module_view_obj.$el)


			var world_list_module = require('world_list_module')()
			world_list_module_obj = new world_list_module({ 
				url : wo_config.ajax_url.theme_pic_list,
				data : { keyword : keyword  },
				custom_data : { theme_keyword : keyword },
				list_type : "both",
				force_type : "big_img_list",
				page_view : page_view.$el.find('.wrap-box'),
				main_container : $(page_view.el).find('.main_container'),
				oncomplete : function()
				{									
					is_loading_tag = false
                    
                    alert_tips.close();										
				},
				onloading : function()
				{				
					is_loading_tag = true
                    
                    alert_tips = new_alert_v2.show({text:"加载中",type : "loading",is_cover : false ,append_target : _page_view.$el,auto_close_time:false});										
				},
				onreset : function(index_page)
				{
					//滚回顶部
					view_scroll_obj.scroll_to(0)
					_page_view.$el && _page_view.$el.find('header').animate({'translate3d':'0px, 0px, 0px'},0,'ease-in')										

					//翻页PV统计  add by manson 2013.7.31
					common_function.page_pv_stat_action()
					
				},
				onlisttypechange : function()
				{
					view_scroll_obj.trigger_scrollend()
				},
				parse: function(response) 
				{ 
					theme_title = response.title
					
					if(!common_function.is_empty(response.world_top_data[0].cover_img_url))
					{
					    share_img = response.world_top_data[0].cover_img_url
					}

					//是否结束处理
					if(response.is_open_vouch==1)
					{
						page_view.$el.find('.tab-select').show()
					}
					else
					{
						page_view.$el.find('.header_title').html(theme_title).show()
					}
					
					if(response.have_theme_join_user_list == 1)
					{
						page_view.$el.find('.icon-join-user-wrap').show()
					}										
					
					//针对主题数据的特殊处理
					return response.photo_list
				},
				append_html : '<div style="display:none" class="icon-join-user-wrap dib border-style bgc-fff-e2e radius-2px"><span class="icon-bg-common oh icon "></span></div>'
			})

			world_list_module_obj.start_reset()
		}
		

		function change_select_type(select_type)
		{
			if(select_type=="hot")
			{
				_page_view.$el.find('[hot_select_btn]').addClass('cur')
				_page_view.$el.find('[new_select_btn]').removeClass('cur')

				default_select = "hot"
			}
			else
			{
				_page_view.$el.find('[hot_select_btn]').removeClass('cur')
				_page_view.$el.find('[new_select_btn]').addClass('cur')

				default_select = "new"
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