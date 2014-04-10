define("wo/preparations",["frame_package",'wo_config','commom_function','app_function'],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')   
    var wo_config = require('wo_config') 
	var ua = require('ua')
	var cookies = require('cookies') 
    
	//内部内容高度
	var page_container_obj = $('.page_container');
    var common_function = require('commom_function')
	var app_function = require('app_function')
	var notice = require('notice')
	
	//世界自主框架初始化 add by manson 2014.2.10
	app_function.init_world_app_bridge()
	

	var ori_window_height = window.innerHeight
	
	//针对IPHONE safari 隐藏地址栏优化  add by manson 2013.6.12
	fixed_safari_nav_height(false)
	if(ua.is_iphone_safari_no_fullscreen)
	{
		$(document.body).on("swipeup",function(){
		
			fixed_safari_nav_height(true,function()
			{
				page_control.window_change_page_triger()
			})
		})
	}
	

	//显影顶部导航 add by manson 2013.7.16
	$(document.body).on("swipeup",function()
	{
		fixed_header_pos(false,true)
	})

	$(document.body).on("swipedown",function()
	{
		fixed_header_pos(true,true)
	})
	
	var poco_id = common_function.get_local_poco_id();
	
	var default_index_route = "";
	
	if(poco_id>0)
	{
	    default_index_route = wo_config.default_index_route;
	}
	else
	{
	    default_index_route = "font_page";
	}

	
	var page_control = require('page_control')
	page_control.init(page_container_obj,{
		default_title : "世界·POCO",
		default_index_route : default_index_route,
		//页面PV统计
		before_route : function()
		{
			//IOS safari高度调整处理
			fixed_safari_nav_height(true,false)
			
			//页面PV统计
			common_function.page_pv_stat_action()

		},
		after_route : function()
		{
			//显示顶部导航 add by manson 2013.7.16
			fixed_header_pos(true)
		}
	})
	
	// 配置页面的key
	var page_controller_arr = 
    [   
        "about",
        "category", "charm_rank", "choose_my_image", "cmt", "cmt_notice","category_select",
        "dating_game", "dating_list", "doorplate_last", "doorplate_list","daily",
        "edit", "encounter_game", "event", 
        "friend","fans", "follow","font_page", 
        "get_friends_list","gallery", 
        "hot_img", 
        "index", "interact_module",
        "last", "like_notice", "login","like_photo_list", 
        "message", "my", "message_list", "my_image_wall", "my_wallet","my_world","my_life_element",
        "new_img", "news", "notice_list", 
        "pics_rank", "publish","publish_more_topic",
        "rank_pic_list", "recommend", "recommend_me", "red_package","register", 
        "search_result", "send_gift", "set_location", "setup","same_city", 
        "theme_join_user_list", "theme_pic_list","theme_act",
        "user_photo", "user_profile", 
        "wealth_rank", "weixin_callback","world_daliy"
    ]
	
	//add_page方法改进  modify by manson 2014.4.9
	page_control.add_page(page_controller_arr) 

		
	window.addEventListener('resize', function()
	{
		//ori_window_height = window.innerHeight
		if(ua.is_iphone_safari_no_fullscreen)
		{
			page_container_obj.height(window.innerHeight)
			window.scrollTo(0,0)
		}
		

		page_control.window_change_page_triger()

	}, false)
	
	

	var url_hash = window.location.hash      
    
    window.localStorage.setItem("nav_address","message");// 每次进入页面点击消息初始化进入私信  
    window.localStorage.setItem("rank_nav_address","pics_rank");// 每次进入页面点击焦点初始化进入照片榜

	//保证在刷新直接进入这些页时，获取到目前的登录状态  modify by manson 2013.5.24
	if( $.inArray(url_hash, ["#my","#friend","#cmt_notice","#like_notice","#like_photo_list","#recommend","#publish","#edit","#setup","#message","#comment","#belike","#notice_list","#message_list","#pics_rank","#charm_rank","#wealth_rank","red_package"]) != -1 )
	{
		get_user_id_and_notice(function()
		{
			//缓冲进度条优化  add by manson 2014.3.28
			process_add()
			process_add()
			process_add()
			process_add()
			process_add()


			page_control.route_start()
            
			//针对POCO相机直接跳去通知页面的数字修正 add by manson 2013.6.22
			if(url_hash=="#cmt_notice")
			{
				notice.update_unread_status_by_type("cmt")
			}
			else if(url_hash=="#like_notice")
			{
				notice.update_unread_status_by_type("system")
			}
			else if(url_hash=="#recommend")
			{
				notice.update_unread_status_by_type("new_come")
			}
			

            // 页面加载成功log 标识，做log和提示用  add 2013.6.20
            state_type = "complete"
            clearInterval(load_timer_handle)  
			
			//隐藏缓冲页面
			hide_bg_buffer()

		}, function(){

			//请求失败时的处理
			page_control.route_start()

			state_type = "complete"
            clearInterval(load_timer_handle)  
			
			//隐藏缓冲页面
			hide_bg_buffer()
		})
	}
	else
	{
		get_user_id_and_notice()
		
		
		page_control.route_start()
                 
        // 页面加载成功
        state_type = "complete"
        
        clearInterval(load_timer_handle)

		hide_bg_buffer()   
        
                    
        
	}


	//网速速度统计  add by manson 2013.7.25
	var world_speed_have_test = cookies.readCookie('world_speed_have_test')
	if(world_speed_have_test!=1)
	{
		var sampling = Math.random()
		if(sampling > 0.9)
		{
			cookies.writeCookie('world_speed_have_test', 1 , 24*7, 'poco.cn', '/')

			var is_wifi = cookies.readCookie('login_wap_iswifi')
			if(is_wifi==null || is_wifi=="") is_wifi = 1


			var test_speed_img = new Image()
		
			var start_time = new Date().getTime()
			test_speed_img.onload = function()
			{
				var finish_time = new Date().getTime()
				
				var load_time = (finish_time - start_time)/1000


				var speed_stat_img = new Image()
				speed_stat_img.src = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/img_load_time?is_wifi="+is_wifi+"&time="+load_time+"&tmp="+(new Date).getTime()
			}

			test_speed_img.src = 'http://image142-c.poco.cn/mypoco/qing/20130801/13/1557647171292864082_640x480_320_600.jpg?'+(new Date).getTime()

			//页面速度
			$.ajax({
			  type: 'GET',
			  url: 'http://m.poco.cn/mobile/js/test_wap_speed.js',
			  data : {t : (new Date).getTime()},
			  dataType: 'text',
			  timeout: 30000,
			  success: function(data)
			  {
				  var finish_time = new Date().getTime()
					 
				  var load_time = (finish_time - start_time)/1000
				  
				  var speed_stat_img = new Image()
				  speed_stat_img.src = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/wap_load_time?is_wifi="+is_wifi+"&time="+load_time+"&tmp="+(new Date).getTime()
			  },
			  error: function(xhr, type)
			  {
				  var finish_time = new Date().getTime()
					 
				  var load_time = (finish_time - start_time)/1000
				  
				  var speed_stat_img = new Image()
				  speed_stat_img.src = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/wap_load_time?is_wifi="+is_wifi+"&time="+load_time+"&tmp="+(new Date).getTime()
			  }
			})
			
		}
	}
	
	
	function fixed_safari_nav_height(judge_ori_height,callback)
	{
		var safari_nav_height = 60
		var fixed_height = ori_window_height + safari_nav_height

		if(judge_ori_height==true &&  fixed_height==window.innerHeight)
		{
			return false
		}

		if(ua.is_iphone_safari_no_fullscreen)
		{
			page_container_obj.height(fixed_height)
			window.scrollTo(0,0)
			
			if(typeof(callback)=="function")
			{
				callback.call(this)
			}
		}
	}

	//显影顶部导航 add by manson 2013.7.16
	function fixed_header_pos(show , animate)
	{
		var animate = animate || false

		var url_hash = window.location.hash 
		url_hash = url_hash.replace("#","")
		
		var slash_pos = url_hash.indexOf('/')
		if(slash_pos>0) url_hash = url_hash.substr(0,slash_pos)
		

		if($.inArray(url_hash, wo_config.fixed_header_pos_page) != -1)
		{
			var current_page_view = page_control.return_current_page_view()

			if(current_page_view.$el)
			{
				var header_obj = current_page_view.$el.find('header')
			
				if(animate && !ua.isAndroid)
				{
					animate_time = 150
				}
				else
				{
					animate_time = 0
				}

				if(show==true)
				{
					header_obj.animate({'translate3d':'0px, 0px, 0px'},animate_time,'ease-in')
				}
				else
				{
					header_obj.animate({'translate3d':'0px, -47px, 0px'},animate_time,'ease-out')
				}
			}
		}
	}


    // ios下判断是否出现设置书签的提示层
    if(ua.is_iphone_safari_no_fullscreen)
    {                
        require('new_tips');
        
        var new_tips = require('new_tips')();  
        
        new_tips.show();
    }
        
	
	function hide_bg_buffer()
	{
		setTimeout(function(){
			$('.font_page').hide()
			$('.page_container').show()
		},200)
	}
	

	function get_user_id_and_notice(callback , error)
	{
		var that = this

		common_function.get_poco_id(function(data)
		{                                                               
			common_function.set_local_poco_id(data.poco_id)
			common_function.set_mmk(data.mmk)
			
            common_function.set_show_my_wall(data.show_my_wall)			            
            
            //更新ps图记录            

			//用户登录后自动帮他绑定POCO  add by manson 2013.9.2
			var world_user_login = cookies.readCookie('world_user_login')
			
			if(!common_function.is_empty(world_user_login))
			{
				common_function.bind_poco_in_camera()
			}
			
			
			
			notice.reset_notice_by_data(data.notice_stat)
			
			if(typeof(callback)=="function")
			{
				callback.call(that)
			}
			
			 //定期获取消息通知数
			 if(data.poco_id > 0)
			 {            
				setInterval(function()
				{
					common_function.get_poco_id(function(data)
					{
						common_function.set_local_poco_id(data.poco_id)
						common_function.set_mmk(data.mmk)
						common_function.set_show_my_wall(data.show_my_wall)
                                              
						notice.reset_notice_by_data(data.notice_stat)
					})
					
				}, wo_config.notice_time)
			 }
		} , true , error)
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}