define("wo/cmt",['base_package','frame_package',"btn_package","wo_config","commom_function","get_template","new_alert_v2","emoticon_module"],function(require, exports) {
    var $ = require("zepto");
    var wo_config = require("wo_config");
    var page_control = require("page_control");
    var Backbone = require("backbone");
    var common_function = require("commom_function");
    var Mustache = require("mustache");
    
	var new_alert_v2 = require("new_alert_v2")
	var ua = require('ua')
	var can_cmt = 1
    var can_cmt_des = "";
    var normal_cmt_des = "";
    
    var emoticon_module = require("emoticon_module");
    
	
	exports.route = {
		"cmt/:query(/:from_world_daliy)": "cmt"
	}

	exports.new_page_entity = function()
	{
		var options = {
			route: {
				"cmt/:query(/:from_world_daliy)": "cmt"
			},
			transition_type: "slideup",
			dom_not_cache: true,
			ignore_exist: true
		};

		// 列表子项对象
		var cmt_list_item_model = Backbone.Model.extend({
			defaults: {
				cmt_id: "",
				content: "",
				cover_img_url: "",
				reply_user_id: "",
				reply_user_name: "",
				user_id: "",
				user_name: "",
				user_icon: "",
				add_time: ""
			}
		});
		var page_count = 20;
		//cmt数据重新整合  modify by manson 2013.5.10
		var collection_options = {
			ajax_load_finish: function(model, response, ajax_failed) {
				cmt_list_view_obj.more_btn_reset();
				refresh_btn.reset();

				if(response==null) return
                
				if (response.cmt_list == false || response.cmt_list.length < page_count) {
					cmt_list_view_obj.hide_more_btn();
				}
                
                can_cmt = response.can_cmt
                
                if(response.can_cmt == 0)
                {                    
                    cur_page_view.find("textarea").attr({"placeholder":can_cmt_des})
                    
                    cur_page_view.find(".send-btn").addClass("disable")
                }
                else if(response.can_cmt == 1)
                {                    
                    cur_page_view.find(".send-btn").removeClass("disable")
                }
			},
			before_refresh: function() {
				refresh_btn.loadding();
			},
			before_get_more: function() {
				cmt_list_view_obj.more_btn_loading();
			}
		}
		// 列表数据集
		var cmt_list_collection = Backbone.Collection.extend({
			model: cmt_list_item_model,
			refresh: function(is_real_data) {
				var art_id = _params_arr[0];
																
				collection_options.data = {
					art_id: art_id,
					from_world_daliy : from_world_daliy
				};

				if(typeof(is_real_data)!="undefined")
				{
					collection_options.data.is_real_data = 1
				}
				
				common_function.collection_refresh_function.call(this, collection_options);
			},
			get_more_item: function() {
				var art_id = _params_arr[0];
				collection_options.data = {
					art_id: art_id,
                    from_world_daliy : from_world_daliy
				};
				common_function.collection_get_more_function.call(this, collection_options);
			},
			url: function()
			{			    
			   
			    return wo_config.ajax_url.cmt  
			},			
            parse: function(response) 
			{
				if(response && typeof(response.cmt_list)!="undefined")
				{				    
				    
					return response.cmt_list
				}
				else
				{
					return response
				}
			}
		})
		
		var reply_cmt_id = 0
		// 列表子项视图
		var cmt_item_view = Backbone.View.extend({
			tagName: "div",
			className: "border-btm",
			initialize: function() {
			 
			   
			    var model_data = this.model.toJSON()
				
			    this.reply_user_id = model_data.reply_user_id
				this.user_id = model_data.user_id
				this.cmt_id = model_data.cmt_id
				this.user_name = model_data.user_name
                this.cmt_can_delete = model_data.cmt_can_delete
				this.user_sex = model_data.user_sex

			    var sex_class = ""
				//用户性别
				if(this.user_sex == "男")
				{
				    sex_class = "icon-male"
				}
				else if(this.user_sex == "女")
				{
				    sex_class = "icon-female"
				}
				
				var template = '<table border="0" cellspacing="0" cellpadding="0"><tr><td width="35" data-user_profile_anchor ><div class="user-img middle-center" ><img src="{{user_icon}}" class="max-width-height" /></div></td> <td> <div class="user-info" data-reply_btn data-cmt_id={{cmt_id}} style="position: relative;"><div style="text-align:center;width: 40px;position: absolute;right: 0;bottom: 0;height: 23px;display:none" data-del_btn><span class="ui-icon-delete radius-2px"><em class="icon-delete icon-bg-common"></em></span></div> <div class="clearfix" style="line-height:12px"><span class="name lh16 fl">{{user_name}}</span><em style="margin-top:0" class="sex_icon icon-bg-common ' + sex_class + '"></em></div><p class="txt lh20 mt5 mb5">{{#reply_user_name}} 回复 <span class="name">{{reply_user_name}}</span>：{{/reply_user_name}}{{{content}}}</p><div class="clearfix mt5"> <time class="time font-arial fl">{{add_time}}</time> <span class="icon icon-bg-common fr"></span> </div> </div>     </td> </tr> </table>';

				var html = Mustache.to_html(template, model_data)
				$(this.el).html(html);
			},
			events : {
				//回复人的头像
				"tap [data-user_profile_anchor]": function(event) 
				{
					page_control.navigate_to_page("user_profile/" + this.user_id)
				},
                "tap poco_at": function(ev) 
				{
				    var cur_btn = $(ev.currentTarget);
                    
					page_control.navigate_to_page("user_profile/" + cur_btn.attr("user_id"))
				},
				"tap [data-reply_btn]": function(evt) 
				{
					if(page_control.page_transit_status()) return false
                    
                    if(can_cmt == 0)
                    {
                        return;
                    }    
                    
                    if(em_list_show_tag)
                    {
                        return;
                    }
                    					                                                             
					var content = cur_page_view.find("textarea");
					var reply_name = $(event.currentTarget).find(".name").html();
                    
                    content.val("");
					content.attr("placeholder", "回复 :" + this.user_name)

					reply_cmt_id = this.cmt_id
				},
				//删除评论
				"hold" : function(ev)
				{
					 if(this.cmt_can_delete == 1)
                     {
                        console.log('delete')
                        
                        cur_page_view.find("[data-del_btn]").hide();
                        $(ev.currentTarget).find("[data-del_btn]").show();                                  
                     }
				},
                
                'tap [data-del_btn]' : function(ev)
                {                         
                    
                    var art_id = _params_arr[0]
                    var cmt_id = this.cmt_id
					var reply_user_id = this.reply_user_id
					var user_id = this.user_id
                    
					var delete_tips = new_alert_v2.show({ text:"删除中",type : "loading",is_cover:true,append_target:cur_page_view})

                    common_function.send_request
                    ({
                        url : wo_config.ajax_url.del_cmt,
                        data : { reply_user_id : reply_user_id , user_id : user_id , art_id : art_id , cmt_id : cmt_id ,from_world_daliy:from_world_daliy,t : parseInt(new Date().getTime())},
                        callback : function(data)
                        {   
							delete_tips.close()

                            if(data.ret_code == 1)
                            {   
								new_alert_v2.show({ 
									text:"已删除留言",
									type : "success" ,
									is_cover:true,
									auto_close_time : 1000,
									closed_callback : function()
									{
										cur_page_view.find("textarea").attr("placeholder", "写评论...")
										cmt_list_collection_obj.refresh()
									}
								})
                            }
                            else
                            {
								new_alert_v2.show({ 
									text:"删除失败",
									type : "info" ,
									auto_close_time : 1000
								})
								
                            }
                        }
                    })
                }
			}
		})

		// 列表视图
		var cmt_list_view = Backbone.View.extend({
			initialize: function() {
				var that = this;
				//加载更多按钮   
				var load_more_btn = require("load_more_btn")();
				load_more_btn.$el.css({
					height: "auto"
				});
                
                load_more_btn.$el.removeClass("pb15")
                
				//没有底部时
				$(this.el).parent().append(load_more_btn.$el);
				that.load_more_btn = load_more_btn;
				this.load_more_btn.hide();
			},
			add_list_item: function(item_view) {
				$(this.el).append(item_view.$el);
				this.load_more_btn.show();
			},
			clear_list: function() {
				$(this.el).html("");
				this.load_more_btn.hide();
			},
			hide_more_btn: function() {
				this.load_more_btn.hide();
			},
			more_btn_loading: function() {
				this.load_more_btn.loadding();
			},
			more_btn_reset: function() {
				this.load_more_btn.reset();
			},
			show_more_btn: function() {
				this.load_more_btn.reset();
			}
		});
		options.initialize = function() {
			//loading.show_loading();
			this.render();
		};
		options.render = function() {
			var template_control = require("get_template");
			var template_obj = template_control.template_obj();
			var init_html = template_obj.cmt_list;
			this.$el.append($(init_html));
		};
		var cmt_send_tag = false;
		
		var poco_id;
        
        var em_list_show_tag = false;
        
		
		options.events = {
			"tap .ui-btn-prev-wrap": function(ev) {

				page_control.back();
			},
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{
					page_control.back()
				}
			},
            'tap .at-emotion' : function()
            {
                var art_id = _params_arr[0];
                
                page_control.navigate_to_page("get_friends_list/from_at",
                {
                    textarea : cur_page_view.find("textarea"),
                    at_params : at_params                   
                });
            },
			//刷新
			"tap .ui-btn-refresh-wrap": function() {
				if(page_control.page_transit_status()) return false
				cmt_list_collection_obj.refresh();
			},
			"tap .data-more_btn": function() {
				if(page_control.page_transit_status()) return false
				cmt_list_collection_obj.get_more_item();
			},            
			// 发送评论
			"tap .send-btn": function(event) 
			{

				if(page_control.page_transit_status()) return false                                   
                
                if(can_cmt == 0)
                {
                    return;
                }                                             	   
                
				poco_id = common_function.get_local_poco_id();
				if (poco_id == 0) {
					page_control.navigate_to_page("login");
					return;
				}
				if (cmt_send_tag) {
					return;
				}
				cmt_send_tag = true
				var art_id = _params_arr[0];
				var content = cur_page_view.find("textarea");
				var cur_btn = $(event.currentTarget)
				
				
				if(content.val()=="")
				{
					new_alert_v2.show({ text:"留言失败，留言为空",type : "info" ,auto_close_time : 20000 })

					cmt_send_tag = false;
					return;
				}
				
				cur_btn.text("发送中...")

				send_cmt({
					art_id: art_id,
					cmt_id: reply_cmt_id,
					content: content.val(),
                    user_id_arr : user_id_arr,
                    nick_name_arr : nick_name_arr,
					success: function(data) {
						if (data.result > 0) 
						{
							
							cmt_list_collection_obj.refresh(true);
							//交互操作
							view_scroll_obj.scroll_to(0);
							content.val("");
                            
                            user_id_arr = [];
                            
                            nick_name_arr = [];
						} 
						else if (data.result == -1) 
						{    
							new_alert_v2.show({ text:"留言失败",type : "info" , auto_close_time : 2000})
							
						} 
						else if (data.result == -2) 
						{                        
							new_alert_v2.show({ text:"抱歉！不能重复留言",type : "info" , auto_close_time : 2000})
						} 
                        else if (data.result == -3) 
						{                        
							new_alert_v2.show({ text:"抱歉！您还没有发布过作品，不能留言",type : "info" , auto_close_time : 2000})
						} 
						else 
						{
							new_alert_v2.show({ text:"留言失败",type : "info" , auto_close_time : 2000})
						}
						
						

						reply_cmt_id = 0
						cur_btn.text("发送");
						content.attr("placeholder", "写评论...")
						content.blur();
						cmt_send_tag = false
					},
					error: function() 
					{
						

						cmt_send_tag = false;
						cur_btn.text("发送");
					}
				});
			},
			//评论层
            'tap .select-emotion' : function()
            {                
                if(can_cmt == 0)
                {
                    return;
                }
                
				var emotion_btn_obj = cur_page_view.find('.select-emotion em')
				
				var is_emotion_open = emotion_btn_obj.hasClass('active_icon')

				if(is_emotion_open)
				{
					emoticon_layer_control(false)
				}
				else
				{
					emoticon_layer_control(true)
				}

				if(ua.isIDevice)
				{
					cur_page_view.find('textarea').blur()
				}
            }
		}
		
		

		options.window_change = function(page_view) 
		{
			var cmt_height = window.innerHeight - cur_page_view.find('.top_set').height() - 45 - 10			//10是间距			
			var list_container = $(page_view.el).find(".list-comment");
			list_container.css("height", cmt_height);
		}

		options.page_show = function(page_view, params_arr) {
		   
			// 重置所有回复按钮
			$(page_view.el).find("[data-reply_btn]").attr("selected_cmt", 0);
			_params_arr = params_arr;   
   
            if(can_cmt != 0 )
            {
                // 避免文本框聚焦误操作
                $(page_view.el).find("textarea").removeAttr("readonly")    
            }

			
		}
        
        
        
		var view_scroll_obj;
		var cmt_list_collection_obj;
		var cur_page_view;
		var _params_arr;
		var cmt_list_view_obj;
		var _state;
		var refresh_btn;
		var _selection_pos = 0
        var nick_name_arr = []
        var user_id_arr = []
        var emoticon_module_obj
        var at_name_str = ""
        var from_world_daliy 
        var cmt_list_url = ''
        
		//页面初始化时
		options.page_init = function(page_view, params_arr, state) {
			
			cur_page_view = $(page_view.el);
			_params_arr = params_arr;
			_state = state;						
			
			if(params_arr[1]&&params_arr[1].toString()=='from_world_daliy')
			{
				// 处理日报的评论列表接口				
				
				from_world_daliy = 1
			}
			else
			{
				// 正常文章的评论列表接口
				
				from_world_daliy = 0
			}
			
			
			
			//刷新按钮  add by manson 2013.5.7
			refresh_btn = require("refresh_btn")();
			page_view.$el.find(".header").append(refresh_btn.$el)
            
            can_cmt_des = cur_page_view.find("textarea").attr("data-can_cmt_des")
            normal_cmt_des = cur_page_view.find("textarea").attr("place_holder")


			//评论内容滚动
			var view_scroll = require("scroll")
			var list_container = $(page_view.el).find(".list-comment")
			var cmt_height = window.innerHeight - cur_page_view.find('.top_set').height() - 45 - 10			//20是间距
            
            /**/
			view_scroll_obj = view_scroll.new_scroll(list_container, {
				view_height: cmt_height
			})
            
            //表情模块
		    emoticon_module_obj = new emoticon_module
            ({
                click_icon_callback : function(emoticon_str)
                {
                    var textarea = cur_page_view.find("textarea");
                    
                    var val = textarea.val();
                    
                    val += emoticon_str
                    
                    textarea.val(val)
                }
            })
            
            cur_page_view.find(".top_set").after(emoticon_module_obj.$el) 
			

            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
            
			cmt_list_view_obj = new cmt_list_view({
				el: $(page_view.el).find(".list-comment-container")
			});
			// 初始化数据集
			cmt_list_collection_obj = new cmt_list_collection();
			//刷新列表监听
			cmt_list_collection_obj.bind("reset", re_render_list, page_view);
			//加载更多监听
			cmt_list_collection_obj.bind("add", add_render_list, page_view);
			cmt_list_collection_obj.refresh();
            
            
            if(can_cmt != 0)
            {
                // 对于其他页面链接到评论页面的处理        
    			if (typeof _state != "undefined") 
    			{
    				var reply_name = _state.nickname ? "回复 :" + _state.nickname : "写评论...";
    				reply_cmt_id = _state.cmt_id;
    				cur_page_view.find("textarea").attr("placeholder", reply_name);
    			}
            }
            

		}

		function re_render_list() 
		{

			if(cmt_list_collection_obj.models[0] && cmt_list_collection_obj.models[0].attributes.art_id == false)
			{
				new_alert_v2.show({ text:"作品不存在或已被原作者删除",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 2000 , closed_callback : function(){
					
					page_control.back()
				}})

				
				return false
			}

			var that = this;
			cmt_list_view_obj.clear_list();
			cmt_list_collection_obj.each(function(item_model) 
			{
				var item_view = new cmt_item_view({
					model: item_model
				});
				//每次add入列表
				cmt_list_view_obj.add_list_item(item_view);
			}); 
			
			emoticon_layer_control(false)

			//滚回顶部
			view_scroll_obj.scroll_to(0)
                        
		}

		function add_render_list(item_model) 
		{
			var item_view = new cmt_item_view({
				model: item_model
			});
			//每次add入列表
			cmt_list_view_obj.add_list_item(item_view);
		}


		function send_cmt(options) 
		{
			var art_id = options.art_id, cmt_id = options.cmt_id, content = options.content,
                user_id_arr = options.user_id_arr,
                nick_name_arr = options.nick_name_arr,
                success = options.success || function() {}, error = options.error || function() {};
			//请求调用通用接口  modify by manson 2013.5.10
			common_function.send_request({
				url: wo_config.ajax_url.add_cmt,
				data: {
					art_id: art_id,
					cmt_id: cmt_id,
                    user_id_arr : user_id_arr,
                    nick_name_arr : nick_name_arr,
					content: content,
					from_world_daliy : from_world_daliy,
					t: parseInt(new Date().getTime())                    
				},
				callback: function(data) {
					if (typeof success == "function") {
						success.call(this, data);
					}
				},
				error: function() {
					if (typeof error == "function") {
						error.call(this);
					}
				}
			});
		}


		function emoticon_layer_control(show)
		{
			var emotion_btn_obj = cur_page_view.find('.select-emotion em')

			if(show)
			{
				cur_page_view.find('.icon-emotion-32-bg').show()
				cur_page_view.find('.list-comment').hide()
				
				emotion_btn_obj.removeClass('icon').addClass('active_icon')
			}
			else
			{
				cur_page_view.find('.icon-emotion-32-bg').hide()
				cur_page_view.find('.list-comment').show()
				
				emotion_btn_obj.removeClass('active_icon').addClass('icon')
			}
		}
        
        function at_params(user_id,nick_name,at_name)
        {
            user_id_arr.push(user_id)
            nick_name_arr.push(nick_name)
            at_name_str = at_name
            
            var val = cur_page_view.find("textarea").val()
                                
            val += at_name
            
            cur_page_view.find("textarea").val(val)
            
            console.log(cur_page_view.find("textarea").val())

        }

        function emoticon_layer_control(show)
		{
			var emotion_btn_obj = cur_page_view.find('.select-emotion em')

			if(show)
			{
				emoticon_module_obj.show()
                
				cur_page_view.find('.list-comment').hide()
				
				emotion_btn_obj.removeClass('icon').addClass('active_icon')
			}
			else
			{
				emoticon_module_obj.hide()
				cur_page_view.find('.list-comment').show()
				
				emotion_btn_obj.removeClass('active_icon').addClass('icon')
			}
		}
        
		var page = require("page").new_page(options)
		return page;
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}