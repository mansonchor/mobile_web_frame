/**
  *	 瀑布流列表collection
  *	 @author Manson
  *  @version 2013.5.2
  */
define("wo/module/mobile_photo_collection", [ "base_package", "commom_function" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var common_function = require('commom_function')

	//数据model
	var mobile_photo_model = Backbone.Model.extend({
		defaults:
		{
			summary : "",
			cover_img_url : "",
			like_count : "",
			art_id : "",
			cover_img_width : "",
			cover_img_height : "",
            order_ukey : ""
		}
	})

	
	new_mobile_photo_collection = function(options)
	{
		var options = options || {}
		
		var collection_options = {
			onload : false,
			model : mobile_photo_model,
			refresh : function()
			{
				options.data = { }

				common_function.collection_refresh_function.call(this,options)
			},
			get_more_item : function(is_pre_page)
			{
				//瀑布流列表的order ukey处理
				if(this.models.length>0 && !is_pre_page)
				{
					options.data = { order_ukey : this.models[this.models.length-1].attributes.order_ukey}
				}
				else
				{
					options.data = {}
				}

				common_function.collection_get_more_function.call(this,options,is_pre_page)
			},
			parse: function(response) 
			{
				if(response && typeof(response.result_data)!="undefined")
				{
					return response.result_data
				}
				else
				{
					return response
				}
			}
		}
		
		//选项继承
		collection_options = $.extend(collection_options, options)
        
		
		
		var photowall_item_list_class = Backbone.Collection.extend(collection_options)
		
		return new photowall_item_list_class
	}

	return new_mobile_photo_collection
})


/**
  *	 瀑布流控制类
  *	 @author Manson
  *  @version 2013.5.2
  */
define("wo/module/photowall_controler",["base_package","btn_package","get_template","commom_function","wo_config"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var wo_config = require('wo_config')
	var cookies = require('cookies')
	
    
	new_photowall_controler = function(options)
	{
		var options = options || {}

		var use_paging = options.use_paging || false
		var no_more_control = options.no_more_control || false
		var use_type_list = options.use_type_list || false
		var init_type = options.init_type || false
		var list_type_change = options.list_type_change || ""
		

		var view_options = {		    
			item_count : 0,
			index_colume : "left",
			left_colume : {},
			right_colume : {},
            one_colume : {},
            wall_type : 2,
			auth_banner_has_close : false,
			events : {
				'tap [photowall_type_btn]' : function()
				{
					this.change_wall_type(2)

					if(typeof(list_type_change)=="function")
					{
						list_type_change.call(this,2)
					}
				},
				'tap [onelist_type_btn]' : function()
				{
					this.change_wall_type(1)

					if(typeof(list_type_change)=="function")
					{
						list_type_change.call(this,1)
					}
				}
			},
			initialize : function() 
			{
				var that = this

                var template_control = require('get_template')
		
                var template_obj = template_control.template_obj()
                
                var html = template_obj.photo_wall_tb;
                
                $(this.el).html(html)    
			

				//加载更多按钮   add by manson 2013.5.7
				if(use_paging)
				{
					var load_more_btn = require('paging_btn')()
				}
				else
				{
					var load_more_btn = require('load_more_btn')()
				}

				if(!no_more_control)
				{
					$(this.el).append(load_more_btn.$el)
				}

				that.load_more_btn = load_more_btn

				
				//列表类型切换  add by manson 2013.10.13
				this.one_colume = $(this.el).find('.actbox-item')
				if(use_type_list)
				{
					this.$el.find('.list_type_control_container').show()

					this.photowall_type_btn = $(this.el).find('[photowall_type_btn]')
					this.onelist_type_btn = $(this.el).find('[onelist_type_btn]')


					if(init_type==2 || common_function.is_empty(init_type) )
					{
						this.change_wall_type(2)
					}
					else
					{
						this.change_wall_type(1)
					}
				}


				this.left_colume = $(this.el).find('.left_colume')
				this.right_colume = $(this.el).find('.right_colume')
                
			},
			//添加瀑布流item
			add_photowall_item : function(item_view)
			{
				var that = this
                
                if(this.wall_type == 2)
                {
    				var left_colume_height = that.left_colume.height()
    				var right_colume_height = that.right_colume.height()
    
    				
    				//添加禁瀑布流规则修改，哪边矮塞哪边  modify by manson 2013.5.18深夜
    				if(left_colume_height<=right_colume_height)
    				{
    					that.left_colume.append(item_view.$el)
    					
    					that.index_colume = "right"
    				}
    				else
    				{
    					that.right_colume.append(item_view.$el)
    
    					that.index_colume = "left"
    				}
                }
                else if(this.wall_type==1)
                {
                    that.one_colume.append(item_view.$el)
                }
				
				
				/*var sss = item_view.$el.position()
				console.log(sss)

				console.log( item_view.$el.scrollTop() )*/

				
				that.load_more_btn.show()
				
				that.item_count++
			},
			//清除瀑布流数据
			clear_photowall : function()
			{
				this.index_colume = "left"

				this.left_colume.html('')
				this.right_colume.html('')
                this.one_colume.html('')

				this.item_count = 0
				
				//this.load_more_btn.hide()
			},
			hide_more_btn : function()
			{
				this.load_more_btn.hide()
                //this.load_more_btn.css("visibility","hidden");
			},
			more_btn_loading : function()
			{
				this.load_more_btn.loadding()
			},
			more_btn_reset : function()
			{
				this.load_more_btn.reset()
			},
			return_paging_btn : function()
			{
				return this.load_more_btn
			},
            change_wall_type : function(type)
            {
                this.wall_type = type
				
				localStorage.setItem("cur_photo_wall_type",type)

				if(this.wall_type == 1)
                {
					console.log(this)
					this.onelist_type_btn.addClass('cur_selected')
					this.photowall_type_btn.removeClass('cur_selected')
					this.one_colume.show()
				}
				else
				{
					this.onelist_type_btn.removeClass('cur_selected')
					this.photowall_type_btn.addClass('cur_selected')
					this.one_colume.hide()
				}
            }
		}

		//选项继承
		view_options = $.extend(view_options, options)
		
		var photowall_controler_class = Backbone.View.extend(view_options)
		
		return new photowall_controler_class
	}

	return new_photowall_controler
})


