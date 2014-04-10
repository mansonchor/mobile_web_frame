//消息列表模块 modify by manson 2013.8.12
//目前只剩下留言、粉丝关注列表、好友推荐列表使用此模块  modify by manson 2013.10.23
define("wo/module/user_list_view",["base_package",'frame_package',"commom_function","wo_config"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    var wo_config = require('wo_config')
	var Mustache = require('mustache')
	var common_function = require('commom_function')
    var page_control = require('page_control')
	var new_follow_btn = require('follow_btn')()         
	
	
    var user_list_item_view = Backbone.View.extend
    ({
		tag : "div",
		className : "border-btm ",
        initialize : function(options) 
		{          
			//console.log(options)

		    var options = options || {}
			this.tpl_type = options.tpl_type
			this.model_data = options.model.attributes
			this.select_type = options.select_type

			this.render()
			
			var td_arr = this.$el.find('td')
			this.left_colume = td_arr.eq(0)
			this.center_colume = td_arr.eq(1)
			this.right_colume = td_arr.eq(2)

			
			this.start_generate()
		},
		events : {
			'tap [td_1]' : function()
			{
				var user_id = this.model_data.user_id

				if(!user_id) return 
            
				var btn_obj
				
				if(this.new_follow_btn_obj) 
				{ 
					btn_obj =  this.new_follow_btn_obj 
				}

				page_control.navigate_to_page("user_profile/"+user_id,{ follow_btn_obj : btn_obj })
			},
			'tap [td_2]' : function()
			{
				var that = this
				
				switch(that.tpl_type)
				{
					case "fans" :
					case "follow" : 
					case "recommend" : 
					case "search" :
					case "theme_join_user" : 
						var user_id = that.model_data.user_id
						
						if(user_id)
						{
							if(that.new_follow_btn_obj) 
							{ 
								btn_obj =  that.new_follow_btn_obj 
								
								page_control.navigate_to_page("user_profile/"+user_id,{ follow_btn_obj : btn_obj })
							}
							else
							{
								page_control.navigate_to_page("user_profile/"+user_id)
							}
							
						}

						break
					case "cmt" : 
						var art_id = that.model_data.art_id
						var cmt_id = that.model_data.cmt_id
						var nickname = that.model_data.nickname

						var cmt_info = 
						{
							cmt_id : cmt_id,
							nickname : nickname
						}
									
						page_control.navigate_to_page("cmt/"+art_id,cmt_info)
						break
				}
			},
			'tap [td_3]' : function()
			{
				var that = this
				
				switch(that.tpl_type)
				{
					case "cmt" : 
					
						var art_id = that.model_data.art_id
						
						if( common_function.is_empty(art_id) )
						{
							return false
						}
						
						page_control.navigate_to_page("last/"+art_id+"/from_profile")
						
						break
				}
			},
			'tap [invite_friend_btn]' : function(ev)
			{
				var that = this
				var cur_btn = $(ev.currentTarget);

				var relationship = that.model_data.relationship
				var account_type = that.model_data.account_type
				var receiver_uid = that.model_data.receiver_uid

				var poco_id = common_function.get_local_poco_id()    
				
				//var url = (relationship=="invite")?wo_config.ajax_url.invite_friend : wo_config.ajax_url.invite_friend_wo;// 区分poco的邀请action与新浪微博和腾讯微博的邀请action
				
				if(poco_id)
				{
					common_function.send_request
					({
						url : wo_config.ajax_url.invite_friend,
						data : { receiver_uid : receiver_uid , account_type : account_type }                
					})
					
					cur_btn.find("span").width(44);
					cur_btn.find("em").html("已邀请")
					cur_btn.find("em").addClass("selected")
				}
				
			}
		},
		render : function()
        {
			var init_html = '<table border="0"cellspacing="0"cellpadding="0"><tr><td valign="top" width="42" td_1></td><td td_2></td><td valign="top" width="40" td_3></td></tr></table>'

			this.$el.html(init_html)

		},
		set_left_colume_valign : function(pos)
		{
			this.left_colume.attr('valign',pos)
		},
		start_generate : function()
		{
			var that = this

			var account_type = that.model_data.account_type
			var nickname = that.model_data.nickname
			var partner_nickname = that.model_data.partner_nickname
			var user_icon = that.model_data.user_icon
			var relationship = that.model_data.relationship
			var user_id = that.model_data.user_id
			var content = that.model_data.content
            var user_sex = that.model_data.user_sex
            var issue_title = that.model_data.issue_title
		
            var issue_count = that.model_data.issue_count
	
	
			switch(that.tpl_type)
			{
				//粉丝 & 关注
				case "fans" :
				case "follow" : 
					that.set_left_colume_valign('middle')

					var left_colume_content = '<div class="user-img"><img  src="'+that.model_data.user_icon+'"></div>'
					var center_colume_content = '<span class="add_touch_range pt10 pb10">'+that.model_data.nickname+'</span>'
					break

				//好友推荐 & 搜索
				case "recommend" : 
				case "search" :
					
					
					//中间内容
					if(that.select_type=="world")
					{
						if(account_type == 'sina')
						{
							var weibo_type = "新浪微博："
						}
						else if(account_type == 'qq')
						{
							var weibo_type = "腾讯微博："
						}
						else if(account_type == 'official')
						{
							var weibo_type = ""
						}
						else if(account_type == 'poco')
						{
							var weibo_type = "POCO好友"
							var partner_nickname = ""
						}
						else
						{
							var weibo_type = "世界好友："
						}

						var center_colume_template = '<div class="user-info"><p class="txt"><span class="name">{{nickname}}</span></p><p class="des">{{weibo_type}}{{partner_nickname}}</p></div>'

						var center_colume_content = Mustache.to_html(center_colume_template, { nickname : nickname , partner_nickname : partner_nickname , weibo_type : weibo_type })	
					}
					else
					{
						var center_colume_content = '<div class="user-info"><p class="txt"><span class="name">'+partner_nickname+'</span></p></div>'
					}
					
					//左侧头像
					var left_colume_content = '<div class="user-img"><img  src="'+user_icon+'"></div>'
					

					//右侧按钮
					if(relationship=="invite" || relationship=="invite_wo")
					{
						var right_colume_content = '<div invite_friend_btn><span class="ui-icon-item-wrap dib ml20 lh22 tc border-style-d2 f10 radius-2px"><em class="ui-icon-invite radius-2px fsn w-100 h-100 bgc-24b-2a8">邀请</em></span></div>'
					}
					else
					{
						var new_follow_btn_obj = new new_follow_btn
						({
							status : relationship,
							user_id : user_id,
							//区分关注按钮是哪个第三方的，为了统计 add by manson 2013.7.4
							account_type : account_type
						})

						that.new_follow_btn_obj = new_follow_btn_obj

						var right_colume_content = new_follow_btn_obj.$el
					}
					

					//针对banner特殊处理 modify by manson 2013.8.12
					if(that.model_data.world_banner==1)
					{
						that.$el.attr('world_banner',1)
					}

					if(that.model_data.recommend_banner==1)
					{
						that.$el.attr('recommend_banner',1)
					}

					break
					
			     

				//留言通知
				case "cmt" : 
					
					var cover_img_url = common_function.matching_img_size(that.model_data.cover_img_url,"ms")	  
					var add_time = that.model_data.add_time
					
					var left_colume_content = '<div class="user-img"><img  src="'+user_icon+'"></div>'
					
					
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
	

					var center_colume_content = '<div class="user-info"><div class="clearfix"><span class="name lh16 fl">'+nickname+'</span><em class="sex_icon icon-bg-common ' + sex_class + '"></em></div><p class="txt lh20 mt5 mb5 cmt_content">'+content+'</p><div class="clearfix"><time class="time font-arial fl">'+add_time+'</time></div></div>'
					
					var right_colume_content = '<div class="comment-img"><img src="'+cover_img_url+'" style="width:32px;height:32px" class="img_buffer_bg"></div>'
                    			 
				   
					break       
				case "theme_join_user" : 
					
					console.log(that.model_data)

					//左侧头像
					var left_colume_content = '<div class="user-img"><img  src="'+user_icon+'"></div>'

					if(user_sex == "男")
					{
						sex_class = "icon-male"
					}
					else if(user_sex == "女")
					{
						sex_class = "icon-female"
					}
					
					//地区字符串合并处理  add by manson 2013.9.4
					if( that.model_data.location_city == that.model_data.location_province || common_function.is_empty(that.model_data.location_city) )
					{
						var location_string = that.model_data.location_province
					}
					else
					{
						var location_string = that.model_data.location_province + "·" + that.model_data.location_city
					}

					if(common_function.is_empty(location_string))
					{
						location_string = ""
					}


					var center_colume_content = '<h4 class="clearfix mb5"><span class="color333 fl" style="line-height:14px;">'+nickname+'</span><i class="sex_icon fl icon-bg-common '+sex_class+'"></i></h4><span class="time font-arial color999">'+ location_string +'</span>'


					var new_follow_btn_obj = new new_follow_btn
					({
						status : that.model_data.relationship,
						user_id : that.model_data.user_id,
						//区分关注按钮是哪个第三方的，为了统计 add by manson 2013.7.4
						account_type : "theme_join"
					})

					that.new_follow_btn_obj = new_follow_btn_obj

					var right_colume_content = new_follow_btn_obj.$el
			}

			
			that.left_colume.html(left_colume_content)
			that.center_colume.html(center_colume_content)
			that.right_colume.html(right_colume_content)
			
		}
		
    })
    
    return user_list_item_view
})

if(typeof(process_add)=="function")
{
	process_add()
}