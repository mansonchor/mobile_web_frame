/**
  *	 瀑布流控制类
  *	 @author Manson
  *  @version 2013.5.2
  */
define("wo/module/photowall_controler",["base_package","get_template","load_more_btn","commom_function","wo_config"],function(require, exports)
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

		var view_options = {		    
			item_count : 0,
			index_colume : "left",
			left_colume : {},
			right_colume : {},
			auth_banner_has_close : false,
			initialize : function() 
			{
				var that = this

                var template_control = require('get_template')
		
                var template_obj = template_control.template_obj()
                
                var html = template_obj.photo_wall_tb;
                
                $(this.el).html(html)    
				

				//加载更多按钮   add by manson 2013.5.7
				var load_more_btn = require('load_more_btn')(use_paging)
				$(this.el).append(load_more_btn.$el)
				that.load_more_btn = load_more_btn


				this.left_colume = $(this.el).find('.left_colume')
				this.right_colume = $(this.el).find('.right_colume')
			},
			_close_auth_banner : function()
			{
				this.auth_banner_has_close = true

				this.$el.find('.add-item').hide()

				//alert('safsafsaf')
			},
			//添加瀑布流item
			add_photowall_item : function(item_view)
			{
				var that = this
				
				//console.log("left : " + that.left_colume.height())
				//console.log("right : " + that.right_colume.height())

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
				
				that.load_more_btn.show()
				
				//显示"马上加入"提示层  add by manson 2013.6.9
				if(that.auth_obj && !that.auth_banner_has_close)
				{
					that.auth_obj.show()
				}

				that.item_count++
			},
			//清除瀑布流数据
			clear_photowall : function()
			{
				this.index_colume = "left"

				this.left_colume.html('')
				this.right_colume.html('')

				this.item_count = 0
				
				this.load_more_btn.hide()
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
			}
		}

		//选项继承
		view_options = $.extend(view_options, options)
		
		var photowall_controler_class = Backbone.View.extend(view_options)
		
		return new photowall_controler_class
	}

	return new_photowall_controler
})

if(typeof(process_add)=="function")
{
	process_add()
}