/**
  *	 瀑布流列表单个图片格view
  *	 @author Manson
  *  @version 2013.5.2
  */
define("wo/module/photowall_item_view",["base_package",'frame_package',"commom_function","ua"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var Mustache = require('mustache')
	var common_function = require('commom_function')
	var ua = require('ua')
	var page_control = require('page_control')

	new_photowall_item_view = function(options)
	{
		var options = options || {}

		var view_options = {
			tagName :  "div",
			className : "photowall_item font_wryh",
			events : {
				'tap [data-anchor]' : function()
				{	
				    if(this.art_id == 0)
                    {
                        return; // 不存在 art_id 时 不能进入最终页以及喜欢操作 ，常用于显示第三方图片
                    }
					
					if(options.type == "index_list")
					{
						var editor_stat = 'http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/editor?url_hash=last&txt='+encodeURIComponent('首页作品')+'&tmp=' + new Date().getTime()
						var stat_img = new Image()
						stat_img.src = editor_stat
					}
				    
				    this.btn_love_obj = this.$el.find('.icon-love')
                    
                    var source_url = (this.source !="")? "/from_"+this.source : ""
                    
					page_control.navigate_to_page("#last/"+this.art_id+source_url,{cover_img_width : this.cover_img_width,cover_img_height : this.cover_img_height,btn_love_obj : this.btn_love_obj,photo_txt_view : this.$el })
				},
				'hold [data-anchor]' : function()
				{
					var that = this
					
					if( that.type=="new_img_list" && !common_function.is_empty(that.is_admin))
					{
						if(confirm("是否排除出最新图片?"))
						{
							common_function.send_request({
								url : 'http://m.poco.cn/mobile/action/blacklist_user_from_new.php',
								data : { from : "new" , art_id : that.art_id }
							})
						}
					}	

					if( that.type=="hot_img_list" && !common_function.is_empty(that.is_admin))
					{
						if(confirm("是否排除出热门图片?"))
						{
							common_function.send_request({
								url : 'http://m.poco.cn/mobile/action/blacklist_user_from_new.php',
								data : { from : "hot" , art_id : that.art_id }
							})
						}
					}	
				},
				'tap [data-user-info]' : function()
				{	
				     var user_id = parseInt(this.user_id)
					if(user_id>0)
					{
						page_control.navigate_to_page("user_profile/"+ user_id)
					}
				},
				'tap .love-div' : function()
				{
					if(page_control.page_lock_status()) return false

					var that = this
                    
                    if(this.art_id == 0)
                    {
                        return; // 不存在 art_id 时 不能进入最终页以及喜欢操作 ，常用于显示第三方图片
                    }

					poco_id = common_function.get_local_poco_id()
				
					if(poco_id == 0)
					{
						page_control.navigate_to_page("login")
						return
					}
							 
					if(that.on_like)
					{                   
						return
					}
														  
					that.on_like = true
					   
					var love_count_wrap = that.$el.find('.love_count_wrap')
					var btn_love_i = that.$el.find('.icon-love')  
                    
					var love_count = that.$el.find('.love_count')
					
					var cur_like_count = parseInt( love_count.html() ) 
                                        
                   
					
					
					//判断是取消还是喜欢
					if(btn_love_i.hasClass("cur"))
					{
						var after_like_count = cur_like_count - 1
						if(after_like_count<0) after_like_count = 0
						
						if(after_like_count==0)
						{
							love_count_wrap.css('display','none')
						}

						love_count.html(after_like_count)

						btn_love_i.removeClass("cur")
						var is_like = 0
					}
					else
					{
						love_count.html(cur_like_count + 1)

						if(cur_like_count + 1 > 0)
						{
							love_count_wrap.css('display','block')
						}

						btn_love_i.addClass("cur")
						var is_like = 1
					}
					
		  
					// 发送喜欢请求                    
					common_function.like_photo_action(that.art_id,is_like,"list");
													 
					that.on_like = false
				}
			},
			initialize : function() 
			{
				if(!this.model.toJSON().cover_img_url)
				{
					return false
				}
				

				if(ua.ios_version<"6")
				{
					this.$el.addClass('fixed_scroll_blink')
				}                                
				
                var sort_model_data = this.img_size_sort(this.model.toJSON())
                   
                
				//内部数据记录
				this.art_id = sort_model_data.art_id
				this.user_id = sort_model_data.user_id
				this.cover_img_width = sort_model_data.cover_img_width
				this.cover_img_height = sort_model_data.cover_img_height
				this.is_admin = sort_model_data.is_admin
                this.source = options.source || ""
				this.type = options.type || ""
                
                var no_art_id_tpl = ''
                var no_poco_pic_tpl = ''

                var love_btn_tpl = '<div class="love-div"><em class="icon-love icon-bg-common  {{#like_style}}cur{{/like_style}}"></em></div>'
                
				
				if(options.type == "user_profile_list")
				{
					var user_btn_tpl = '<div data-anchor class="me-pic-info"><div class="txt lh16">{{summary}}</div><div class="love-box color999 clearfix"><span class="love_count_wrap mr10 fl"><em class="icon-love icon-bg-common fl mr5"></em><i class="love_count fsn fl">{{like_count}}</i></span><span class="cmt_wrap fl"><em class="icon-comment icon-bg-common fl mr5"></em><i class="comment-count fsn fl">{{cmt_count}}</i></span></div></div>'
				}
				else if(options.type == "new_img_list")
				{
					var user_btn_tpl = '<div class="new-img-item"  data-user-info><table border="0" cellspacing="0" cellpadding="0"><tr><td width="40"><div class="img middle-center"><img lazyload_src="{{user_icon}}" class="max-width-height" /></div></td><td><div class="info-box color999"><h4 class="fwn color000 clearfix"><span class="fl">{{user_nickname}}</span><em class="sex_icon icon-bg-common fl"></em></h4><div class="area">{{location_string}}</div></div></td></tr></table></div>'
				}
				else
				{
					var user_btn_tpl = '<div class="user-pic-info" data-user-info><table border="0" cellspacing="0" cellpadding="0"><tr><td width="40"><div class="img middle-center"><img lazyload_src="{{user_icon}}" class="max-width-height" /></div></td><td><div class="info-box color999"><h4 class="fwn color333"><span class="fl">{{user_nickname}}</span><em class="sex_icon icon-bg-common fl"  style="margin-top:0px;"></em></h4><div class="love-cmt-box clearfix"><span class="love_count_wrap mr10 fl"><em class="icon-love icon-bg-common fl mr5 {{#like_style}}cur{{/like_style}}"></em><i class="love_count fsn fl">{{like_count}}</i></span><span class="cmt_wrap fl"><em class="icon-comment icon-bg-common fl mr5"></em><i class="comment-count fsn fl">{{cmt_count}}</i></span></div></div></td></tr></table></div>'
				}
	
                if(this.art_id == 0)
                {
                    love_btn_tpl = ''                                        
                } 

                var template = '<div class="item"   art_id="{{art_id}}"  cover_img_width="{{cover_img_width}}"  cover_img_height="{{cover_img_height}}"><div data-anchor class="cover_img"><img  lazyload_src="{{{cover_img_url_s}}}"  style="height:{{img_show_height}}px;width:100%;"  class="img_buffer_bg"/></div>'+user_btn_tpl+love_btn_tpl+''                				

				var html = Mustache.to_html(template, sort_model_data)                                
				
				$(this.el).html(html)	
				
				
				//判断评论数是否为O

				var cmt_wrap = this.$el.find('.cmt_wrap')
				var comment_count = this.$el.find('.comment-count')
				var cur_cmt_count = parseInt( comment_count.html() ) 

				if(cur_cmt_count==0)
				{
					cmt_wrap.css('display','none')
				}
				else
				{
					cmt_wrap.css('display','block')	
				}


				//判断喜欢数是否为O				   
				var love_count_wrap = this.$el.find('.love_count_wrap') 
				var love_count = this.$el.find('.love_count')
				var cur_like_count = parseInt( love_count.html() ) 
				
				if(cur_like_count==0)
				{
					love_count_wrap.css('display','none')
				}
				else
				{
					love_count_wrap.css('display','block') 
				}
				
				
              
				//判断是用户性别
				if(sort_model_data.user_sex == "男"){
					this.$el.find(".sex_icon").addClass("icon-male");
				}
				else if(sort_model_data.user_sex == "女"){
					this.$el.find(".sex_icon").addClass("icon-female");
				}
				else{
				  this.$el.find(".sex_icon").removeClass("icon-sex");
				}
			  
			  
			  
				
			},
			img_size_sort : function(model_data)
			{
				model_data.cover_img_url_s = common_function.matching_img_size(model_data.cover_img_url,"mm")
				model_data.img_show_height = common_function.get_photowall_zoom_height_by_zoom_width(model_data.cover_img_width,model_data.cover_img_height)
				
				//是否喜欢处理
				if(model_data.had_like == 1)
				{
					model_data.like_style = 1
				}

				if(model_data.like_count == 0)
				{
					model_data.like_count_zero = true
				}

				
				//地区字符串合并处理  add by manson 2013.9.4
				if( model_data.location_city == model_data.location_province || common_function.is_empty(model_data.location_city) )
				{
					model_data.location_string = model_data.location_province
				}
				else
				{
					model_data.location_string = model_data.location_province + "·" + model_data.location_city
				}
				
				return model_data
				
				
			}
		}

		//选项继承
		view_options = $.extend(view_options, options)
		
		var photowall_item_view_class = Backbone.View.extend(view_options)
		
		return new photowall_item_view_class
	}

	return new_photowall_item_view
})

