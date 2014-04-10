/**
  *	   排行榜导航条
  *	 hdw
  *  2014.1.7
  */
define("wo/module/rank_nav", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    var common_function = require('commom_function')
    var page_control = require('page_control')
    

	var new_rank_nav_view =  Backbone.View.extend
	({
		className : 'rank_nav_container',			

		tpl_html : '<div class="message-nav radius-2px color666 border-style-be f14"><ul class="clearfix"><li class="bgc-fff-e6e" style="width:33.3%" data-nav="pics_rank"><span class="txt"><label>照片榜</label></span></li><li class="bgc-fff-e6e" style="width:33.4%" data-nav="charm_rank"><span class="txt"><label>魅力榜</label></span></li><li class="bgc-fff-e6e" style="width:33.3%" data-nav="wealth_rank"><span class="txt"><label>财富榜</label></span></li></ul></div>',          		                
        
        events : 
        {       
            'tap [data-nav]' : function(ev)
            {
                var that = this
                
                var cur_nav = $(ev.currentTarget).attr("data-nav");                                                       
                                
                
                if(cur_nav != that.cur_type)
                {                                                             
                    page_control.navigate_to_page(cur_nav)                    
                }                         
                                
            }  
        },
                    		          
		initialize : function(options)
		{
			var that = this; 
            
            var options = options || {};
                        
            that.cur_type = options.cur_link_type || "pics_rank";
            
            that.__render();	
            
            that.set_link_type(that.cur_type)                        
                        					
		},
		__render : function()
		{                
			var that = this; 
			that.$el.append(that.tpl_html)
			
		},
        show : function()
        {
            var that = this;
            
            that.$el.show()
        },
        hide : function()
        {
            var that = this;
            
            that.$el.hide()
        },
        set_link_type : function(type)
        {
            var that = this;
            
            that.cur_type = type;
            
            that.$el.find("[data-nav]").removeClass("cur");
            
            that.$el.find("[data-nav='"+type+"']").addClass("cur");
                        
        }
        
	})

	return new_rank_nav_view
        

})

if(typeof(process_add)=="function")
{
	process_add()
}