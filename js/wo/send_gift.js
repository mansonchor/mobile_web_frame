define("wo/send_gift",["base_package","page_control","commom_function","wo_config","get_template","footer_view","refresh_btn","scroll","page","page_back_btn"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	var Mustache = require('mustache')
	var new_alert_v2 = require("new_alert_v2")
    
    exports.route = { "send_gift/:to_user_id": "send_gift" }

	exports.new_page_entity = function()
	{
		var view_scroll_obj
		var _page_view 


		var options = {	
			transition_type : 'slide',
			dom_not_cache : true
		}
		
		options.initialize = function()
		{
			this.render()
		}
		
		var footer_view_obj
		options.render = function()
		{
            var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix tc"><h3 class="clearfix" style="display:inline-block;width:100%;text-align:center"><span class="pl20">送礼物</span></h3></header><div class="content-10 main_wraper" style="padding: 0 10px;"><div class="mt10 font_wryh pb10" style="position:relative;padding-top:45px;" ><div class="mb10 bdb-line" style="background: #fff; padding: 12px 15px;"><table cellspacing="0" cellpadding="0" style="width:100%;font-size:12px"><tr><td style="vertical-align:top;width:40px"><div style="width: 32px;height: 32px;overflow: hidden;vertical-align: middle;display: table-cell;text-align: center;"><img user_icon style="vertical-align:middle;max-width:100%;max-height:100%;"></div></td><td ><div class="clearfix">我拥有的世界币<section class="fr" style="color:#ED412D"><span class="score_value fb font-arial mr5" style="display:inline-block"></span>枚</section></div></td></tr></table></div><div class="gift_list main_container"></div></div></div></div>'				
			
			this.$el.append($(init_html))
		}
		
		options.events = {			
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
			'tap [data-anchor-wallet]' : function()
			{
				page_control.navigate_to_page("my_wallet")
			}
		}
		

		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
				
			},
			before_refresh : function()
			{
				//refresh_btn.loadding()
                //alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",is_cover:true})
			},
			before_get_more : function()
			{
				//user_list_view_obj.more_btn_loading()
			}
		}
		

		var gift_list_collection = Backbone.Collection.extend
        ({  
			url : 'http://m.poco.cn/mobile/action/send_gift_list.php',
			refresh : function()
			{
			    var that = this 
                
				common_function.collection_refresh_function.call(this,collection_options)
			},
            parse: function(response) 
			{
				_page_view.$el.find('.score_value').html(response.user_score)
				_page_view.$el.find('[user_icon]').attr('src',response.user_icon)

				return response.gift_list
			}
		})


		// 列表子项
        var gift_list_item_view = Backbone.View.extend
        ({
            initialize : function() 
    		{            
    		    var that = this;                                                                      
                
    			that.render()
    		},
			render : function()
            {
				var data = this.model.toJSON()
				
				this.is_can_buy = data.is_can_buy
				this.gift_id = data.gift_id
				this.score_value = data.score_value

				if(data.is_can_buy==1)
				{
					data.state_btn = 'normal_send_stare'
				}
				else
				{
					data.state_btn = 'cannot_send_stare'
				}

				var template = '<div class="mb10 bdb-line gift_list_bg" ><table cellspacing="0" cellpadding="0" style="width:100%"><tr><td style="vertical-align:top;width:50px"><img class="list_gift_img" src="{{img_url}}"></td><td style="font-size:12px;color:#666;padding : 0 10px" ><div class="fb" style="color:#333">{{name}}</div><div class="mt10">{{content}}</div></td><td style="width:50px"></td></tr><tr><td>&nbsp;</td><td colspan=2><div class="mt10 pl10 pr10 f12" style="color:#666;">Ta的魅力：<span style="color:#ED412D;margin-right:20px">+{{charm_value}}</span>我的财富：<span style="color:#ED412D">+{{score_value}}</span></div></td></tr></table><div class="btn_wraper"><div state_btn class="btn_css {{state_btn}}">{{score_value}}币</div></div></div>'
                
                var html = Mustache.to_html(template, data)

				$(this.el).html(html) 
			},
    		events : 
            {
				'tap .btn_wraper'	: function()
				{
					var that = this

					if(that.have_send==1) return

					var score_value = parseInt(_page_view.$el.find('.score_value').html())
					var need_score = that.score_value

					if(score_value < need_score)
					{
						new_alert_v2.show({text:"世界币不足" , type : "info" , auto_close_time : 1000})
						return 
					}
					
					if(that.send_confirm == 1)
					{
						that.have_send = 1

						common_function.send_request
						({
							url : 'http://m.poco.cn/mobile/action/send_gift.php',
							data : { gift_id : that.gift_id , to_user_id : to_user_id },
							callback : function(data)
							{
								if(data.ret==1)
								{
									_page_view.$el.find('.score_value').html(score_value - need_score)

									that.$el.find('.btn_wraper').hide()

									new_alert_v2.show({text:"赠送成功", type : "success" , auto_close_time : 1000})
								}
								else
								{
									new_alert_v2.show({text:"赠送失败，错误代码：" + data.ret, type : "info" , auto_close_time : 1000})
								}
							},
							error : function()
							{
								that.have_send = 0
							}
						})
					}
					else
					{
						if(that.is_can_buy == 1)
						{
							that.$el.find('[state_btn]').html('确认')
							that.$el.find('[state_btn]').removeClass('normal_send_stare').addClass('confirm_send_stare')	
							that.send_confirm = 1
						}
					}
					
				}
			}
		})
		
		var to_user_id
       
		//页面初始化时
		options.page_init = function(page_view,params_arr)
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
			
			_page_view = page_view	
				
			to_user_id = params_arr[0]
			
           
			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head()
			})
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)


			// 初始化数据集
			gift_list_collection_obj = new gift_list_collection                
			
			//刷新列表监听
			gift_list_collection_obj.bind('reset', re_render_list , page_view)
            
			gift_list_collection_obj.refresh()
			
		}


		function re_render_list()
		{
			gift_list_collection_obj.each(function(item_model,i)
			{
			 
				var gift_list_item_view_obj = new gift_list_item_view
                ({ 
					model : item_model               
				})			            
				
				_page_view.$el.find('.main_container').append(gift_list_item_view_obj.$el)
			})
            
			//滚回顶部
			view_scroll_obj.scroll_to(0)
            
		}

		var page = require('page').new_page(options)
		
		return page
	}
})


if(typeof(process_add)=="function")
{
	process_add()
}