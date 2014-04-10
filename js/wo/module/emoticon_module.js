/**
  *	 表情模块
  */
define("wo/module/emoticon_module", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    var Mustache = require('mustache')
	var common_function = require('commom_function')
	var template_control = require('get_template')
	//容器滚动
	var view_scroll = require('scroll')		
		
	
	

	var emoticon_module_class =  Backbone.View.extend
	({
		className : 'emoticon_container', 
        emoticon_str_arr : [],                    
		initialize : function(options)
		{
			var options = options || {}                                                    
			
            var that = this;           
            
            that.click_icon_callback = options.click_icon_callback || function(){}
            
            that.emotion_wraper_height = options.emotion_wraper_height || window.innerHeight - 135 - 45 - 20                                     
            
			this._render()
            
            this.hide();

		},
		_render : function()
		{
		     var that = this;   
		 
		     var template_obj = template_control.template_obj()
		
		     var init_html = template_obj.emoticon;
             
             this.$el.append($(init_html))                          
             
             //表情内容滚动
			 var emotion_wraper = that.$el.find(".emotion_wraper")
			 var emotion_wraper_height = that.emotion_wraper_height
             
             console.log(emotion_wraper_height)
             
			 var emotion_scroll_obj = view_scroll.new_scroll(emotion_wraper, {
				view_height: emotion_wraper_height
			 })
		},
		events : 
        {
			'tap .icon-warp' : function(ev)
            {
                var that = this;
                
                if(typeof that.click_icon_callback == 'function')
                {
                    var emoticon_str = that.get_emoticon_str(ev)
                    
                    that.click_icon_callback.call(this,emoticon_str)
                }                                        
            }
		},
        show : function()
        {
            this.$el.show();
        },
        hide : function()
        {
            this.$el.hide();
        },            
        // 获取表情
        get_emoticon_str : function(e)
        {            
            var that = this ;           
            
            that.emoticon_str_arr = []; 
            
            var cur_obj = e.currentTarget
			
			var emoticon_ubb_text = '[' + $(cur_obj).attr('title') + ']'
            
            that.emoticon_str_arr.push(emoticon_ubb_text)
            
            return that.emoticon_str_arr[0]                 
                            
        }	
        	
	})

	return emoticon_module_class
})

if(typeof(process_add)=="function")
{
	process_add()
}