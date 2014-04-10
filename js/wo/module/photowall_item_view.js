/**
  *	 瀑布流列表单个图片格view
  *	 @author Manson
  *  @version 2013.5.2
  */
define("wo/module/photowall_item_view",["base_package","commom_function","ua","page_control"],function(require, exports)
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
			className : "photowall_item",
			events : {
				'tap [data-anchor]' : function()
				{	
				    if(this.art_id == 0)
                    {
                        return; // 不存在 art_id 时 不能进入最终页以及喜欢操作 ，常用于显示第三方图片
                    }
				    
				    this.btn_love_obj = this.$el.find('.icon-love')
                    
					page_control.navigate_to_page("last/"+this.art_id,{cover_img_width : this.cover_img_width,cover_img_height : this.cover_img_height,btn_love_obj : this.btn_love_obj,photo_txt_view : this.$el })
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
					   
					
					var btn_love_i = that.$el.find('.icon-love')                    
                                        

					//判断是取消还是喜欢
					if(btn_love_i.hasClass("cur"))
					{
						btn_love_i.removeClass("cur")
						var is_like = 0
					}
					else
					{
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
				if(ua.ios_version<"6")
				{
					this.$el.addClass('fixed_scroll_blink')
				}                                
				
                var sort_model_data = this.img_size_sort(this.model.toJSON())
                
				//内部数据记录
				this.art_id = sort_model_data.art_id
				this.cover_img_width = sort_model_data.cover_img_width
				this.cover_img_height = sort_model_data.cover_img_height
                
                var no_art_id_tpl = '';
                var no_poco_pic_tpl = '';
                var love_btn_tpl = '<div class="love-div radius-2px-btm"><em class="icon-love icon-bg-common  {{#like_style}}cur{{/like_style}}"></em></div>'
                if(this.art_id == 0)
                {
                    love_btn_tpl = ''                                        
                } 

                var template = '<div class="item"   art_id="{{art_id}}"  cover_img_width="{{cover_img_width}}"  cover_img_height="{{cover_img_height}}"><div data-anchor ><img  src="{{{cover_img_url_s}}}"  style="height:{{img_show_height}}px;width:100%;"  class="img_buffer_bg"/></div><div class="publish" style="padding:7px 10px;" data-anchor><div class="user-txt font_wryh f12 lh18"><span class="name">{{user_nickname}}</span>：{{summary}}</div></div>'+love_btn_tpl+''                				

				var html = Mustache.to_html(template, sort_model_data)                                
				
				$(this.el).html(html)	
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