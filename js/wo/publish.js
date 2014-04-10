define("wo/publish",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","new_alert_v2","img_process","emoticon_module","topic_txt_module",'app_function'],function(require, exports)
{
	var $ = require('zepto')
	var jquery = require('jquery')
	var cookies = require('cookies')
	var wo_config = require('wo_config')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var app_function = require('app_function')
    var wo_config = require('wo_config')
    var ua = require('ua')
    var emoticon_module = require("emoticon_module");
    var topic_txt_module = require("topic_txt_module");
	var img_process = require('img_process')
    
    

	exports.route = { "publish": "publish" }

	exports.new_page_entity = function()
	{
		var btn_send_tag = false
		var have_succeed
		var new_alert_v2 = require("new_alert_v2")
		var alert_tips 
		var nick_name_arr = []
        var user_id_arr = []

		var options = {
			route : { "publish": "publish" },		
			transition_type : 'slideup',
			dom_not_cache: true
		}
		

		options.initialize = function()
		{
			this.render();
		}
			
		options.render = function()
		{
			var template_control = require('get_template')

			var template_obj = template_control.template_obj()
			
			var init_html = template_obj.publish;											       					

			this.$el.append($(init_html))
		}


		function upload_base64_img_action(base64_url)
		{
			var img_upload_url = "http://imgup-s.poco.cn/ultra_upload_service/get_img_file_fun_qing.php?acao_h=1&t=" + Math.random()
                    
			$.ajax({
				url: img_upload_url,
				type: 'POST',
				data : { return_json : 1,acao_h : 1 , get_img_type : 3, img_base64 : base64_url ,user_id : common_function.get_local_poco_id() },
				dataType: 'json',
				timeout : wo_config.upload_timeout,
				xhr: function() 
				{
					var xhr = $.ajaxSettings.xhr()
					
					xhr.upload.addEventListener('progress', function(ev) 
					{
						var percent = parseInt( (ev.loaded / ev.total) * 100 )
						
						_page_view.find('.upload_percent').html(percent + '%')											
												
						
					}, false)
					
					return xhr
				},
				success : function(data)
				{
					upload_img_finish = true
					_page_view.find('.upload_tips').hide()
					
					var fullurl = common_function.matching_img_size(data.item_url,'mm')

					_page_view.find('.publish_img_output').attr('src',fullurl).show()
					
					_page_view.find('.upload-img').css({"background-color":"#fff"})  	
				},
				error:function()
				{
					_page_view.find('.upload_tips').hide()

					new_alert_v2.show({text:"上传图片失败",type : "info", append_target : _page_view , auto_close_time : 2000});
				}
			})
		}

		
		options.events = {

			"tap .ui-btn-prev-wrap": function() 
			{				
                page_control.back()    
			},
            'tap .no_login' : function()
			{
				if(page_control.page_transit_status()) return false

				page_control.navigate_to_page("login")
			},
			//上传头像处理
			"change .publish_img_file" : function(event)
			{	
				var file_obj = event.currentTarget
				var img_file = file_obj.files[0]

				
				_page_view.find('.upload_tips').show()
                
				_page_view.find('.upload-img').css({"background-image":"none","background-color":"#eef0ee"})
                
                img_process.start_img_process(img_file,{ type : img_file.type },function(base64_url)
				{
					upload_base64_img_action(base64_url)
					
					
				})
			},
            'click [data-nav_to_publish]' : function()
            {
                if( !img_process.can_web_upload_img() )
                {
                    return;
                }
            
                _page_view.find('.publish-nophoto').show()   
                _page_view.find('.decoration').hide()   
            },
			"click .btn-send" : function(ev)
			{
				if(!upload_img_finish)
				{
					new_alert_v2.show({text:"请先选择要上传的照片",type : "info",append_target : _page_view,auto_close_time : 2000});
                    
					return
				}
                
                if(btn_send_tag || have_succeed)
                {                    
                    return
                }
                
                btn_send_tag = true

				var that = this
				var img_url = that.$el.find('.publish_img_output').attr('src')
				var text = that.$el.find('[data-publish_text]').val()
                var cur_btn = $(ev.currentTarget)

                
                cur_btn.find("span").text("发送中...")
				
				var succeed_alert = require("new_alert_v2")
				

				common_function.send_request({
					url: wo_config.ajax_url.publish,
					data: 
					{
						img_url: img_url,
						nick_name_arr : nick_name_arr,
						user_id_arr : user_id_arr,
						text: text,
						xcoordinate : longitude,
						ycoordinate : latitude
					},
					callback: function(data) 
					{
						if(data.result==1)
						{		
							have_succeed = true
                            
                            var refresh_url = "http://" + location.host + location.pathname + "?" + parseInt(new Date().getTime())  
							
							new_alert_v2.show({text:"发布成功", is_cover:true ,auto_close_time : 2000,append_target : _page_view,closed_callback:function()
                            {
                                btn_send_tag = false;                                                                
                                
                                if(_state && _state.link_type=="theme_special")
                                {
                                    location.href =  refresh_url+"#user_profile/"+poco_id
                                    
                                    return; 
                                }
                                
                                nick_name_arr = [];
                                
                                user_id_arr = [];
                                
                                
								//跳转操作
                                if(_state && _state.page_from_url)
                                {   
                                    location.href =  _state.page_from_url 
                                }
                                else
                                {
                                    page_control.back() 
                                }
                                
                                
                            }})
                                                                                           
						}		
                        else
                        {
                           succeed_alert.close(true);
                            
                           new_alert_v2.show({text:"发布失败",auto_close_time : 2000,append_target : _page_view,closed_callback:function()
                           {
                                btn_send_tag = false;
                                                                    
                           }});    
                        }
                        
                        cur_btn.find("span").text("发送")
                                                										
					},
					error: function() 
					{
						succeed_alert.close(true)
						btn_send_tag = false
                        
                        cur_btn.find("span").text("发送")
					}
				})	
			},
			'tap .upload-img' : function()
			{
				app_function.app_get_picture( {'width':990 } ,function(response)
				{  

					//alert(response.code)
					if(response.code == "0000")
					{
						_page_view.find('.upload_tips').show()                            							

						_page_view.find('.upload-img').css({"background-image":"none","background-color":"#eef0ee"})

						
						var base64_url = "data:image/jpeg;base64," + response.image

						upload_base64_img_action(base64_url)
					}
				})
			},
			'tap [camera_action_shot]' : function()
			{
				if(_state && _state.camera_sharestr)
				{
					var sharestr = encodeURIComponent(_state.camera_sharestr)
				}
				else
				{
					var sharestr = ""
				}

				window.location.href = 'PocoCamera://action_shot/?sharestr='+sharestr
			},
			'tap [camera_action_album]' : function()
			{
				if(_state && _state.camera_sharestr)
				{
					var sharestr = encodeURIComponent(_state.camera_sharestr)
				}
				else
				{
					var sharestr = ""
				}

				window.location.href = 'PocoCamera://action_album/?sharestr='+sharestr
			},			
            //表情层
            'tap .select-emotion' : function()
            {
                var emotion_btn_obj = _page_view.find('.select-emotion em')

                var is_emotion_open = emotion_btn_obj.hasClass('active_icon')

                if (is_emotion_open)
                {
                    emoticon_layer_control(false)

                }
                else
                {
                    emoticon_layer_control(true)
                    
                    if(topic_txt_module_obj)
                    {
                        topic_layer_control(false)    
                    }
                    
                    
                }

                if (ua.isIDevice)
                {
                    _page_view.find('textarea').blur()
                }
            },
            //关键字层
            'tap .select-topic' : function()
            {
                var select_topic_icon_obj = _page_view.find('.select-topic-icon')

                var is_topic_icon_open = select_topic_icon_obj.hasClass('active')
                
                var select_topic_icon_obj = _page_view.find('.select-topic-icon')
                
                select_topic_icon_obj.addClass('active')
                
                if(!topic_txt_module_obj)
                {
                    alert_tips = new_alert_v2.show({text:"正在加载话题",type:"loading",is_cover:false , append_target :_page_view })
                    
                    common_function.send_request
                    ({
                        url: wo_config.ajax_url.get_topic_txt_list,
                        data: 
                        {
                            t: parseInt(new Date().getTime())                    
                        },
                        callback: function(data) 
                        {
                            // 话题模块
                            topic_txt_module_obj = new topic_txt_module
                            ({
                                data : data.result_data, 
                                history_data : window.localStorage.getItem('record_topic_arr'),
                                click_topic_txt_callback : function(topic_txt)
                                {
                                   
                                    var textarea = _page_view.find("[data-publish_text]");
                
                                    var val = textarea.val();
                
                                    val += topic_txt
                
                                    textarea.val(val)
                                },
                                click_more_callback : function()
                                {
                                    var textarea = _page_view.find("[data-publish_text]");
                                    
                                    page_control.navigate_to_page("publish_more_topic",
                                    {
                                        textarea : textarea
                                    })
                                }
                            })
                            
                            _page_view.find("[data-topic_txt_wrapper]").html(topic_txt_module_obj.$el)
                            
                            // 加载模块成功
                            if (is_topic_icon_open)
                            {
                                topic_layer_control(false)
            
                            }
                            else
                            {
                                topic_layer_control(true)
                                
                                if(emoticon_module_obj)
                                {
                                    emoticon_layer_control(false)    
                                }
            
                            }
                            
                            alert_tips.close();
                        },
                        error: function() 
                        {
                            topic_txt_module_obj = null
                            
                            alert_tips.close();
                        }
                    })
                }
                else
                {
                    // 加载模块成功
                    if (is_topic_icon_open)
                    {
                        topic_layer_control(false)
    
                    }
                    else
                    {
                        topic_layer_control(true)
                        
                        if(emoticon_module_obj)
                        {
                            emoticon_layer_control(false)    
                        }
    
                    }
                }
            },
            'tap .at-emotion' : function()
            {                
                
                page_control.navigate_to_page("get_friends_list/from_at",
                {
                    textarea : _page_view.find("[data-publish_text]"),
                    at_params : at_params                   
                });
            }
		}

		
		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
		}
        
		
		var upload_img_finish
        var _state 
        var _page_view
        var poco_id
        var emoticon_module_obj
        var topic_txt_module_obj
        var longitude = 0
		var latitude = 0
		
		options.page_before_show = function(page_view, params_arr, state)
		{
			if(topic_txt_module_obj)
			{
				topic_txt_module_obj.refresh(JSON.parse(window.localStorage.getItem('record_topic_arr')))
			}
			
		}
		
		
		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			_state = state || {}
			_page_view = $(page_view.el)  
			
			//返回按钮
			var page_back_btn_container = $(page_view.el).find('header')
			var page_back_btn = require('page_back_btn')();
			page_back_btn_container.prepend(page_back_btn.$el)
			
			var poco_id = common_function.get_local_poco_id()

			var is_embedded = cookies.readCookie('cok_framename')

			if(is_embedded!=null && is_embedded!="")
			{
				_page_view.find('.frame_publish').show()   
				_page_view.find('.publish-nophoto').hide()   
                _page_view.find('.decoration').hide()   
				
				
				var keyword = _state.key_word

				//POCO相机自动绑定POCO  add by manson 2013.8.29
				common_function.bind_poco_in_camera(true)
			}
			else
			{
				
				//未登录处理
				if(poco_id<=0)
				{
					new_alert_v2.show({ text:"尚未登录",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
						
						page_control.back()
					}})

					return false
				}

				
				app_function.get_app_coordinate(function(response)
				{
					if(response.code == "0000")
					{
						longitude = response.longitude
						latitude = response.latitude
					}
					
				})

			
				upload_img_finish = false

				//传入的关键字
				if(_state && _state.key_word != null)
				{
					_page_view.find("[data-publish_text]").val("#"+_state.key_word+"#")
				}

				
				//容器滚动
				/*var main_wraper = $(page_view.el).find('.main_wraper')

				var view_scroll = require('scroll')
				view_scroll_obj = view_scroll.new_scroll(main_wraper,{
					'view_height' : common_function.container_height_with_head()
				})*/

                
				//自己内嵌的app 
				if( app_function.is_world_app() )
				{
					$(page_view.el).find('.publish_form').hide()

					$(page_view.el).find('.publish-nophoto').show()   
					$(page_view.el).find('.decoration').hide() 
				}
				else
				{
					//兼容性处理  modify by manson 2013.7.11
					if( !img_process.can_web_upload_img() )
					{
						$(page_view.el).find('.no_support_upload').show()
						$(page_view.el).find('[data-nav_to_publish]').removeClass("footer_btn_style").addClass("cancel_btn")

						return false
					}
					

					$(page_view.el).find('.publish-nophoto').show()   
					$(page_view.el).find('.decoration').hide() 

					// uc浏览器时特殊处理  modify by manson 2013.7.11         
					if(ua.isAndroid && ua.is_uc)
					{                
						_page_view.find('[data-for_no_android_uc_file]').hide()
						_page_view.find('[data-for_android_uc_file]').show()
					}
					else
					{
						_page_view.find('[data-for_no_android_uc_file]').show()
						_page_view.find('[data-for_android_uc_file]').hide()
					}
				}
			}
			
			//表情模块
            emoticon_module_obj = new emoticon_module(
            {
                emotion_wraper_height : window.innerHeight - 120 - 52 - 55,
                click_icon_callback : function(emoticon_str)
                {
                    var textarea = _page_view.find("[data-publish_text]");

                    var val = textarea.val();

                    val += emoticon_str

                    textarea.val(val)
                }
            })
            
            _page_view.find(".comment-page").after(emoticon_module_obj.$el)
		}
		
		function emoticon_layer_control(show)
        {
            var emotion_btn_obj = _page_view.find('.select-emotion em')

            if (show)
            {
                emoticon_module_obj.show()                

                emotion_btn_obj.addClass('active_icon')
            }
            else
            {
                emoticon_module_obj.hide()

                emotion_btn_obj.removeClass('active_icon')
            }
        }
        
        function topic_layer_control(show)
        {
            var select_topic_icon_obj = _page_view.find('.select-topic-icon')
            
            if(show)
            {
                topic_txt_module_obj.show();
                
                select_topic_icon_obj.addClass('active')
            }
            else
            {
                topic_txt_module_obj.hide();
                
                select_topic_icon_obj.removeClass('active')
            }
        }
        
        function at_params(user_id,nick_name,at_name)
        {
            user_id_arr.push(user_id)
            nick_name_arr.push(nick_name)
            at_name_str = at_name
            
            var val = _page_view.find("[data-publish_text]").val()
                                
            val += at_name
            
            _page_view.find("[data-publish_text]").val(val)
            
            console.log(_page_view.find("[data-publish_text]").val())

        }

		var page = require('page').new_page(options);
		
		return page;
	}
	
})

if(typeof(process_add)=="function")
{
	process_add()
}