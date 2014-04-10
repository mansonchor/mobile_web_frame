/*
 *  login、fan、follow、invite_fans、like_photo_list
 */
define("wo/login",["base_package",'frame_package',"btn_package","wo_config","commom_function","get_template","new_alert_v2"],function(require, exports)
{
	var $ = require('zepto')
	var wo_config = require('wo_config')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var app_function = require('app_function')
    var Mustache = require('mustache')
    var new_alert_v2 = require("new_alert_v2")
	
	exports.route = { "login(/:login_type)": "login" }

	exports.new_page_entity = function()
	{
		var options = {
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true
		}

		options.initialize = function()
		{
			//loading.show_loading();

			this.render();
		}

		options.render = function()
		{
			var template_control = require('get_template')
			
			//var template_obj = template_control.template_obj()
			
			//var init_html = template_obj.login
			
			var init_html = '<div class="wrap-box login-regist-mod"><header>登录</header><div class="main_wraper"><div class="pt45"><div class="input-box-wrap pt15"><div class="input-box bgcfff"><input type="text" class="input-class w-100 bdn bgn color000 f14" data-login_user_id value="" placeholder="账号"></div><div class="input-box input-box-reg bgcfff"><input type="password" class="input-class w-100 bdn bgn color000 f14" data-login_user_pwd value="" placeholder="密码"></div><div class="btn-mod btn-register colorfff mt10" data-login_btn>登录</div></div><div class="more-btn mt20"><p>可以用合作账号直接登录</p><div class="btn-box mt10 clearfix"><div class="btn tc btn-sina fl" data-to_login="sina">新浪</div><div class="btn tc btn-qzone fl ml10 mr10" data-to_login="qqzone">QQ空间</div><div class="btn tc btn-tencent fl" data-to_login="qqweibo">腾讯微博</div></div></div></div><div class="login_form" style="display: none;padding-top:45px;"><iframe style="width:100%;height:100%;" class="ifm" frameborder="0" border="0" scrolling="yes"></iframe></div></div></div>'
			
			this.$el.append($(init_html))
		}

		
		
		var login_loading = false 
		
		options.events = 
		{	
			'tap .ui-btn-prev-wrap' : function(ev)
			{
				page_control.back()  	
			},
            //4个登录方式
			'tap [data-to_login]' : function(ev)
			{
				var login_tag = $(ev.currentTarget).attr("data-to_login")
				
				//登录按钮统计  add by manson 2013.6.27
				var stat_img = new Image()
				stat_img.src = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/"+login_tag+"_login?tmp="+new Date().getTime();   

				show_oau_login_form(login_tag,_page_view)
			},
			// POCO登录
            'tap [data-login_btn]' : function(ev)
            {                            
                var user_id = _page_view.find("[data-login_user_id]");
                var user_pwd = _page_view.find("[data-login_user_pwd]");
                
                var cur_btn = $(ev.currentTarget)
                
                if(user_id.val() == "" || user_pwd.val() == "")
                {                
                    new_alert_v2.show({text:"用户号码或密码不能为空",type:"info",append_target : _page_view ,auto_close_time : 2000})
                    return;
                }
                
                if(login_loading)
                {
                    return;
                }
                
                login_loading = true;
                

                cur_btn.text("登录中...")
                
                
                common_function.send_request
                ({
                    url : wo_config.ajax_url.login,
                    data : {account : user_id.val(), password : user_pwd.val(),t : parseInt(new Date().getTime()) },
                    callback : function(ret)
                    {
                        if(ret.result == 200)
                        {                                                       
                            if(ret.user_id>0)
                            {
                                new_alert_v2.show({text:"登录成功",auto_close_time : 2000})
                            
                                common_function.set_local_poco_id(ret.user_id)
                                common_function.set_mmk(ret.mmk)
                             
                                wo_config.is_login_flag = true
                                
                                user_pwd.blur()    
                                
                                
                                //POCO相机自动绑定POCO  add by manson 2013.8.29
                                common_function.bind_poco_in_camera()


                                setTimeout(function()
                                {
                                    if(_state && _state.url_form_frineds)
                                    {
                                       top.location.href = _state.url_form_frineds
                                    }
                                    else if(_state && _state.url_form_font_page)
                                    {
                                        page_control.navigate_to_page("friend");
                                    }
                                    else
                                    {
                                       page_control.back()   
                                    }                
                                    
                                    
                                },500)
                                
                                login_loading = false
                            }   
                        }
                        else
                        {                        
                            new_alert_v2.show({text: ret.err_msg,type:"info",auto_close_time : 2000})
                            
                            login_loading = false;
                        }
                        
                        cur_btn.text("登录")
                    },
                    error : function()
                    {
                        login_loading = false;
                         
                        cur_btn.text("登录") 
                        
                        new_alert_v2.show({text:"登录失败",type:"info",auto_close_time : 2000})
                    }
                })
        
            }
		}
		

		options.page_before_show = function(page_view,params_arr)
		{
			page_view.$el.find('.main_wraper').show()
		}
		
	  
		var view_scroll_obj    
		var _page_view
		var _params_arr    
		var _state
		


		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{	     		
		

			_page_view = $(page_view.el);        
			_state = state
					
			
			//内容滚动
			var view_scroll = require('scroll')      
            
            /*
			var list_container = $(page_view.el).find('.main_wraper');
												  
			view_scroll_obj = view_scroll.new_scroll(list_container,{
				'view_height' : common_function.container_height_with_head()
			})
			*/         
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)								            
            
            // 从好友动态跳转过来直接登录
			var login_tag = params_arr[0]                        
            
            if(login_tag)
            { 
				var url_form_frineds = (_state && _state.url_form_frineds) ? _state.url_form_frineds : false

                show_oau_login_form(login_tag,_page_view,url_form_frineds)
            }

		}

		// 显示第三方登录框
		function show_oau_login_form(login_tag,page_view,special_url)
		{
            var after_login_go_to = false;
            
            var sso_alert 
            
            if(_state && _state.url_form_font_page)
            {
                after_login_go_to = wo_config.default_index_route;
            }
			
			common_function.oau_login(login_tag,after_login_go_to,function()
            {
                // 登录中
                sso_alert = new_alert_v2.show({text:"登录中", type : "loading" , append_target : _page_view, auto_close_time : false})
                
            },function(res)
            {
                if(_state && _state.url_form_font_page)
                {
                    sso_alert.close()
                    new_alert_v2.show({text:"登录成功",auto_close_time : 2000})
                    
                    page_control.navigate_to_page(wo_config.default_index_route);
                }
                else
                {
                    sso_alert.close()
                    new_alert_v2.show({text:"登录成功",auto_close_time : 2000})                       
                    
                    page_control.back()   
                }
            },function()
            {
                sso_alert.close()
                new_alert_v2.show({text:"登录失败",auto_close_time : 2000})                                
                    
                page_control.back()   
            })

		}
        
        
		 
		
		var page = require('page').new_page(options);
		
		return page;
	}
})


