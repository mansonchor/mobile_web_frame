/**
  *	 瀑布流控制类
  *	 @author Manson
  *  @version 2013.5.2
  */
define("wo/module/photo_txt_controler",["base_package","get_template","load_more_btn","commom_function","wo_config"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
	var wo_config = require('wo_config')
	var cookies = require('cookies')
	
	
	new_photo_txt_controler = function(options)
	{
		var options = options || {}
        var view_options = {		    
    		item_count : 0,
    		initialize : function()
    		{
    			var that = this ;
    
    			//加载更多按钮   
    			//var load_more_btn = require('load_more_btn')()   
    			var load_more_btn = require('paging_btn')()  
    			
    			$(this.el).parent().append(load_more_btn.$el)
    			
    			that.load_more_btn = load_more_btn
    			
    			that.load_more_btn.hide();
    		},
    		item_count : 0,
    		add_photowall_item : function(item_view)
    		{
    			$(this.el).append(item_view.$el)
    
    			this.item_count++
    
    			this.load_more_btn.show()
    		},
    		clear_photowall : function()
    		{
    			$(this.el).html("");
    
    			this.item_count = 0
    			
    			//this.load_more_btn.hide()
    		},
    		hide_more_btn : function()
    		{
    			this.load_more_btn.hide()
    		},
    		more_btn_loading : function()
    		{
    			this.load_more_btn.loadding()
    		},
    		more_btn_reset : function()
    		{
    			this.load_more_btn.reset()
    		},
    		show_more_btn : function()
    		{
    			this.load_more_btn.reset()
    		},
    		return_paging_btn : function()
    		{
    			return 	this.load_more_btn
    		}
      
        }  
    
		//选项继承
		view_options = $.extend(view_options, options)
		
		var new_photo_txt_controler_class = Backbone.View.extend(view_options)
		
		return new new_photo_txt_controler_class
	}

	return new_photo_txt_controler
})