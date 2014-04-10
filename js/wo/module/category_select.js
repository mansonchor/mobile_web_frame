/**
  *	 消息导航模块
  *	 lj
  *  2014.4.3
  */
define("wo/module/category_select", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    var common_function = require('commom_function')
    var page_control = require('page_control')
    var notice = require('notice')
    var ua = require('ua')

	var new_category_select_view =  Backbone.View.extend
	({
		className : 'select_item bgcfff color333',			

		tpl_html : '<div class="item_warp"><div class="item item-my-image clearfix" data-item="my_image"><em class="icon-bg-common icon fl"></em><span class="fl">聚光片</span></div><div class="item item-theme-act clearfix" data-item="theme_act"><em class="icon-bg-common icon fl"></em><span class="fl">主题活动</span></div><div class="item item-category clearfix" data-item="category"><em class="icon-bg-common icon fl"></em><span class="fl">分类浏览</span></div><div class="item item-near clearfix" data-item="near"><em class="icon-bg-common icon fl"></em><span class="fl">附近</span></div></div>',          		                
            
		events : 
		{		
		    'tap [data-item]' : function(ev)
            {
                var that = this
                
                var cur_item = $(ev.currentTarget).attr("data-item");   
				
				 if(cur_item == that.get_select())
                {                                                             
                    that.hide()
                }
				else
				{
					page_control.navigate_to_page(cur_item)
					
					that.hide()
				}
				       
            }  
		},
		initialize : function(options)
		{
			var that = this
            
            var options = options || {}
			
			that.cur_link_type = options.cur_link_type || ""
            
			that.is_close = true
			
			that.animate_time = 300
			
			that.is_animating = false
			
            that.__render()	                 
                        					
		},
		__render : function()
		{                
			var that = this 
			
			that.$el.append(that.tpl_html)
			
			setTimeout(function()
			{
			    
			    that.$el.css('top','-'+parseInt(that.$el.height())+'px')
			},300)
			

		},
        show : function()
        {
            var that = this                               
            
			if(that.is_animating)
			{
			  return	
			}
			
            if(ua.isAndroid)
			{
				that.animate_time = 0
			}		              
            
			that.is_animating = true
			
            that.$el.show()                
            
			that.$el.animate({'translate3d':'0px, '+parseInt(that.$el.height())+'px, 0px'},that.animate_time,'ease-in',function()
			{
				//动画执行完毕重置变量
			    that.is_animating = false 
			})
			
			that.is_close = false
			
        },
        hide : function()
        {
            var that = this
			
			if(that.is_animating)
			{
			  return	
			}
			
			if(ua.isAndroid)
            {
                that.animate_time = 0
            }  
			
			that.is_animating = true
			
            that.$el.animate({'translate3d':'0px, -'+parseInt(that.$el.height())+'px, 0px'},that.animate_time,'ease-in',function(){
			
			//动画执行完毕重置变量
			  that.is_animating = false 
			  
			  that.$el.hide()
			})
			
			that.is_close = true
        },
		get_select: function()
		{                
			var that = this
			
			var cur_select = "";
			
            switch (that.cur_link_type)
            {
            case "my_image":
                cur_select = "my_image";
                break;
            case "theme_act":
                cur_select = "theme_act";
                break;
		    case "category":
                cur_select = "category";
                break;
		    case "near":
                cur_select = "near";
                break;
            }
			return cur_select
		}
     
	})

	return new_category_select_view
        

})

if(typeof(process_add)=="function")
{
	process_add()
}