// 粉丝列表
// hudw 2013.5.14
define("wo/fans",["base_package",'frame_package',"btn_package","wo_config","commom_function","user_list_view","user_list_controler","user_list_collection"],function(require, exports)
{
	var $ = require('zepto')
	var wo_config = require('wo_config')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
	

	exports.route = { "fans/:query": "fans" }

	exports.new_page_entity = function()
	{
		var options = {
			route : { "fans/:query": "fans" },		
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true            
		}
		
		var page_count = 20 
		
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
				user_list_view_obj.more_btn_reset()
				refresh_btn.reset()
				
				if(response==null) return

				if(response==false || response.length < page_count)
				{            			    
					user_list_view_obj.hide_more_btn()
				}                
			},
			before_refresh : function()
			{
				refresh_btn.loadding()
			},
			before_get_more : function()
			{
				user_list_view_obj.more_btn_loading()
			}
		}
 
		//初始化数据
		var new_user_list_collection = require('user_list_collection')
		
		var user_list_collection_obj = new_user_list_collection({
			url : function()
			{
				return wo_config.ajax_url.fans_list+"?user_id="+_params_arr[0]
			},
			refresh : function()
			{
				common_function.collection_refresh_function.call(this,collection_options)
			},
			get_more_item : function()
			{
				var that = this

				collection_options.data = { order_key : that.models[that.models.length-1].attributes.order_ukey}

				common_function.collection_get_more_function.call(this,collection_options)
			}
		})

		// 列表子项视图
		var user_list_item_view = require('user_list_view')

		// 列表视图
		var user_list_view = require('user_list_controler')
		
		options.initialize = function()
		{
			this.render();
		}

		options.render = function()
		{		       
			var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><h3 class="tc"><span class="user_title"><label></label><span style="display: inline-block;overflow: hidden;">的粉丝</span></span></h3></header><div class="content-25 no_data" style="height: 390px;display:none"><div class="me-page-nologin font_wryh"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div class="no_fans" style="text-align:left;line-height: 26px;width:300px;margin:0 auto"><p>获得粉丝小贴士：</p><p>1、多分享片到POCO。</p><p>2、多关注其他用户，喜欢对方的照片和认真交流。</p><p>3、绑定新浪微博和腾讯微博，寻找自己身边的好友。</p></div></td></tr></tbody></table></div></div><div class="content-10 main_wraper"><div class="attention-page font_wryh" style="padding-top:45px;"><div class="list-comment-item"></div></div></div></div>';
						
			this.$el.append($(init_html))
		}
		
		options.events = {
		   
			//刷新
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false

				user_list_collection_obj.refresh();
			},
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
			//加载更多
			'tap .data-more_btn' : function()
			{
				if(page_control.page_transit_status()) return false

				user_list_collection_obj.get_more_item()		
			}
			
		}

        var user_id
		var view_scroll_obj        
		var cur_page_view
		var _params_arr
		var _state
		var user_list_view_obj
		var refresh_btn

		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			cur_page_view = $(page_view.el);        
			_params_arr = params_arr; 
			_state = state;              
			
			
			//刷新按钮  add by manson 2013.5.7
			refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(refresh_btn.$el)


			//滚动列表
			var view_scroll = require('scroll')                    
			var list_container = $(page_view.el).find('.main_wraper');                                            
			view_scroll_obj = view_scroll.new_scroll(list_container,{
				'view_height' : common_function.container_height_with_head()
			})
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)                          
            
            user_id = common_function.get_local_poco_id();
			
			user_list_view_obj = new user_list_view
			({
				el : $(page_view.el).find('.list-comment-item')
			});
			
			// 初始化数据集
			//user_list_collection_obj = new user_list_collection                
			
			//刷新列表监听
			user_list_collection_obj.bind('reset', re_render_list , page_view)
			
			//加载更多监听
			user_list_collection_obj.bind('add', add_render_list , page_view)
			
			user_list_collection_obj.refresh()
						
			
			if(_state.nick_name)
			{
				console.log(_state.nick_name)
				// 设置人数
				cur_page_view.find('[data-follows]').html(_state.num)
				cur_page_view.find('.user_title label').html(_state.nick_name)   
			}
			else
			{
				cur_page_view.find('.user_title label').html("我")
			}                   
			
			if(!_state.num)
			{
				cur_page_view.find('.title').hide()
			}
			
		}
		
		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
		}
		
		function re_render_list()
		{
			var that = this;			        
			
			user_list_view_obj.clear_list()
			
			user_list_collection_obj.each(function(item_model)
			{
				var item_view = new user_list_item_view({ 
					model : item_model,
					tpl_type : "fans"                
				})			            
				
				//每次add入列表
				user_list_view_obj.add_list_item(item_view) 
								 
			})
					
			
			//滚回顶部
			view_scroll_obj.scroll_to(0)
            
            control_no_data_page()
		}
		
		function add_render_list(item_model)
		{	   

			var item_view = new user_list_item_view({ 
				model : item_model,
				tpl_type : "fans"
			})                
			
			//每次add入列表
			user_list_view_obj.add_list_item(item_view)   
			
			  
		}
        
        function control_no_data_page()
        {
                        
            var border_btm_len = cur_page_view.find(".border-btm").length;
            var main_wraper = cur_page_view.find(".main_wraper");
            var no_data = cur_page_view.find(".no_data")
            
            if(user_id == _params_arr[0])
            {
                if(border_btm_len<=0)
                {
                    no_data.show();                
                    main_wraper.hide()
                }
                else
                {
                    no_data.hide();                
                    main_wraper.show()
                }     
            }
        }
		

		var page = require('page').new_page(options);
		
		return page;
	}
	
});

