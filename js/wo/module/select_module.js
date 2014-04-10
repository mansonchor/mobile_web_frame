/**
  *	 自定义下拉框
  *	 @author Manson
  *  @version 2013.11.14
  */
define("wo/module/select_module", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    var Mustache = require('mustache')
	var common_function = require('commom_function')
	
	
	function return_select_module_class()
	{
		//容器滚动
		var view_scroll = require('scroll')

		var select_module_class =  Backbone.View.extend
		({
			className : 'world_select',         
			initialize : function(options)
			{
				var options = options || {}
				//this.options = options
				
				this.onchange = options.onchange || ""
				this.default_key = options.default_key || ""
				this.options_data = options.options_data || ""
                
				this._render()				

			},
			_render : function()
			{
				var options_html = this._render_options(this.options_data)
				
				var html = '<div class="cover_screen w-100 h-100"><div class="container tc vam"><div class="wraper dib bgcfff" ><section class="scroll_wraper oh"><div>' + options_html + '</div></section><section style="padding:5px;background:#f7f7f7"><table style="width:100%;" cellpadding="5"><tr><td style="width:50%"><span class="select_btn cancel color666 tc f14 bgc-fff-e6e">取消</span></td><td style="width:50%"><span class="select_btn tc f14 confirm colorfff bgc-24b-2a8">确定</span></td></tr></table></section></div></div></div>'

				this.$el.html(html)

				view_scroll.new_scroll(this.$el.find('.scroll_wraper'),{
					hideScrollbar : false
				})
			},
			index_pos : "",
			index_key : "",
			index_val : "",
			events : {
				'tap .cancel' : function()
				{
					this.close()
				},
				'tap .confirm' : function()
				{
					var that = this
					
					var user_have_select = that.$el.find('.cur').length
					var user_select = that.$el.find('.cur').parents('.input-box')

					
					if(user_have_select && user_select.attr('index')!=that.index_pos)
					{
						that._set_data(user_select)

						if(typeof(that.onchange)=="function")
						{
							that.onchange.call(that)
						}
					}

					that.close()
				},
				'tap .input-box' : function(ev)
				{
					this._select_action(ev.currentTarget)
				}
			},
			_select_action : function(cur_select_obj)
			{
				this.$el.find('.select_point').removeClass('cur')
					
				var cur_select = $(cur_select_obj)
				cur_select.find('.select_point').addClass('cur')
			},
			_set_data : function(cur_select_obj)
			{
				this._select_action(cur_select_obj)

				this.index_pos = cur_select_obj.attr('index')
				this.index_key = cur_select_obj.attr('key')
				this.index_val = cur_select_obj.attr('val')
				
				this.default_key = this.index_key
			},
			_render_options : function(options_data)
			{
				var template = '<div class="input-box p15 bgcfff bdb-line-e6e"  index="{{index}}"  key="{{key}}"  val="{{val}}" ><table border="0" cellspacing="0" cellpadding="0" class="reset_table w-100 f12"><tbody><tr><td >{{val}}</td><td style="width:16px"><div class="select_point re"><div class="inside_point"></div></div></td></tr></tbody></table></div>' 
				
				var html = ''

				$(options_data).each(function(i,data)
				{
					data.index = i
					html += Mustache.to_html(template, data)	
				})
				
				return html
			},
			get_select_data : function()
			{
				return { pos : this.index_pos, key : this.index_key , val : this.index_val }
			},
			open : function()
			{
				var that = this
				
				that._render()
				$(document.body).append(that.$el)
				
				if(!common_function.is_empty(that.default_key))
				{
				    
					var default_target = that.$el.find('[key="'+that.default_key+'"]')
					
					that._set_data(default_target)
				}
			},
			close : function()
			{
				$(this.$el).remove()
			},
			reset : function()
			{
				this.default_key = ""
				this.index_pos = ""
				this.index_key = ""
				this.index_val = ""
			}
		})

		return select_module_class
	}
	
    return return_select_module_class
})

if(typeof(process_add)=="function")
{
	process_add()
}