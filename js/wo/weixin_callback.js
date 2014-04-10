define("wo/weixin_callback",["base_package",'frame_package',"btn_package","wo_config","commom_function","get_template","new_alert_v2"],function(require, exports)
{
	var $ = require('zepto')
	var wo_config = require('wo_config')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
    var new_alert_v2 = require("new_alert_v2")
	
	exports.route = { "weixin_callback/:locate": "weixin_callback" }

	exports.new_page_entity = function()
	{
		var options = {
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true
		}

		options.initialize = function()
		{
			this.render();
		}

		options.render = function()
		{
			var init_html = '<div class="wrap-box"><header class="header font_wryh fb tc re login_header"><h3 class="tc" >绑定已有账号</h3></header><header class="header font_wryh fb tc re reg_header" style="display: none;"><h3 class="tc" style="font-weight: normal;">登录</h3><div class="link-login"><div data-to_login_page class="border-left" style="font-weight: normal;">取消</div></div></header><div class="content main_wraper"  style="display:none;"><!-- 登录 ---> <div class="login font_wryh" style="padding-top:75px;"><div class="btn-item"><div class="sina-login login-box radius-2px"  data-to_login="sina_rebind_weixin"><div class="login-box-border radius-2px"><span class="radius-2px"><i class="icon icon-sina icon-bg-common"></i>使用新浪微博账号登录</span></div></div><div class="tencent-login login-box radius-2px" data-to_login="qqweibo_rebind_weixin"><div class="login-box-border radius-2px"><span class="radius-2px"><i class="icon icon-tencent icon-bg-common"></i>使用腾讯微博账号登录 </span></div> </div><div class="qq-login login-box radius-2px" data-to_login="qqzone_rebind_weixin"><div class="login-box-border radius-2px"><span class="radius-2px"><i class="icon icon-qq icon-bg-common"></i>使用<b class="font-arial">QQ</b>账号登录</span></div></div><div class="poco-login login-box radius-2px" data-to_login="poco"><div class="login-box-border radius-2px"><span class="radius-2px"><i class="icon icon-poco icon-bg-common"></i>使用<b class="font-arial">POCO</b>账号登录</span></div></div><div class="poco-login login-box radius-2px" data-register_btn="poco" style="display: none;"><div class="login-box-border radius-2px"><span class="radius-2px"><i class="icon icon-poco icon-bg-common"></i>注册<b class="font-arial">POCO</b>账号</span></div></div><div style="margin-top:30px;color:#00922D;font-size:16px;text-align:center;text-decoration:underline"  new_comer_btn>我是新用户，跳过 >></div></div></div><div class="login_form" style="display: none;padding-top:45px;"><iframe style="width:100%;height:100%;" class="ifm" frameborder="0" border="0" scrolling="yes"></iframe></div><div class="poco_login" style="display: none;padding-top:45px;"  ><!-- 登录页面 ---><div class="login-page pt15 pb15 color999 f12 font_wryh"><div class="form-item"><div class="register-box radius-2px border-style-be bgcfff"><div class="input-box oh bdb-line-dcd"><input type="text" class="input-class font_wryh w-100 bdn bgn color000" data-login_user_id value="" placeholder="用户名/Email/POCO号"/></div><div class="input-box bdbln oh bdb-line-dcd"><input type="password" class="input-class w-100 bdn bgn color000 font_wryh" data-login_user_pwd value="" placeholder="密码，6-20位字符"/></div></div><div class="ui-btn-register mt15" data-login_btn><span class="radius-3px">登录</span></div><p class="tc forget-psw mt20 f14">忘记密码：请电脑登录www.poco.cn找回</p></div></div><!-- 登录页面 end ---></div><!-- 登录 end ---> </div></div>'
			
			this.$el.append($(init_html))
		}

		
		
		var login_loading = false 
		
		options.events = 
		{	
			'tap [new_comer_btn]' : function(ev)
			{
				top.location.href = locate
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
			//取消登录按钮
			'tap [data-to_login_page]' : function(ev)
			{							            
				show_login_form(_page_view)
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
				

				cur_btn.find("span").text("登录中...")
				
				
				common_function.send_request
				({
					url : wo_config.ajax_url.login,
					data : {account : user_id.val(), password : user_pwd.val(),t : parseInt(new Date().getTime()) , rebind_weixin : true },
					callback : function(ret)
					{
						if(ret.result == 200)
						{														
							if(ret.user_id>0)
							{
							    top.location.href = locate
							}   
						}
						else
						{                        
							new_alert_v2.show({text: ret.err_msg,type:"info",auto_close_time : 2000})
                            
                            login_loading = false;
						}
						
						cur_btn.find("span").text("登录")
					},
					error : function()
					{
						login_loading = false;
						 
						cur_btn.find("span").text("登录") 
                        
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
		var locate_hash
		var locate

		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{	     
			_page_view = $(page_view.el);        
			_state = state
			
			locate_hash = params_arr[0]
			locate_hash = decodeURIComponent(locate_hash)
			
			locate = common_function.get_target_refresh_url_by_hash_name(locate_hash)
			
			//内容滚动
			var view_scroll = require('scroll')      

			var list_container = $(page_view.el).find('.main_wraper');
												  
			view_scroll_obj = view_scroll.new_scroll(list_container,{
				'view_height' : common_function.container_height_with_head()
			})         
            			
			
			page_view.$el.find('.no_authorize').css('height',common_function.container_height_with_head())
			
			//page_view.$el.find('header').hide()
		}
		
	   
		
		// 显示第三方登录框
		function show_oau_login_form(login_tag,page_view,special_url)
		{
			var last_url = ""
			var req_url = "http://m.poco.cn/mobile/action/login_bind.php?locate=" + encodeURIComponent(locate) +"&login_tag="+login_tag
			page_view.find('.login').hide()            
			
			if(login_tag == "poco" )
			{
				show_reg_header(page_view)
				
				page_view.find('.poco_login').show();
				
				return;
			}
			 
			top.location.href = req_url
		}
		
		// 隐藏第三方登录框
		function hide_oau_login_form(login_tag,page_view)
		{
			page_view.find('.login_form').hide()
			page_view.find('.poco_login').hide();
			page_view.find('.login').show()        
			page_view.find('.ifm').attr('src',"")
            
            page_view.find('.main_wraper').css("padding","0 15px");
		}
		
		
		
		// 显示登录表单
		function show_login_form(page_view)
		{
			page_view.find('header').hide()

		    page_view.find('.main_wraper').css("padding","0 15px");
		  
			page_view.find('.login').show();      
			
			page_view.find('.login_form').hide()        
			page_view.find('.poco_login').hide();
			
			page_view.find('[data-to_login="poco"]').show();   
			
			//show_login_header(page_view)            
		}
		
		function show_reg_page(page_view) 
		{
			page_view.find('.login').show(); 
			
			page_view.find('.login_form').hide()
			page_view.find('.poco_login').hide();
			
			page_view.find('[data-register_btn]').show();
			
			page_view.find('[data-to_login="poco"]').hide();   
			
			show_reg_header(page_view)
		}   
		
		
		
		// 显示登录头部
		function show_login_header(page_view)
		{
			page_view.find('.login_header').show()
			page_view.find('.reg_header').hide();
		}
		
		// 显示注册头部
		function show_reg_header(page_view)
		{
			page_view.find('.reg_header').show();
			page_view.find('.login_header').hide()
		}
		 
		
		var page = require('page').new_page(options);
		
		return page;
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}