// 关注列表
// hudw 2013.5.14
define("wo/follow",["base_package",'frame_package',"btn_package","wo_config","commom_function","user_list_view","user_list_controler","user_list_collection"],function(require, exports)
{
	var $ = require('zepto')
	var wo_config = require('wo_config')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
	
	exports.route = { "follow/:query": "follow" }

	exports.new_page_entity = function()
	{
		var options = {
			route : { "follow/:query": "follow" },		
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true            
		};
		
		
		var page_count = 20
		
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
				user_list_view_obj.more_btn_reset()
				refresh_btn.reset()
				
				if(response==null) return

				if(response==false || response.length < page_count)
				{            
					user_list_view_obj.hide_more_btn()
				}
                
			},
			before_refresh : function()
			{
				refresh_btn.loadding()
			},
			before_get_more : function()
			{
				user_list_view_obj.more_btn_loading()
			}
		}
		

		//初始化数据
		var new_user_list_collection = require('user_list_collection')
		
		var user_list_collection_obj = new_user_list_collection({
			url : function()
			{
				return wo_config.ajax_url.follow_list+"?user_id="+_params_arr[0]
			},
			refresh : function()
			{
				common_function.collection_refresh_function.call(this,collection_options)
			},
			get_more_item : function()
			{
				var that = this

				collection_options.data = { order_key : that.models[that.models.length-1].attributes.order_ukey}

				common_function.collection_get_more_function.call(this,collection_options)
			}
		})
		
	   
		
		var user_list_item_view = require('user_list_view')

		
		// 列表视图
		var user_list_view = require('user_list_controler')
		

		options.initialize = function()
		{
			//loading.show_loading();

			this.render();
		}

		options.render = function()
		{		       
			var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><h3 class="tc"><span class="user_title"><label></label><span style="display: inline-block;overflow: hidden;">的关注</span></span></h3></header><div class="content-25 no_data" style="height: 390px;display:none"><div class="me-page-nologin font_wryh"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div style="text-align:left;line-height: 26px;width: 100%;text-align: center;"><p>你还未关注任何人</p><p>点此寻找更多好友和关注POCO达人</p></div></td></tr></tbody></table></div></div><div class="content-10 main_wraper"><div class="attention-page font_wryh" style="padding-top:45px;"><div class="list-comment-item"></div></div></div></div>';

			this.$el.append($(init_html))
		}
		
		options.events = {
			
			//刷新
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false

				user_list_collection_obj.refresh();
			},
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
			//加载更多
			'tap .data-more_btn' : function()
			{
				if(page_control.page_transit_status()) return false

				user_list_collection_obj.get_more_item()		
			},
            'tap .no_data' : function()
            {
                if(page_control.page_transit_status()) return false

				page_control.navigate_to_page("recommend")	
            }
			
		}

		var user_id
		
		
		var view_scroll_obj        
		var cur_page_view
		var _params_arr
		var _state
		var user_list_view_obj
		var refresh_btn

		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			cur_page_view = $(page_view.el);        
			_params_arr = params_arr; 
			_state = state;    
			
            user_id = common_function.get_local_poco_id();

			//刷新按钮  add by manson 2013.5.7
			refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(refresh_btn.$el)

			
			//滚动
			var view_scroll = require('scroll')                    
			var list_container = $(page_view.el).find('.main_wraper');                                              
			view_scroll_obj = view_scroll.new_scroll(list_container,{
				'view_height' : common_function.container_height_with_head()
			})                          
			
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)

			user_list_view_obj = new user_list_view
			({
				el : $(page_view.el).find('.list-comment-item')
			});
			
			// 初始化数据集
			//user_list_collection_obj = new user_list_collection                
			
			//刷新列表监听
			user_list_collection_obj.bind('reset', re_render_list , page_view)
			
			//加载更多监听
			user_list_collection_obj.bind('add', add_render_list , page_view)
			
			user_list_collection_obj.refresh()
					
			
			if(_state.nick_name)
			{
				// 设置人数
				cur_page_view.find('[data-follows]').html(_state.num)

				cur_page_view.find('.user_title label').html(_state.nick_name)                 
			}
			else
			{
				cur_page_view.find('.user_title label').html("我")
			}

			if(!_state.num)
			{
				cur_page_view.find('.title').hide()
			}
		}
		
		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
		}
		
		function re_render_list()
		{
			var that = this;			        
			
			user_list_view_obj.clear_list()
			
			user_list_collection_obj.each(function(item_model)
			{
				var item_view = new user_list_item_view({ 
					model : item_model ,
					tpl_type : "follow"               
				})			            
				
				//每次add入列表
				user_list_view_obj.add_list_item(item_view) 
				
			})
					
			
			//滚回顶部
			view_scroll_obj.scroll_to(0)
            
            control_no_data_page()
		}
		
		function add_render_list(item_model)
		{	   

			var item_view = new user_list_item_view({ 
				model : item_model,
				tpl_type : "follow"
			})                
					
			user_list_view_obj.add_list_item(item_view)   
			
		}
        
        function control_no_data_page()
        {
                        
            var border_btm_len = cur_page_view.find(".border-btm").length;
            var main_wraper = cur_page_view.find(".main_wraper");
            var no_data = cur_page_view.find(".no_data")
            
            if(user_id == _params_arr[0])
            {
                if(border_btm_len<=0)
                {
                    no_data.show();                
                    main_wraper.hide()
                }
                else
                {
                    no_data.hide();                
                    main_wraper.show()
                }     
            }
        }
		

		var page = require('page').new_page(options);
		
		return page;
	}
});


