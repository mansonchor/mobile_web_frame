/*
 *  新通用消息通知
 *  @author Manson
 *	@version  2013.10.22
 */
define("wo/module/system_notice_view",["base_package",'frame_package',"commom_function","wo_config"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    var wo_config = require('wo_config')
	var Mustache = require('mustache')
	var common_function = require('commom_function')
    var page_control = require('page_control')
	
	
    var system_notice_view = Backbone.View.extend
    ({
		tag : "div",
		className : "border-btm ",
        initialize : function(options) 
		{          
		    var options = options || {}
			
			this.model_data = options.model.attributes
			
			this.render()
			
			var td_arr = this.$el.find('td')
			this.left_colume = td_arr.eq(0)
			this.center_colume = td_arr.eq(1)
			this.right_colume = td_arr.eq(2)

		},
		events : {
			'tap [td_1]' : function()
			{
				var left_colume_anchor = this.model_data.left_colume_anchor
				
				if( !common_function.is_empty(left_colume_anchor) )
				{
					page_control.navigate_to_page(left_colume_anchor)
				}
			},
			'tap [td_2]' : function()
			{
				var center_colume_anchor = this.model_data.center_colume_anchor
				
				if( !common_function.is_empty(center_colume_anchor) )
				{
					page_control.navigate_to_page(center_colume_anchor)
				}
			},
            'tap [data-td_2_top_content]' : function()
			{
				var center_colume_anchor = this.model_data.center_colume_anchor
				
				if( !common_function.is_empty(center_colume_anchor) )
				{
					page_control.navigate_to_page(center_colume_anchor)
				}
			},
			'tap [td_3]' : function(ev)
			{
				var right_colume_anchor = this.model_data.right_colume_anchor
                
                var that = this;
				
				if( !common_function.is_empty(right_colume_anchor) )
				{
					page_control.navigate_to_page(right_colume_anchor)
				}
                else
                {
                    var cur_btn = $(ev.currentTarget);
                    
                    that.$el.find('.be-like-photo').show();
                    
                    that.$el.find('.be-like-photo').find('[data-small-pics-list]').html(that.render_small_pics())
                    
                    cur_btn.html("");
                }
			},
            'tap [data-small_pics_nav]' : function(ev)
            {
                var that = this;
                
                var cur_btn = $(ev.currentTarget);
                
                var art_id = cur_btn.attr("data-art_id")

                page_control.navigate_to_page("last/"+art_id+"/from_profile")
            }
		},
		render : function()
        {
			this.model_data.right_colume_img_url = common_function.matching_img_size(this.model_data.right_colume_img_url , "ms")

			var template = '<table border="0"cellspacing="0"cellpadding="0"><tr>{{#left_colume_img_url}}<td valign="top" width="42" td_1><div class="user-img"><img class="radius-2px" src="{{left_colume_img_url}}"></div></td>{{/left_colume_img_url}} {{#center_colume_content}}<td td_2 style="padding-right:10px;">{{{center_colume_content}}}</td>{{/center_colume_content}} {{#center_colume_multiple_content}}<td style="padding-right:10px;">{{{center_colume_multiple_content}}}</td>{{/center_colume_multiple_content}} {{#right_colume_img_url}}<td valign="middle" width="32" td_3><div class="user-img"><img src="{{right_colume_img_url}}"></div></td>{{/right_colume_img_url}}{{#right_colume_multiple_button}}<td valign="middle" width="32" td_3 data-more-pics><div class="user-img">{{{right_colume_multiple_button}}}</div></td>{{/right_colume_multiple_button}}</tr></table>'

			var init_html = Mustache.to_html(template, this.model_data)
 
			this.$el.html(init_html)
		},
        render_small_pics : function()
        {
            var that = this;
            
            var data = this.model_data.like_img_group;
            
            var str = ''
            
            for(var i = 0;i<data.length;i++)
            {
                var img_url  = common_function.matching_img_size(data[i].img_url, "ms") 
                
                str += '<li data-small_pics_nav data-art_id="'+data[i].art_id+'"><div class="img middle-center"><img src="'+img_url+'" class="max-width-height"></div></li>'
            }
            
            return str;
        }
    })
    
    return system_notice_view
})

if(typeof(process_add)=="function")
{
	process_add()
}