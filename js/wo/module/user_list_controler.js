/**
  *	 用户列表控制器
  *	 hdw 尚未完成
  *  
  */
define("wo/module/user_list_controler",["base_package","btn_package",'frame_package',"commom_function"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var Mustache = require('mustache')
	var common_function = require('commom_function')
    var page_control = require('page_control')
	
    // 列表视图
    var user_list_view = Backbone.View.extend
    ({        
        initialize : function(options)
        {
            var that = this
			
			var options = options || {}
			that.no_load_more = options.no_load_more || false

            //加载更多按钮   
			var load_more_btn = require('load_more_btn')()                        
            
			if(!that.no_load_more)
			{
				$(this.el).parent().append(load_more_btn.$el)
			}
            
            //load_more_btn.$el.addClass("pl10 pr10")
            
			that.load_more_btn = load_more_btn
            
            that.load_more_btn.hide();
        },
        add_list_item : function(item_view)
        {
             $(this.el).append(item_view.$el)
			 
			 if(!this.no_load_more)
			 {
				this.load_more_btn.show()
			 }
        },
        clear_list : function()
        {
            $(this.el).html("");
            
            console.log("clear_list")
            
            console.log($(this.el))
            
            this.load_more_btn.hide()
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
		cmt_more_btn_reset : function()
		{
			this.load_more_btn.cmt_reset()
		},
        show_more_btn : function()
        {
            this.load_more_btn.show()
        },
        filter_item_model : function(item_model)
        {
            var item_model = item_model.attributes;
            var ret = false;
            if(!item_model.art_id && item_model.notice_type_name != "everyweek_super_user")
            {
                if(item_model.medal_id)
                {
                   ret = false 
                }
                else
                {
                    ret = true    
                }
                
                
            }
            
            return ret;
        }
    });
    
    return user_list_view;
})

if(typeof(process_add)=="function")
{
	process_add()
}