define("wo/module/photowall_other_item_view",["base_package",'frame_package',"commom_function","ua"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var Mustache = require('mustache')
	var common_function = require('commom_function')
	var ua = require('ua')
	var page_control = require('page_control')

	new_photowall_item_theme_view = function(options)
	{
		var options = options || {}

		var view_options = {
			tagName :  "div",
			className : "other_photowall_item photowall_item font_wryh",
			type : "",
            events : 
            {
                'tap [data_to_link]' : 'nav_to_page'
            },
			initialize : function() 
			{
				if(!this.model.toJSON().cover_img_url)
				{
					return false
				}
				
				if(ua.ios_version<"6")
				{
					this.$el.addClass('fixed_scroll_blink')
				}                                
                
                this.type = options.type || ""
				
                var sort_model_data = this.img_size_sort(this.model.toJSON())   
					
				this.link_url = sort_model_data.link_url
				this.summary = sort_model_data.summary


                var template = '<div class="item bdb-line" data_to_link  cover_img_width="{{cover_img_width}}"  cover_img_height="{{cover_img_height}}"><div data-anchor class="cover_img"><img  lazyload_src="{{{cover_img_url_s}}}"  style="height:{{img_show_height}}px;width:100%;"  class="img_buffer_bg"/></div><div class="pop">{{summary}}</div>'        				

				var html = Mustache.to_html(template, sort_model_data)                                
				
				$(this.el).html(html)	
			},
			img_size_sort : function(model_data)
			{
				model_data.cover_img_url_s = common_function.matching_img_size(model_data.cover_img_url,"mm")
				model_data.img_show_height = common_function.get_photowall_zoom_height_by_zoom_width(model_data.cover_img_width,model_data.cover_img_height)
			
				return model_data
			},
            nav_to_page : function(ev)
            {
				var that = this

				if(!common_function.is_empty(that.link_url))
				{
					var editor_stat = 'http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/editor?url_hash=' + encodeURIComponent(that.link_url) + '&txt=' + encodeURIComponent(that.summary) + '&tmp=' + new Date().getTime()
					var stat_img = new Image()
					stat_img.src = editor_stat

					page_control.navigate_to_page(that.link_url)
				}
                   
            }
		}

		//选项继承
		view_options = $.extend(view_options, options)
		
		var photowall_item_view_class = Backbone.View.extend(view_options)
		
		return new photowall_item_view_class
	}

	return new_photowall_item_theme_view
})


if(typeof(process_add)=="function")
{
	process_add()
}