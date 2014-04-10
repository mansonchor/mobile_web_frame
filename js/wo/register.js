define('wo/register',["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","new_alert_v2"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
    var wo_config = require('wo_config')
	var new_alert_v2 = require("new_alert_v2")
    var iscroll_class = require('iScroll') 
        
	exports.route = { "register": "register" }
            
    exports.new_page_entity = function()
	{
		var _page_view
		var alert_tips
        var email
		var password
		
		var options = {
			title : '注册',
			route : { "register": "register" },
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
			
            var init_html = '<div class="wrap-box login-regist-mod"><header>注册</header><div class="main_wraper"><div class="pt45"><div class="input-box-wrap pt15"><div class="input-box bgcfff"><input type="email" class="input-class w-100 bdn bgn color000 f14" data-register-mail value="" placeholder="请输入邮箱地址"></div><div class="input-box input-box-reg bgcfff"><input type="password" class="input-class w-100 bdn bgn color000 f14" data-register-psw value="" placeholder="密码：6到16个字符"></div><div class="btn-mod btn-register colorfff mt10" data_register>注册</div></div><div class="more-btn mt20"><p>可以用合作账号直接登录</p><div class="btn-box mt10 clearfix"><div class="btn tc btn-sina fl" data-to_login="sina">新浪</div><div class="btn tc btn-qzone fl ml10 mr10" data-to_login="qqzone">QQ空间</div></div></div></div></div></div>'
            
			this.$el.append($(init_html))
		}

		
		
 
		options.events = {
			
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{				    				    
                    page_control.back()
				}
			},
			'tap .ui-btn-prev-wrap' : function(ev)
			{			     
				page_control.back()
			},
			'tap [data_register]' : function(ev)
			{
				judge_register()
			},
            //4个登录方式
			'tap [data-to_login]' : function(ev)
			{
				var login_tag = $(ev.currentTarget).attr("data-to_login")
				
				//登录按钮统计  add by manson 2013.6.27
				var stat_img = new Image()
				stat_img.src = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/"+login_tag+"_login?tmp="+new Date().getTime();   

				show_oau_login_form(login_tag,_page_view)
			}
		}
		

		options.window_change = function(page_view)
		{
			                
		}

		 
		//页面初始化
		options.page_init = function(page_view,params_arr,state)
		{
			_page_view = page_view	
                                                              

            //返回按钮
            var page_back_btn_container = page_view.$_('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)       
     		
			
		}	
		
		
		function register_begin()
		{
			
			alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",append_target:_page_view.$el})

			common_function.send_request
			({
				url : wo_config.ajax_url.register,
				type : "POST",
				data : { email : email , password : password},
				callback : function(ret)
				{
					if(ret.poco_id>0)
					{
						page_control.navigate_to_page("my_life_element")
						
						common_function.set_local_poco_id(ret.user_id)
                        common_function.set_mmk(ret.mmk)
						
						alert_tips.close()
					}
					else
					{
						alert_tips.close()
						
						alert_tips = new_alert_v2.show({text:ret.err_msg,type:"info",auto_close_time : 1000})
					}
						    
					
				},
				error : function()
				{
					alert_tips = new_alert_v2.show({text:"网络不给力，刷新试试",type:"info",auto_close_time : 1000})
					
				}
			})
		}
		

				
		
		//判断用户填写资料
		function judge_register()
		{
			var register_mail_text = _page_view.$_('[data-register-mail]')
			
		    var register_psw_text = _page_view.$_('[data-register-psw]')
			
			email = register_mail_text.val()
			
			password = register_psw_text.val()
			
			var rep = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        	
        	if(email.match(rep))
        	{
        	    if(password.length >= 6 && password.length <= 16)
			    {
				    register_begin()
			    }
				else
				{
					  alert_tips = new_alert_v2.show({text:"密码需要6到16个字符",type:"info",auto_close_time : 1000})
				
				      register_psw_text.val('')
				
				      return
				}
        	}
        	else
        	{
        		alert_tips = new_alert_v2.show({text:"不是邮箱",type:"info",auto_close_time : 1000})
				
				register_mail_text.val('')
				
				return
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
                sso_alert.close()
                new_alert_v2.show({text:"登录成功",auto_close_time : 2000})

                page_control.navigate_to_page("my_life_element");
                
            },function()
            {
                sso_alert.close()
                new_alert_v2.show({text:"登录失败",auto_close_time : 2000})                                
                    
                page_control.back()   
            })

		}
		
		
		
		var page = require('page').new_page(options)
		
		return page
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}