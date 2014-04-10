define("wo/edit",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","new_alert_v2","img_process","popup","app_function"],function(require, exports)
{
	var $ = require('zepto')
	var cookies = require('cookies')

	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var app_function = require('app_function')
    var wo_config = require('wo_config')
    var new_alert_v2 = require("new_alert_v2")
	var img_process = require('img_process')
    
    var popup = require('popup')
	var select_module_class = require("select_module")()

	exports.route = { "edit": "edit" }

	exports.new_page_entity = function()
	{
		var options = {
			route : { "edit": "edit" },		
			transition_type : 'slide',
			dom_not_cache: true
		};	
		
        //数据model
        
		var user_info_model = Backbone.Model.extend({
			defaults:
			{				
				nickname : "",
				user_icon : "",
				blog_descrit : "",
				user_id : "",
				user_sex : "",
				birthday_year : "",
				astro : ""
			},
			refresh : function()
			{           		
				_page_view.page_lock = true
                
               var alert_tips = new_alert_v2.show({text:"加载中",type : "loading",append_target : _page_view,is_cover : true ,auto_close_time:false});               				

				this.fetch
				({
					type: "GET",  
					data: {t : parseInt(new Date().getTime()) },
					timeout : wo_config.ajax_timeout,
					success : function()
					{						
						_page_view.page_lock = false
                                                
                        alert_tips.close()
					},  
					error:function(err)
					{  						
						_page_view.page_lock = false
                        
                        alert_tips.close()
                                                

					}  
				})
			},
			url : wo_config.ajax_url.get_user_info
		})
		
		options.initialize = function()
		{
			this.render();
		}
			
		options.render = function()
		{
			var template_control = require('get_template')

			
			var template_obj = template_control.template_obj()
			
			var init_html = template_obj.edit;       						

			this.$el.append($(init_html))

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
			'tap [data-to_edit="user_sex"]' : function()
			{
				sex_select_obj.open()
			},
			'tap [data-to_edit="birthday_year"]' : function()
			{    
				birthday_year_select_obj.open()
			},
			'tap [data-to_edit="astro_name"]' : function()
			{
				astro_select_obj.open()
			},
			'tap .tag' : function(ev)
			{
				var cur_tag = $(ev.currentTarget)
				if(cur_tag.hasClass("select"))
				{
					cur_tag.removeClass("select")  
				}
				else
				{
					cur_tag.addClass("select")  	
				}
			},
			'click .btn-close-wrap' : function(ev)
            {
			    _page_view.find(".tigs-data-item").hide()
			},
			//保存资料
            'tap [data-to_save]' : function(ev)
            {
                 save_edit()
            },
			//保存资料并路由去微光世界
            'tap [data_to_open]' : function(ev)
            {
				 save_edit()
				 
            },
			'click [data_to_neglect]' : function(ev)
            {
				ev.stopPropagation()
				ev.preventDefault()
				

				//首先关闭弹层
				popup_obj.close()

				var now_edit_info_data = get_now_edit_info()
                
				var nickname = now_edit_info_data.nickname
				var sex = now_edit_info_data.sex
				var des = now_edit_info_data.des
				var location_id = now_edit_info_data.location_id
				var birthday_year = now_edit_info_data.birthday_year
				var astro = now_edit_info_data.astro
				var interest_tag = now_edit_info_data.interest_tag

			    //修改
				common_function.send_request
				({
					url : wo_config.ajax_url.update_user_info,
					data : { nickname : nickname ,blog_descrit : des , blog_id : blog_id, location_id : location_id , user_sex : sex , birthday_year : birthday_year ,astro : astro ,user_interest : interest_tag}
				})

				//马上返回
				new_alert_v2.show({text:"修改成功",auto_close_time : 2000});							                
				page_control.back()
			},
			'tap [data_to_continue]' : function(ev)
            {
				//关闭弹层 
			    popup_obj.close()

			},
            'tap [data-to_nav_location]' : function(ev)
			{
				page_control.navigate_to_page("set_location",{edit_location_obj : _page_view.find("[data-location_value]"),from_edit_page : true })
			},
			'change .user_icon_file' : function(ev)
			{
				if(_page_view.page_lock) return false 

				var file_obj = ev.currentTarget
				var img_file = file_obj.files[0]
                
               
                img_process.start_img_process(img_file,{ max_width : 500 , max_height : 500 ,type : "image/jpeg" },function(base64_url)
				{
					upload_base64_img_action(base64_url)
				})
			},
			'tap .edit-img': function()
			{
				app_function.app_get_picture( {'width':500 ,'allowEditing': true } ,function(response)
				{  
					if(response.code == "0000")
					{
						var base64_url = "data:image/jpeg;base64," + response.image

						upload_base64_img_action(base64_url)
					}
				})
			}
		}

        //保存修改的内容
		function save_edit()
		{
		        var now_edit_info_data = get_now_edit_info()
                
				var nickname = now_edit_info_data.nickname
				var sex = now_edit_info_data.sex
				var des = now_edit_info_data.des
				var location_id = now_edit_info_data.location_id
				var birthday_year = now_edit_info_data.birthday_year
				var astro = now_edit_info_data.astro
				var interest_tag = now_edit_info_data.interest_tag
				
                if(_state.mark_from_my_world)
				{
				    var ret = check_user_info_complete(nickname , sex , location_id , birthday_year , astro , interest_tag , des)
				    //完成了就隐藏提示
			        if(!ret.is_complete)
			        {
					    var not_complete_str = ret.not_complete_info.join("和")

			            show_uncomplete_tips_layer(not_complete_str);
  			        }
				    else
				    {
					    //修改
					    common_function.send_request
					    ({
						    url : wo_config.ajax_url.update_user_info,
						    data : { nickname : nickname ,blog_descrit : des , blog_id : blog_id, location_id : location_id , user_sex : sex , birthday_year : birthday_year ,astro : astro ,user_interest : interest_tag}
					    })

					    //马上返回
					    new_alert_v2.show({text:"修改成功",auto_close_time : 2000});							                
					    page_control.back()  
					
				    }	
				}
				if(_state.mark_from_element)
				{
				    //修改
				    common_function.send_request
				    ({
				        url : wo_config.ajax_url.update_user_info,
					    data : { nickname : nickname ,blog_descrit : des , blog_id : blog_id, location_id : location_id , user_sex : sex , birthday_year : birthday_year ,astro : astro ,user_interest : interest_tag}
				    })
					
					page_control.navigate_to_page(wo_config.default_index_route)
				}
				
		}


		function upload_base64_img_action(base64_url)
		{
			var img_upload_url = "http://imgup-s.poco.cn/ultra_upload_service/set_user_icon.php?acao_h=1&t=" + Math.random()
			img_upload_url += "&member_id="+cookies.readCookie('member_id')+"&g_session_id="+cookies.readCookie('g_session_id')+"&pass_hash="+cookies.readCookie('pass_hash')
			
			var alert_tips = new_alert_v2.show({text:"正在上传，请稍后",type : "loading",append_target : _page_view,is_cover:true});

			//上传图片请求
			common_function.send_request
			({
				url : img_upload_url,
				type : "POST",
				data : {  user_icon_data_base64 : base64_url  }, 
				callback : function(data)
				{
					//成功修改
					if(data.result==0)
					{
						var new_user_icon = data.new_user_icon
					
						_page_view.find(".user-img img").attr("src",new_user_icon)
						
						alert_tips.close(true)
						
						new_alert_v2.show({text:"上传成功",is_cover:false,type : "success",auto_close_time : 2000})
						
						_page_view.find('[tigs_txt]').hide()
					}
					//失败
					else
					{
						alert_tips.close(true)
					  
						new_alert_v2.show({text:"上传失败，请重试",type : "info",is_cover:false,auto_close_time : 2000})
					} 
					
				},
				error : function()
				{
				    alert_tips.close(true)
				}
			})
		}

		
		var user_info_obj
		var _page_view
		var _params_arr
		var _state
		var user_info_refresh_btn
        var blog_id
        var popup_obj
        

		options.page_before_hide = function()
		{
			sex_select_obj.close()
			birthday_year_select_obj.close()
			astro_select_obj.close()
		}
        
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
			
            // 阻止冒泡，iscroll的输入框可点击
            _page_view.find('[data-to_edit="nickname"] .input-class')[0].addEventListener('touchstart' /*'mousedown'*/, function(e) {
                e.stopPropagation();
            }, false);
            
            _page_view.find('[data-to_edit="des"] .input-class')[0].addEventListener('touchstart' /*'mousedown'*/, function(e) {
                e.stopPropagation();
            }, false);
            
            _page_view.find('.edit-img input[type="file"]')[0].addEventListener('touchstart' /*'mousedown'*/, function(e) {
                e.stopPropagation();
            }, false);

			//容器滚动
			/**/var main_wraper = $(page_view.el).find('.main_wraper')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'recept_input' : true,
				'view_height' : common_function.container_height_with_head()
			})
            
            _state = state;                        
             
            user_info_obj = new user_info_model
			
			user_info_obj.bind("change",init_user_info,page_view);
			
			user_info_obj.refresh()
            
           if(_state.mark_from_element)
		   {console.log(_state.mark_from_element)
			   _page_view.find('[data-to_save]').hide()
			   
			   _page_view.find('[brith_astro_dom]').hide()
			   
			   _page_view.find('[data_to_open]').show()
		   }
		  if(_state.mark_from_my_world)
		   {console.log(_state.mark_from_my_world)
			   _page_view.find('[data-to_save]').show()
			   
			   _page_view.find('[brith_astro_dom]').show()
			   
			   _page_view.find('[data_to_open]').hide()
			   
		    }
		   
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
            
            
			if( app_function.is_world_app() )
			{
				_page_view.find('.user_icon_form').hide()
			}
			else
			{
				var ua = common_function.get_ua()
            
				//兼容性处理  modify by manson 2013.7.11
				if( !img_process.can_web_upload_img() )
				{
					_page_view.find("[data_edit_header] div").html("你的浏览器尚未支持上传功能").css("color","#ccc");
					_page_view.find("[arrow_icon]").css("visibility","hidden");
					_page_view.find('.user_icon_file').attr("disabled","")
				}
				else if(ua.isAndroid&&ua.is_uc)
				{
					_page_view.find("[data_edit_header]").html("");
					_page_view.find("[data_edit_header]").append(_page_view.find("[data-for_uc]"));
					_page_view.find("[data-for_uc]").show();    
				}
			}
		}
		
		var sex_select_obj
		var birthday_year_select_obj
		var astro_select_obj

		function select_init(model)
		{
			//性别下拉
			sex_select_obj = new select_module_class({ 
				options_data : 
				[
					{ key : "男" , val : "男" },
					{ key : "女" , val : "女" }
				],
				default_key : model.user_sex,
				onchange : function()
				{
					var select_data = this.get_select_data()
					
					var cur_sex = select_data.val

					_page_view.find("[data-sex_value]").val(cur_sex)

					//先清空已有标签
					_page_view.find("#tag_id").html('')
					
					if(cur_sex=="男")
					{
						var list_tag = globol_interest_tags.man
					}
					else
					{
						var list_tag = globol_interest_tags.woman
					}

					for(var i=0;i<list_tag.length;i++)
					{
						var str = '<span class="tag radius-2px">'+list_tag[i]+'</span>';
						_page_view.find("#tag_id").append(str);
					}
				}
			})
			
			//出生年下拉
			var current_year = new Date().getFullYear()
			var select_data_arr = new Array()
			for(var i = current_year ; i>=1950 ; i--)
			{
				select_data_arr.push({ key : i , val : i + '年' })
			}
			
			

			birthday_year_select_obj = new select_module_class({ 
				options_data : select_data_arr,
				default_key : model.birthday_year,
				onchange : function()
				{
					var select_data = this.get_select_data()
					
					_page_view.find("[data-birthday_year_value]").val(select_data.val)
					_page_view.find("[data-birthday_year_value]").attr('data_key',select_data.key)
				}
			})


			//星座下拉
			astro_select_obj = new select_module_class({ 
				options_data : [
					{ key : "1" , val : "白羊座" },
					{ key : "2" , val : "金牛座" },
					{ key : "3" , val : "双子座" },
					{ key : "4" , val : "巨蟹座" },
					{ key : "5" , val : "狮子座" },
					{ key : "6" , val : "处女座" },
					{ key : "7" , val : "天秤座" },
					{ key : "8" , val : "天蝎座" },
					{ key : "9" , val : "射手座" },
					{ key : "10" , val : "魔蝎座" },
					{ key : "11" , val : "水瓶座" },
					{ key : "12" , val : "双鱼座" }
				],
				default_key : model.astro,
				onchange : function()
				{
					var select_data = this.get_select_data()
					
					_page_view.find("[data-astro_value]").val(select_data.val)
					_page_view.find("[data-astro_value]").attr('data_key',select_data.key)
				}
			})
		}

	    
	    var globol_interest_tags
		var globol_user_sex
		function init_user_info(model)
		{            
			var model = model.attributes
			

			select_init(model)

			
			globol_interest_tags = model.interest_tags
			globol_user_sex = model.user_sex

            blog_id = model.blog_id 

            if(model.user_icon)
			{
				_page_view.find(".user-img img").attr("src",model.user_icon);
			}
			else
			{
				_page_view.find('[tigs_txt]').show()
			}
			
			
			if(!model.nickname)
            {
                _page_view.find("[data-to_edit='nickname'] .input-class").attr("placeholder", "尚未有昵称"  )
            }
            else
            {
                _page_view.find("[data-to_edit='nickname'] .input-class").val(model.nickname);    
            }
			
			
			if(!model.blog_descrit)
            {
                _page_view.find("[data-to_edit='des'] .input-class").attr("placeholder", "尚未有签名" )
            }
            else
            {
                _page_view.find("[data-to_edit='des'] .input-class").val(model.blog_descrit);    
            }
            

            if(model.location_province== "")
            {
                _page_view.find("[data-location_value]").attr("placeholder","点击设置")
            }
            else
            {
				_page_view.find("[data-location_value]").attr('data-city_id',model.location_id)

                if(model.location_province == model.location_city)
                {
                    _page_view.find("[data-location_value]").val(model.location_city)    
                }
                else
                {
                    _page_view.find("[data-location_value]").val(model.location_province+" "+model.location_city)
                }
                
            }
			
			
			//性别初始化
			_page_view.find("[data-sex_value]").val(model.user_sex).attr('data_key',model.user_sex)
			
			//出生年份初始化
			if(model.birthday_year == "")
			{
				_page_view.find("[data-birthday_year_value]").val(model.birthday_year).attr('data_key',model.birthday_year)
			}
			else
			{
				_page_view.find("[data-birthday_year_value]").val(model.birthday_year + "年").attr('data_key',model.birthday_year)
			}
			
			//星座初始化
			_page_view.find("[data-astro_value]").val(model.astro_name).attr('data_key',model.astro)
			
		    
			//自我评价标签初始化
			if(model.user_sex == "男")
			{
				var list_tag = model.interest_tags.man
			}
			else if(model.user_sex == "女")
			{	
				var list_tag = model.interest_tags.woman
			}
			else
			{
				var list_tag = model.interest_tags.man
			}

			//动态附加标签
			var user_interest_arr = model.user_interest.split(',')
			for(var i=0;i<list_tag.length;i++)
			{
				//初始化已经选择的标签
				if( $.inArray(list_tag[i],user_interest_arr)!=-1 )
				{
					var str = '<span class="tag radius-2px select">'+list_tag[i]+'</span>';
				}
                else
                {
                	var str = '<span class="tag radius-2px">'+list_tag[i]+'</span>';
                }

                _page_view.find("#tag_id").append(str);
		    }  
			var ret = check_user_info_complete(model.nickname , model.user_sex , model.location_id , model.birthday_year , model.astro , model.user_interest , model.blog_descrit)
			

			//完成了就隐藏提示
			if(!ret.is_complete)
			{
			    _page_view.find(".tigs-data-item").show()
			}
		}
		
		//判断用户资料是否填写完整  add by manson 2013.9.22
		function check_user_info_complete(nickname,user_sex,location_data,birthday_year,astro,user_interest,des)
		{
			var is_complete = true
			var not_complete_info_arr = new Array()
			
			if(common_function.is_empty(nickname))
			{
				is_complete = false
				not_complete_info_arr.push(' "昵称" ')
			}

			if(common_function.is_empty(des))
			{
				is_complete = false
				not_complete_info_arr.push(' "个性签名" ')
			}

			if(common_function.is_empty(user_sex))
			{
				is_complete = false
				not_complete_info_arr.push(' "性别" ')
			}

			if(common_function.is_empty(location_data))
			{
				is_complete = false
				not_complete_info_arr.push(' "地区" ')
			}

			if(common_function.is_empty(birthday_year))
			{
				is_complete = false
				not_complete_info_arr.push(' "出生年" ')
			}

			if(common_function.is_empty(astro))
			{
				is_complete = false
				not_complete_info_arr.push(' "星座" ')
			}

			if(common_function.is_empty(user_interest))
			{
				is_complete = false
				not_complete_info_arr.push(' "自我评价" ')
			}

			
			
			return { is_complete : is_complete , not_complete_info : not_complete_info_arr}
		}


		//显示未完成弹出层
		function show_uncomplete_tips_layer(not_complete_str)
		{
			var html = '<div id="popup_container" style="position: absolute; top: 0px; z-index: 100000; left: 0px; width: 100%; height: 100%;background:rgba(0,0,0,0.5);display: table;"><div style="display:table-cell;vertical-align: middle;text-align: center;"><div class="radius-2px f14" style="width: 300px;background: #fff;margin: 0 auto;padding-top:25px;padding-bottom: 20px;"><div class="font_wryh" style=" width: 260px; margin: 0 auto; text-align: left; ">继续补充'+not_complete_str+'，就可以获得“居民身份证”门牌了。</div> <div class="clearfix" style=" width: 260px; margin: 30px auto 0 auto; text-align: left; "> <div class="ui-btn-close fl" data_to_neglect="" style=" width: 125px;  height: 45px; display: inline-block;"><span class="bgc-fff-e6e radius-2px">忽略</span></div> <div class="ui-btn-register fl" data_to_continue="" style=" width: 125px; height: 45px; display: inline-block; margin-left: 10px;"><span class="radius-2px"> 继续补充</span></div> </div> </div></div></div>'

			popup_obj = popup.show_popup({ container : _page_view,html_str : html}) 
		}

		//获取当前用户填写的资料
		function get_now_edit_info()
		{
			var nickname_input = _page_view.find("[data-to_edit='nickname'] .input-class").val()
			var des_input = _page_view.find("[data-to_edit='des'] .input-class").val()
			var user_sex_input = _page_view.find("[data-sex_value]").val()
			var user_birthday_input = _page_view.find("[data-birthday_year_value]").attr('data_key')
			var user_astro_input = _page_view.find("[data-astro_value]").attr('data_key')
			var location_id = _page_view.find("[data-location_value]").attr("data-city_id")                     


			var user_select_interest_arr = new Array()
			_page_view.find(".tag").each(function(i,tag_obj)
			{
				if($(tag_obj).hasClass('select'))
				{
					user_select_interest_arr.push($(tag_obj).html())
				}
			})

			var user_select_interest_str = user_select_interest_arr.join(",")

			return {nickname : nickname_input , des : des_input , sex : user_sex_input , birthday_year : user_birthday_input , astro : user_astro_input , location_id : location_id , interest_tag : user_select_interest_str}
		}

		
		var page = require('page').new_page(options)
		
		return page
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}