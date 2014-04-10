define('wo/user_profile',["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","new_alert_v2","show_big_img","world_list_module","select_module","popup","interact_module","app_function"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
    var wo_config = require('wo_config')
	var new_alert_v2 = require("new_alert_v2")
    var show_big_img = require("show_big_img")
    var iscroll_class = require('iScroll') 
    var ua = require('ua')
    var popup = require('popup')
    var app_function = require('app_function')
    

	function new_page_entity()
	{
		var _page_view
		var view_scroll_obj
		var user_profile_collection_obj
		var photowall_controler
		var cur_page_view
		var user_profile_refresh_btn
		var user_profile_model_obj
		var first_refresh
		var follow_btn
		var _state
		var page_index
		var _params_arr
        var user_id 
		var world_list_module_obj
        var category_list_scroll_obj
        var box_count = 0
        var login_id = common_function.get_local_poco_id()        
		var alert_tips
        var click_message_tag = false;
        var sizes ; // 屏宽-页面边距-每个小方图的边距 - 最右露出距离
        var user_info_tag = 1;
        
		var options = {
			route : { "user_profile/:query(/from_:source)": "user_profile" },
			title : '个人主页',
			route : { "user_profile/:query": "user_profile" },
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : false
		}

		options.initialize = function()
		{
			this.render();
		}

		options.render = function()
		{
			var template_control = require('get_template')
			
			var template_obj = template_control.template_obj()
			
			var init_html = template_obj.user_profile;			

			this.$el.append($(init_html))
		}		                

        
        options.page_hide = function()
        {
            interact_module_view_obj.hide()
        }
        
		var life_show_scrolling = false 
		options.events = {
			
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc && !life_show_scrolling)
				{				    				    
					
                    page_control.back()
				}
			},
			'tap .ui-btn-prev-wrap' : function(ev)
			{			     
				page_control.back()
			},
            'tap [data-to_user_photo]': function()
            {
                var user_id = _params_arr[0];
                page_control.navigate_to_page("#user_photo/"+user_id);
            },
			//粉丝和关注列表
			'tap [data-user_list]' : function(event)
			{
				if(page_control.page_transit_status()) return false
				if(_page_view.page_lock) return false
																
				var nick_name = cur_page_view.find("[user_name]").html();
				
				var state = 
				{					
					nick_name : nick_name 
				}   
				
				var user_id = _params_arr[0];
				
				page_control.navigate_to_pae(tap_tag+"/"+user_id,state);
			},
            // 点击头像放大图
            'tap [data-show_big_img]' : function(ev)
            {
                if(page_control.page_transit_status()) return false
				if(_page_view.page_lock) return false
                
                var cur_img = $(ev.currentTarget).find("img")
                
				
				var re = /_\d+./g;             
				var big_user_icon = cur_img.attr("src").replace(re, ".") 
                show_big_img.show({ append_target : cur_page_view,img_url : big_user_icon })
				

				var ajax_stat_url = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/check_user_big_icon?tmp="+parseInt(new Date().getTime())

				var stat_img = new Image()
				stat_img.src = ajax_stat_url
            },
			// 点击到切换照片、资料、成就列表
			'tap [data_select_type]' : function(ev)
			{
				cur_type = $(ev.currentTarget).attr("data_select_type")												
                
                if($(ev.currentTarget).hasClass("cur"))
                {
                    switch(cur_type)
                    {
                        case "photos":
                             world_list_module_obj.start_reset();      
                             break;
                        case "profile":
                             user_profile_view_obj = null;
                             break;
                        case "achievement":
                             user_achievement_view_obj = null
                             break;                             
                    }
                }
                
				control_switch(cur_type)
			},  
            // 点击到门牌列表
            'tap [data-to_doorplate_list]' : function(ev)
            {
                if(page_control.page_transit_status()) return false
				if(cur_page_view.page_lock) return false
                
                var user_id = _params_arr[0]
                var nick_name = cur_page_view.find("[user_name]").html();
                
                page_control.navigate_to_page("doorplate_list/"+user_id,{nick_name : nick_name})
            },
			// 点击私信按钮弹出私信入口
			'tap .ui-btn-letter' : function()
			{
				interact_module_view_obj.show()
	
			},
			'tap [data-doorplate_last]' : function(ev)
			{
			    var cur_btn = $(ev.currentTarget)     
			    
			    var data_doorplate_id = cur_btn.attr("data-doorplate_last");
			    
			    var user_id = _params_arr[0]
			    
			    page_control.navigate_to_page("doorplate_last/"+data_doorplate_id+"/"+user_id);  
			},
			'tap [data-charm_rank_des]' : function()
			{			    
			    show_tips_layer("收到礼物，获得喜欢和粉丝，都能提升魅力值");
			},
			'tap [data-expense_rank]' : function()
			{
			    show_tips_layer("送礼物给好友，提升财富值");
			},
			'tap [data-close-pop]' : function()
			{
			    popup_obj.close();
			}
			
		}
		

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
			$(page_view.el).find('.waterfall-item img').css({height:'auto'})
			
			if($(page_view.el).find("[data-doorplate_last]").length>0)
			{			    
			    var doorplate_width = user_achievement_view_obj.set_img_size().dooplate_width
			    var dooplate_height = user_achievement_view_obj.set_img_size().dooplate_height
			    
			    if($(page_view.el).find("[data-doorplate_last]").last().width()!=doorplate_width)
			    {
			       $(page_view.el).find("[data-doorplate_last]").css({"width":doorplate_width+"px","height":dooplate_height+"px"});    
			    }			    
			    			    
			}
			
			if($(page_view.el).find("[data-cat_conf_id]").length>0)
			{
			    user_profile_view_obj.set_category_list_width();
			}
                                 
		}				
		
		// 头部信息视图
		var user_info_view = Backbone.View.extend
        ({
            initialize : function(options)
            {
                var that = this
                
                var options = options || {}
				
				that.render(); 
				
				that.hide();
            },
            render : function()
            {
               var data = this.model;
               
               if(!common_function.is_empty(data.top_img_url))
               {
                  data.top_img_url = common_function.matching_img_size(data.top_img_url,"m");     
               }               
               
               this.location_province = data.location_province
               this.location_city = data.location_city 
               this.sex = data.sex
               this.username = data.nickname
               this.user_icon = data.user_icon
                
               if(this.location_province == this.location_city)
               {
                    data.location_name = this.location_city
               }
               else
               {                
                  if(!common_function.is_empty(this.location_city))
                  {
                      data.location_name = this.location_province + "·" + this.location_city
                  }
                  else
                  {
                      data.location_name = this.location_province     
                  }          
               }               
                
			    if(this.user_icon)
				{
					var img_html = '<img src="{{user_icon}}">'
				}
				
               var template = '<div class="user-top-item bgcfff pb15"><div class="user-top-box re"><div class="bg-img" style="background-image: url({{top_img_url}});"></div><div class="user-pic oh" data-show_big_img><table border="0" cellspacing="0" cellpadding="0" style="margin:auto;height:100%;"><tr><td valign="middle" align="center"><div class="pic-box bgcfff">'+img_html+'</div></td></tr></table></div><div class="user-info lh18 colorfff"><div class="clearfix"><p class="f14 fl fb oh" style="max-width:88%;height:18px" user_name>{{nickname}}</p><em class="sex_icon fl icon-bg-common"></em></div><p class="f10">{{location_name}}</p></div><div class="pay-attention-box"></div></div><table border="0" cellspacing="0" cellpadding="0" class="charm-wealth-tab w-100 f10 mt10 color333"><tbody><tr><td width="50%" data-charm_rank_des><div class="radius-box dib charm-box mr5 f10 lh20 re"><p>魅力：LV{{charm_rank}}</p><em class="icon icon-bg-common"></em></div></td><td width="50%" data-expense_rank><div class="radius-box dib wealth-box ml5 f10 lh20 re mr5"><p>财富：LV{{expense_rank}}</p><em class="icon icon-bg-common"></em></div></td></tr></tbody></table><div class="color666 lh16 ml15 mr15 mt20">{{blog_descrit}}</div></div>'
                
               var html = Mustache.to_html(template, data)
                
               $(this.el).html(html) 
               
               if(this.sex == "男")
               {
                  $(this.el).find('.sex_icon').addClass('icon-male')
               }
               else if(this.sex == "女")
               {
                  $(this.el).find('.sex_icon').addClass('icon-female')
               }
               
               // 判断好友关系                        
                var poco_id = common_function.get_local_poco_id();
                
                var ofb = {};
                if(_state)
                {
                    ofb = _state.follow_btn_obj
                }
                
                var user_id = _params_arr[0];
                
                new_follow_btn = require('follow_btn')();                        
                
                follow_btn = new new_follow_btn
                ({
                    status : data.follow_status,
                    user_id : user_id,
                    other_follow_btn : ofb,
                    click_callback : function(data)
                    {
                        follow_status = data.follow_status
                        
                        is_change_relation = true;
                    }
                })
                        
                $(this.el).find('.pay-attention-box').html("")
                $(this.el).find('.pay-attention-box').html(follow_btn.$el)
            },            
            show : function()
            {
                $(this.el).show();
            },
            hide : function()
            {
                $(this.el).hide();
            },
            get_user_info : function()
            {
                var that = this
                
                console.log(this.username)
                
                return {
                    user_name : this.username,
                    user_icon : this.user_icon
                }
            } 
            
        })
        
        // 用户资料视图
        var user_profile_view = Backbone.View.extend
        ({
            initialize : function(options)
            {
                var that = this
                
                var options = options || {}
                
                that.render();                                                               
                
            },
			events: 
           {
			   //点击粉丝和关注列表
              'tap [data-user_list]' : function(event)
			  {
				  if(page_control.page_transit_status()) return false
				  if(_page_view.page_lock) return false
																
				  var num = $(event.currentTarget).find(".num").html(); 
                  var nick_name = cur_page_view.find("[user_name]").html();
                  var tap_tag = $(event.currentTarget).attr("data-user_list");
                  
                  var user_id = _params_arr[0]
                  
                  if(poco_id == user_id)
                  {
                      nick_name = "我";
                  }  
                
                  var state = 
                  {
                    num : num ,
                    nick_name : nick_name 
                  }   
                
                  
                
                  page_control.navigate_to_page(tap_tag+"/"+user_id,state)
			  },
			  'tap [data-cat_conf]' : function(ev)
			  {
			      var cur_btn = $(ev.currentTarget);
			      
			      var art_id = cur_btn.attr("data-art_id");
			      
			      var img_width = cur_btn.attr("data-cover_img_url_width");
			      
			      var img_height = cur_btn.attr("data-cover_img_url_height");
			      
			      page_control.navigate_to_page("last/"+art_id,{cover_img_width : img_width,cover_img_height : img_height}) 
			  }
            },
            render : function()
            {
                var data = this.model		
				this.astro_name = data.astro_name
				this.location_province = data.location_province
				this.location_city = data.location_city	
				
                this.tags_arr = data.tags_arr
				this.follow_count = data.follow_count 
				this.fans_count = data.fans_count 
				
				if(this.location_province == this.location_city)
                {
                    data.location_name = this.location_city
                }
                else
                {                
                  if(!common_function.is_empty(this.location_city))
                  {
                      data.location_name = this.location_province + "·" + this.location_city
                  }
                  else
                  {
                      data.location_name = this.location_province     
                  }          
                }
                
                if(common_function.is_empty(data.location_name))
                {
                    data.is_exsit_location_name = 0
                }
                else
                {
                    data.is_exsit_location_name = 1
                }
                
                if(common_function.is_empty(data.astro_name))
                {
                    data.is_exsit_astro_name = 0
                }
                else
                {
                    data.is_exsit_astro_name = 1
                }
                
                if(!common_function.is_empty(this.tags_arr))
                {
                    data.is_exsit_tags = 1    
                }
                else
                {
                    data.is_exsit_tags = 0
                }
                                           
				
                var template = '<div class="data-page pl10 pr10" style="padding-bottom:20px"><div class="basic-info-item mb15"><div class="bgcfff border-item color333 p10 mt10 bdb-line" data-categroy style="display:none"><div class="mb10">TA的聚光片</div><div class="category_list_container"><div data-category_list></div></div></div><div class="title color999 mb10 mt15">基本资料</div><div class="bgcfff basic-info-box border-item color333 bdb-line">{{#is_exsit_location_name}}<div class="item bdb-line-e6e p15" data-location-item><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tbody><tr><td>地区</td><td align="right" data-location_name="">{{location_name}}</td></tr></tbody></table></div>{{/is_exsit_location_name}}{{#is_exsit_astro_name}}<div class="item bdb-line-e6e p15" data-astro-item><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tbody><tr><td>星座</td><td align="right"><span data_astro_name="">{{astro_name}}</span></td></tr></tbody></table></div>{{/is_exsit_astro_name}}{{#is_exsit_tags}}<div class="item bdb-line-e6e p15" data-tags-item><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tbody><tr><td colspan="2">标签：<div class="tag_container"></div></td></tr></tbody></table></div>{{/is_exsit_tags}}</div></div><div class="ta-friend-item"><div class="title color999 mb10">Ta的朋友们</div><div class="bgcfff ta-friend-box border-item color333 bdb-line"><div class="item bdb-line-e6e p15" data-user_list="fans"><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tbody><tr><td>粉丝</td><td align="right"><div class="clearfix"><em class="icon-go icon-bg-common fr ml10"></em><span class="font-arial fr num" data-user_info="" data-fans-num="">{{fans_count}}</span></div></td></tr></tbody></table></div><div class="item bdb-line-e6e p15" data-user_list="follow"><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tbody><tr><td>关注</td><td align="right"><div class="clearfix"><em class="icon-go icon-bg-common fr ml10"></em><span class="font-arial fr num" data-user_info="" data-follow-num="">{{follow_count}}</span></div></td></tr></tbody></table></div></div></div></div>'
                
                var html = Mustache.to_html(template, data)
                
                $(this.el).html(html)
                
                console.log(data.img_category.length >0)
                                	                                				                               
                if(data.img_category.length >0)
                {
                    this.render_category_list(data)
                }		    
                
                
                
		        if(!common_function.is_empty(this.tags_arr))
                {
					console.log(this.tags_arr)
                    var tags_tpl = '{{#tags_arr}}<span class="tag_text radius-2px">{{tag_txt}}</span>{{/tags_arr}}'   
            
                    var tags_html = Mustache.to_html(tags_tpl, data)                                                                                
					
                    $(this.el).find('.tag_container').html(tags_html)
                                             
                } 		          
                                   
                            
				 
				
            },            
            show : function()
            {
                $(this.el).show();
            },
            hide : function()
            {
                $(this.el).hide();
            },
            render_category_list : function(data)
            {
                var that = this;
                
                var template = '{{#img_category}}<div data-art_id="{{art_id}}" data-cover_img_url_width="{{cover_img_url_width}}" data-cover_img_url_height="{{cover_img_url_height}}" data-cat_conf="{{cat_conf_id}}" class="grid_box_container" style="width:'+sizes+'px;height:'+sizes+'px" ><img class="my_life_img" src="{{cover_img_url}}" style="display:none"></div>{{/img_category}}'                                                                               
                
                for(var i =0;i<data.img_category.length;i++)
                {
                    var img = data.img_category[i].cover_img_url;
                    
                    if(img)
                    {
                        data.img_category[i].cover_img_url = common_function.matching_img_size(img,"ss")
                        box_count ++;   
                    }
                }
                
                var list = Mustache.to_html(template, data)   
                                                                                                    
                that.$el.find('[data-category_list]').html(list)
                
                that.set_category_list_width()
                
                var category_list_container = that.$el.find('.category_list_container')
                
                category_list_container.css({'position':'relative'})
            
                var myScroll = new iscroll_class(category_list_container[0],{
                    checkDOMChanges : true,
                    bounce : false,
                    hScroll : true,
                    vScroll : false,
                    hScrollbar: false,
                    vScrollbar: false,
                    onScrollStart : function()
                    {
                        life_show_scrolling = true
                    },
                    onScrollEnd : function()
                    {
                        life_show_scrolling = false
                        
                        console.log(life_show_scrolling)
                    }               
                })
                
                that.$el.find('[data-categroy]').show();
                
                setTimeout(function()
                {
                    that.$el.find('.my_life_img').show();
                },300)
            },
            set_category_list_width : function()
            {
                var that = this;
                
                var category_list_container  = that.$el.find('[data-category_list]')
                var grid_box_container = that.$el.find('.grid_box_container');   
                
                sizes = parseInt((window.innerWidth-55-2)*16/53)                                
                
                grid_box_container.height(sizes).width(sizes);                
                
                category_list_container.height(sizes);
                category_list_container.width(sizes*box_count+box_count*5-5)
                
                console.log(sizes,sizes*box_count+box_count*5-5)

            }
			
        })
        
        // 用户成就视图
        var user_achievement_view = Backbone.View.extend
        ({
            initialize : function(options)
            {
                var that = this
                
                var options = options || {}
                
                that.render();
            },
            render : function()
            {
                var that = this;
                
                var data = that.img_size_sort(this.model);                                                            

                var template = '<div class="gains-item color333 pt10 pb20"><div class="rank-item bgcfff mb10 p15 border-item bdb-line"><div class="clearfix"><div class="charm-box fl" data-charm_rank_des><div class="charm-box-bdr pr15"><div class="title">魅力等级</div><table border="0" cellspacing="0" cellpadding="0" class="mt20 w-100 f12"><tr><td valign="top" width="30"><em class="icon icon-bg-common"></em></td><td><h4 class="fwn"><span class="font-arial">LV<span>{{charm_rank}}</span></span> {{charm_rank_name}}</h4><div class="progress_grade_container mt5 radius-2px"><div class="progress_grade_val re radius-2px" data-charm_rank_progress style="width:0"></div></div><p class="font-arial f10 mt5"><span>{{charm_value}}</span><span class="color999">/{{next_charm_value}}</span></p></td></tr></table></div></div><div class="wealth-box fl" data-expense_rank><div class="pl15"><div class="title">财富等级</div><table border="0" cellspacing="0" cellpadding="0" class="mt20 w-100 f12"><tr><td valign="top" width="30"><em class="icon icon-bg-common"></em></td><td><h4 class="fwn"><span class="font-arial">LV<span>{{expense_rank}}</span></span> {{expense_rank_name}}</h4><div class="progress_grade_container mt5 radius-2px"><div class="progress_grade_val re radius-2px" data-expense_rank_progress style="width:0"></div></div><p class="font-arial f10 mt5"><span>{{expense_value}}</span><span class="color999">/{{next_expense_value}}</span></p></td></tr></table></div></div></div></div>{{#medal_count}}<div class="doorplate-item bgcfff mb10 border-item bdb-line"><div class="title-box bdb-line-e6e pl15 pr15 clearfix"><div class="title fl">门牌</div><div class="fr" data-to_doorplate_list><em class="icon-go icon-bg-common fr"></em><div class="fr mr10"><span class="font-arial">{{medal_count}}</span>枚</div></div></div><div class="doorplate-list pt10 pl10 pr10" ><ul class="clearfix">{{#medal_list}}<li class="fl mb10" data-doorplate_last="{{medal_id}}" style="width:{{dooplate_width}}px;height:{{dooplate_height}}px"><div data-doorplate class="img_container_div w-100" style="display:inline-block"><img src="{{medium_photo}}" class="w-100"></div></li>{{/medal_list}}</ul></div></div>{{/medal_count}}<div class="gift-item bgcfff border-item bdb-line" style="display:none"><div class="title-box bdb-line-e6e pl15 pr15 clearfix"><div class="title fl">礼物</div><div class="fr" data-to_gift_list><div class="fr mr10"><span class="font-arial">{{gift_count}}</span>件</div></div></div><div class="gift-list"><ul class="clearfix">{{#gift_list}}<li data-to_gift_last="{{gift_id}}" class="fl"><div class="div-tab p5 mt5 mb5 ml10"><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tr><td width="60"><div class="gift-img"><img src="{{img_url}}" class="w-100"></div></td><td style="margin-left:10px" data-gift_txt><p>{{name}}</p><p><span class="font-arial fb num">{{count}}</span>份</p></td></tr></table></div><em class="btm_bg ml10 mr10"></em></li>{{/gift_list}}</ul></div></div></div>'
                
                var html = Mustache.to_html(template, data)
                
                $(this.el).html(html)                                
                
                that.show_progress($(this.el).find('[data-charm_rank_progress]')
                    ,{cur_lv:data.charm_value,total_lv:data.next_charm_value});
                    
                that.show_progress($(this.el).find('[data-expense_rank_progress]')
                    ,{cur_lv:data.expense_value,total_lv:data.next_expense_value}); 
                
                if(data.gift_list.length % 2 ==0)
                {
                    that.$el.find('[data-to_gift_last]').eq(-2).find(".btm_bg").addClass("no_btm_bg");
                }
                
                that.$el.find('[data-to_gift_last]').last().find(".btm_bg").addClass("no_btm_bg");
                 
                if(data.gift_list.length != 0)
                {
                    that.$el.find('.gift-item').show()
                }
                                
                                                       
            },            
            show : function()
            {
                $(this.el).show();
            },
            hide : function()
            {
                $(this.el).hide();
            },
            img_size_sort : function(data)
            {
                var that = this  
                
                if(data.medal_count ==0)
                {
                    return data;
                }
                
                data.dooplate_width = this.set_img_size().dooplate_width
                
                data.dooplate_height = this.set_img_size().dooplate_height                                                                                      
                                                
                return data
            },
            set_img_size : function()
            {
                var that = this
        
                // 门牌大小比例：170/104               
                
                var window_width = window.innerWidth-2;// 2是边框的值
                
                var doorplate_width = parseInt((window_width-60)/3);                                
                
                return {
                    dooplate_width : doorplate_width,
                    dooplate_height : parseInt(doorplate_width*(52/85)),
                }                
                                                               
            },
            show_progress:function(progress_grade_val_obj,options)
            {
                var that = this
             
                var options = options || {},
                    cur_lv = parseInt(options.cur_lv) || 0,// 当前级别
                    total_lv =  parseInt(options.total_lv) || 500, // 总级别
                    speed = options.speed || 100, // 数字越大速度越慢
                    callback = options.callback || function(){}, //   加载完进度条的回调
                    aninmate = (options.aninmate == null)?true:false// 是否使用动画

                if(cur_lv>total_lv) 
                {
                    //alert("当前级别不能超过总级别")
                    return;
                }
                                    
                var progress_val = progress_grade_val_obj
                var val = 0                                             

                if(aninmate)
                {
                    var percent = parseInt((cur_lv/total_lv)*100)                                        
                    
                    setTimeout(function(){                        
                        progress_val.animate({ width: percent+"%",},300,'ease')                        
                    },300)
    
                }
                else
                {
                    val = parseInt((cur_lv/total_lv)*100)
                    
                    progress_val.css("width",val+"%")
                }
                
                

            }
        })
        
        
        
        
		var cur_select_style = false
		var img_nume_style = false
		var cur_type = "photos"
        var my_home_grid_collection_obj
		var img_style_view_obj
		var cur_type_name
		var wonderful_count
        var has_more_btn = false
		var data_pop_personal_obj		
		var is_both_follow
		var relation_id
        var follow_status
        var is_change_relation = false
        
		var user_profile_view_obj = null 
        var user_achievement_view_obj = null
        var user_info_view_obj = null
        var poco_id
        var popup_obj
		
		var interact_module_view
		var interact_module_view_obj
		var to_user_id
         
		 
		 
		//页面初始化
		options.page_init = function(page_view,params_arr,state)
		{
			_page_view = page_view
			_state = state
            _params_arr = params_arr
            
            poco_id = common_function.get_local_poco_id()
			
			cur_type_name = _params_arr[1]
			
			cur_page_view = $(page_view.el)        
            
            cur_page_view.find(".platform_tips").hide()
					
			
			var main_wraper = $(page_view.el).find('.main_wraper')
            
			var view_scroll = require('scroll')                
			
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head(),
				use_lazyload : true
			})                                  
	
			
		    // 送礼物、发信信弹出层
            interact_module_view = require('interact_module')
			
            to_user_id = _params_arr[0]
            

            if(app_function.can_app_share())
			{
				var share_btn = true;
				var share_weixin_btn_show = true
			}
			else
			{
				var share_btn = false;// true
			    var share_weixin_btn_show = false
			}
			
            interact_module_view_obj = new interact_module_view
            ({
                show_share_btn_list : share_btn,//share_btn,
                gift_btn_obj : 
                {
                    show : true,
                    click_btn_callback : function()
                    {
                        // 点击送礼物
                        
                        this.give_gift_action(to_user_id);
                        
                    }
                    
                },
                message_btn_obj : 
                {
                    show : true,
                    click_btn_callback : function()
                    {
                        // 点击发私信
                        this.control_nav_to_message_list(to_user_id)
                        
                    }
                },
                share_btn_obj : 
                {
                    show : share_btn,//share_btn,
                    //count : 4, 每行显示的个数，默认是4个
                    show_share_btn_list : 
                    {
                        sina : true,
                        qqweibo : true,
                        qqzone : true,
                        weixin : share_weixin_btn_show
                    },
                    click_btn_callback : function()
                    {
                        
                    },
                    share_btn_list_click_callback : function(share_type)
                    {                        
                        
                        var shareImg = user_info_view_obj.get_user_info().user_icon.replace('-c','')

                        if(share_type=='weixin')
                        {
                            shareImg = common_function.matching_img_size(shareImg,'ms')
                        }                                      
                        
                        //分享了 manson 在#POCO世界#的个人主页，很精彩，快来看看>>
                        
                        var shareTxt = "分享了 " + user_info_view_obj.get_user_info().user_name + " 的个人主页，（来自 #POCO世界# 手机拍照社区） "
                        var shareUrl = "http://wo.poco.cn/world_share.php?share_page=user_profile&user_id=" + to_user_id                                               
                        
                        console.log(shareImg)
                        
                        if( app_function.can_app_share() )
                        {
                            app_function.app_share(share_type,shareImg,shareTxt,shareUrl)                           
                        }
                        else
                        {                                              
                            this.share_img(share_type,shareImg,shareTxt,shareUrl)
                        }
                    }
                },                				
            })
			
			
            
            _page_view.$el.find('.wrap-box').append(interact_module_view_obj.$el)

            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
			

			var user_id = params_arr[0]
            
			if(user_id == 100100)
			{
			  cur_page_view.find(".act-data").hide()
			}
			
            cur_page_view.find(".check_more").hide();            
            
            data_pop_personal_obj = cur_page_view.find('[data-pop-personal]')                              
					
			control_switch("photos")		
		}
		
        // 控制导航列表切换
		function control_switch(type)
		{							
            
            _page_view.$el.find("[data-child_container]").hide()
            
            var child_container = _page_view.$el.find("[data-child_container='"+type+"']");
            
            
            
            switch(type)
            {
                case "photos" :                                                              
                     view_scroll_obj.trigger_scrollend()    
                     child_container.show() 
                     
                     // 初始化照片列表
                     var world_list_module = require('world_list_module')()
                     
                     if(!world_list_module_obj)
                     {
                        var user_id = _params_arr[0] 
                         
                        world_list_module_obj = new world_list_module({ 
                        url : wo_config.ajax_url.get_user_photos_profile_achievement,
                        data : { user_id : user_id,type:type,user_info_tag : user_info_tag},
                        list_type : "both",
                        no_more_control : true,
                        main_container : $(_page_view.el).find('.world_list_mvc_warp'),
                        page_view : _page_view.$el.find('.wrap-box'),
						append_html : '<div class="pics_count" style="display:none"><span data-pics_count=""></span>个精彩瞬间</div>',
                        onloading: function()
                        {
							console.log(_page_view)

                            alert_tips = new_alert_v2.show({text:"加载中",type : "loading",is_cover : false ,append_target : _page_view.$el,auto_close_time:false});
                        },
                        onreset : function()
                        {
                            //滚回顶部
                            view_scroll_obj.scroll_to(0)
                            _page_view.$el && _page_view.$el.find('header').animate({'translate3d':'0px, 0px, 0px'},0,'ease-in')
                            
                            user_info_tag = 0; 
        
                            //翻页PV统计  add by manson 2013.7.31
                            common_function.page_pv_stat_action()
                        },
                        onlisttypechange : function()
                        {
                            view_scroll_obj.trigger_scrollend()
                        },
                        parse : function(response)
                        {                                                      
                            if(response.is_exist_user==false)
                            {                                
                                
                                new_alert_v2.show({text:"用户不存在",type : "info",auto_close_time : 2000,is_cover:true,closed_callback:function()
                                {
                                    page_control.back()
                                }})
        
                                return false
                                
                            }        
                            
                            if(user_info_tag)
                            {
                                // set header user info
                                
                                _page_view.$el.find("[data-user_top_info]").html('')
                                
                                user_info_view_obj = new user_info_view
                                ({
                                    model : response.user_top_info
                                })
                                
                                user_info_view_obj.show();
                                
                                _page_view.$el.find("[data-user_top_info]").html(user_info_view_obj.$el)
                            }
                                                
                            cur_page_view.find('.ui-btn-letter').show()
							
							
							/*
							if(window.localStorage.getItem("record_arrow_tigs_show") != 1)
			                {
				              cur_page_view.find('.tigs-pic-item').show() 
							  
				              window.localStorage.setItem("record_arrow_tigs_show",1)
							  
							  cur_page_view.find('.fade-page').show()
			                }
				            else
				            {
					          cur_page_view.find('.tigs-pic-item').hide()
				            }
				           
							*/
							
                            
                            cur_page_view.find('.act-data li').css("width","33.3%") 
                            
                            cur_page_view.find('[user_info_item]').show()
							cur_page_view.find('.main_wraper').show()
								
        
                                
                            //照片来自第三方提示处理
                            if( !common_function.is_empty(response.photo_list) )
                            {
                                console.log(response.photo_list)
                    
                                var first_art_id = response.photo_list[0].art_id
        
                                if(first_art_id == 0)
                                {
                                    page_view.$el.find(".platform_tips").show()
                                }
                                
        
                                if(response.photo_list.length>=20)
                                {                           
                                                              
                                    has_more_btn = true;
                                    
                                    if(cur_type == "photos")
                                    {
                                        cur_page_view.find(".check_more").show()      
                                    }    
                                }
                                else
                                {
                                    has_more_btn = false;  
                                }                   
                                
                                if(response.item_count>0)
                                {
                                    cur_page_view.find(".pics_count").show()
                                    cur_page_view.find("[data-pics_count]").html(response.item_count)
                                } 
                                
                                
                            }
                            
                            alert_tips.close();                                                        
                          
                            return response.photo_list
                        }
                    })                                                
                    
                    world_list_module_obj.start_reset()                         
                }
        
                     break;
                case "profile" :
                     
                     user_info_tag = 0;
                     
					 // 添加基本资料视图                         
                     if(!user_profile_view_obj)
                     {
                        //滚回顶部
                        view_scroll_obj.scroll_to(0)
                         
                        alert_tips = new_alert_v2.show({text:"加载中",type : "loading",is_cover : false ,append_target : _page_view.$el,auto_close_time:false});
                        get_user_info_data_by_type(type,
                        {
                            success : function(model)
                            {
                                alert_tips.close();
                                
                                child_container.html('')
                                
                                box_count = 0;
                                
                                user_profile_view_obj = new user_profile_view 
                                ({
                                    model : model.user_bottom_info
                                });
                                
                                child_container.append(user_profile_view_obj.$el) 
                                
                                child_container.show()   
                        
                            },
                            error : function()
                            {
                                alert_tips.close();
                                
                                user_profile_view_obj = null
                            }
                        })                                                 
                                                
                     }   
                     else
                     {
                         child_container.show()
                     }
					 
					 
                     break;
                case "achievement" :                
                
                     user_info_tag = 0;         
                     
                     child_container.show()                                                                                                          
                                                
                     // 添加个人成就视图                         
                     if(!user_achievement_view_obj)
                     {
                        console.log("new user_achievement_view_obj")                         
                        
                        alert_tips = new_alert_v2.show({text:"加载中",type : "loading",is_cover : false ,append_target : _page_view.$el,auto_close_time:false});
                        
                        get_user_info_data_by_type(type,
                        {
                            success : function(model)
                            {
                                alert_tips.close();
                                
                                child_container.html('')
                                
                                user_achievement_view_obj = new user_achievement_view
                                ({
                                    model : model.user_bottom_info
                                });
                        
                                child_container.append(user_achievement_view_obj.$el)
                                                                     
                                                                
                            },
                            error : function()
                            {
                                alert_tips.close();
                                
                                user_achievement_view_obj = null
                            }
                            
                        })                                                 
                                                
                     }                                          
                                                                     
                     break;      
            }                                                    
            
            // 菜单高亮
            _page_view.$el.find('[data_select_type]').removeClass("cur");
            _page_view.$el.find('[data_select_type="'+type+'"]').addClass("cur");
            
			
		}
		
		// 请求个人资料或成就 数据
		function get_user_info_data_by_type(type,options)
		{		    		   
		    var options = options || {};
		        success = options.success || function() {},
		        error = options.error || function() {},
		        data = options.data || {},
		        type = type;            
            
            var user_id = _params_arr[0]
            
            var merge_data = $.extend(data ,
                 {
                     t : parseInt(new Date().getTime()),
                     user_id : user_id,
                     type : type,
                     user_info_tag : user_info_tag
                 })
            
            common_function.send_request(
            {
                url : wo_config.ajax_url.get_user_photos_profile_achievement,
                data : merge_data,
                callback : function(data)
                {
                    if ( typeof success == "function")
                    {                                               
                        success.call(this, data);
                    }
                },
                error : function()
                {
                    if ( typeof error == "function")
                    {
                        error.call(this);
                    }
                }
            }); 

		}
		
        
        //显示未完成弹出层
        function show_tips_layer(str)
        {
            var html = '<div id="popup_container" style="position: absolute; top: 0px; z-index: 100000; left: 0px; width: 100%; height: 100%;background:rgba(0,0,0,0.5);display: table;"><div style="display:table-cell;vertical-align: middle;text-align: center;"><div class="radius-2px f14" style="width: 300px;background: #fff;margin: 0 auto;padding-top:25px;padding-bottom: 20px;"><div class="font_wryh" style=" width: 260px; margin: 0 auto; text-align: center; ">'+str+'</div><div class="clearfix" style=" width: 260px; margin: 30px auto 0 auto; text-align: left; "><div data-close-pop style="width:100%;"><span class="radius-2px save_btn" style=" width: 105px; height: 40px;margin:0 auto">我知道了</span></div></div></div></div></div>'

            popup_obj = popup.show_popup({ container : cur_page_view,html_str : html}) 
        }

		return options
	}
	
	return new_page_entity
})

if(typeof(process_add)=="function")
{
	process_add()
}