/**/
define("wo/like_photo_list",["base_package","btn_package",'frame_package',"commom_function","wo_config","new_alert_v2","world_list_module"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var wo_config = require('wo_config')
	var new_alert_v2 = require("new_alert_v2")

	exports.route = { "like_photo_list": "like_photo_list" }

	exports.new_page_entity = function()
	{
		var options = {
			route : { "like_photo_list": "like_photo_list" },
			transition_type : 'slide',
			dom_not_cache : true
		};

		options.initialize = function()
		{
			this.render();
		}
		
		var photo_txt_item_view_obj
		options.render = function()
		{
			var init_html = '<header class="header clearfix"><h3 class="tc"  >我喜欢的照片</h3></header><div class="content-25 no_data" style="display:none"><div class="me-page-nologin font_wryh"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td><div style="text-align:left;line-height: 26px;width: 100%;text-align: center;"><p>马上到精选栏目，喜欢几张照片，让拍摄者开心一下</p></div></td></tr></tbody></table></div></div><div class="content-10 main_wraper"><div style="padding-top:45px;"><div  style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);" ></div></div><div class="main_container"></div></div></div>' 
			
			this.$el.html(init_html)
		}
				
		var page_count = 20
		
		options.events = {

			'tap .ui-btn-prev-wrap' : function()
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
			'tap .ui-btn-refresh-wrap' : function()
			{
				if(page_control.page_transit_status()) return false

				world_list_module_obj.start_reset()
			}
		}
		
		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
			$(page_view.el).find('.photowall_item img').css({height:'auto'})
		}
		
		var refresh_btn,photowall_controler,view_scroll_obj,view_scroll_obj
        var _page_view
		var world_list_module_obj

		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{ 
			//未登录处理
			var poco_id = common_function.get_local_poco_id()
			if(poco_id<=0)
			{
				new_alert_v2.show({ text:"尚未登录",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
					
					page_control.back()
				}})

				return false
			}

			var that = this
			
            _page_view = $(page_view.el)
			
			//刷新按钮  add by manson 2013.5.7
			refresh_btn = require('refresh_btn')()
			page_view.$el.find('.header').append(refresh_btn.$el)
			

			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')                
			
			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head(),
				use_lazyload : true
			})
			

			//返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)


			
			var world_list_module = require('world_list_module')()
			world_list_module_obj = new world_list_module({ 
				url : wo_config.ajax_url.like_photo_list,
				list_type : "photowall",
				main_container : $(page_view.el).find('.main_container'),
				onloading : function()
				{
					refresh_btn.loadding()
				},
				onreset : function()
				{
					refresh_btn.reset()

					//滚回顶部
					view_scroll_obj.scroll_to(0)
					_page_view.$el && _page_view.$el.find('header').animate({'translate3d':'0px, 0px, 0px'},0,'ease-in')
					

					//翻页PV统计  add by manson 2013.7.31
					common_function.page_pv_stat_action()
				}
			})

			world_list_module_obj.start_reset()
		}


		var page = require('page').new_page(options);
		
		return page;
	}
	
})

if(typeof(process_add)=="function")
{
	process_add()
}