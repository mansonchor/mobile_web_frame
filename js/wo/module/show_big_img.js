/**
  *	 显示大图
  *	 hdw
  *  2013.8.23
  */
define("wo/module/show_big_img", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    

	var show_big_img_view =  Backbone.View.extend
	({
		className : 'show_big_img_container',
		showed_tag : false,
		close_tag : false,
		duration : 500,
        time_out_id : "",
		timing_function : 'ease-out',		
		big_img_html : '<div data-tap_big_img class="big_img_div"><table cellspacing="0" cellpadding="0"><tr><td id="big_img_td"><img data-big_img/><div class="icon-bg-common loading"></div><div class="xihuanta font_wryh" >喜欢TA就加TA吧</div></td></tr></table></div>',          
		defaults : 
		{

		},
		events : 
		{
			'tap [data-tap_big_img]' : function()
			{
				var that = this ;

				that.close();
			}
		},
		initialize : function(options)
		{
			var that = this; 

			var options = options ||  that.defaults;                                                          
			           

                that.__config(options);

                that.__render();                

                that.__resize();   

                that.__show();
			

			$(window).bind('resize',function()
			{
				that.__resize()
			})      
							
		},
		__render : function()
		{                

			var that = this;   

			that.$el.append(that.big_img_html); 

            that.append_target.append(that.$el)
		},
		__resize : function()
		{
			var that = this;     
			
			var img = that.$el.find("[data-big_img]").height("auto")                          

			var page_width = $('body').width();
			var page_height = $('body').height();
		                               

			var big_img_div = that.$el.find('.big_img_div');                          
		
			var big_img_width = (page_width - big_img_div.width())/2;
			var big_img_height = (page_height - big_img_div.height())/2;                

			big_img_div.css({'top':big_img_height+"px",'left' : big_img_width+"px" })
			

		},
		__show : function()
		{	
			var that = this   
			
			var img = new Image()
			
			img.src = that.img_url	
			
			//that.$el.find("[data_img_box]").css({ "max-width": img_width+"px", "max-height": img_height+"px"}); 
			
			that.$el.find("[data-big_img]").hide()
			
			that.$el.find('.xihuanta').hide();
			
			that.$el.find('.loading').show()			
			
			img.onload = function()
            {    	                
                		    				
				that.$el.find("[data-big_img]").attr("src",img.src)
                
                that.$el.find('.loading').hide()
                
                that.$el.find("[data-big_img]").show();                           
                
                that.$el.find("[data-big_img]").css('opacity',0)
            
                that.$el.find("[data-big_img]").animate({opacity:1})
                
                that.$el.find('.xihuanta').show();
            }
			
			


			//that.__zoom_img();

			if(that.is_fade)
			{
				//that.__fadeIn();
			}
			else
			{
				that.$el.show();    
				that.show_callback.call(this)                
			}
			
			
		},
		__zoom_img : function()
		{
			var that = this;

			var img = that.$el.find("[data-big_img]")	

			var inner_width = window.innerWidth;
			var inner_height = window.innerHeight;

			var img_width = img.width();
			var img_height = img.height();

			var _height = parseInt( (img_height * inner_width)/img_width )

			img.css({"height":_height+"px"})
					

		},
		close : function(close_now)
		{
			var that = this  
            that.$el.remove()                              

			that.close_tag = false
            
            that.closed_callback.call(this) 
			
		},
		__config : function(options)
		{                
			var that = this;

			var options = options || {},											            
				show_callback   = options.show_callback || function(){}, // 显示后的回调函数
				append_target = options.append_target || $('body'), // 插入目标
				closed_callback = options.closed_callback || function(){}, // 关闭后的回调函数
				img_url = options.img_url || "" ,				
				is_fade = (options.is_fade==null) ? true : options.is_fade // 是否渐显渐隐效果				
                        	

			that.show_callback = show_callback;
			that.append_target = append_target                
			that.closed_callback = closed_callback
			that.img_url = img_url
			that.is_fade = is_fade
		}
	})

	
    exports.show = function(options)
    {
        return new show_big_img_view(options)
    }

})

if(typeof(process_add)=="function")
{
	process_add()
}