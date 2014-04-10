/**
  *	 提示框 v2
  *	 hdw
  *  2013.7.9
  */
define("wo/module/new_alert_v2", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    

	var new_alert_view =  Backbone.View.extend
	({
		className : 'alert_bg',
		showed_tag : false,
		close_tag : false,
		duration : 500,
        time_out_id : "",
		timing_function : 'ease-out',
		corver_bg_html : "<div class='alert_corver' ></div>",
		alert_content_html : '<div data-tap_alert class="alert_msg" ><table style="font-size:14px;color:#fff" cellspacing=10 cellpadding=0><tr><td style="width:20px;"><div id="alert_icon" class="icon-bg-common"></div></td><td id="alert_text"class="font_wryh word_break" ></td></tr></table></div>',          
		defaults : 
		{

		},
		initialize : function(options)
		{
			var that = this; 

			var options = options ||  that.defaults;                                                          
			           

                that.__config(options);

                that.__render();                

                that.__resize();   

                that.__show();
			
			if(that.auto_close_time>0)                 
			{
				that.time_out_id = setTimeout(function()
				{
					that.close()                   

				},that.auto_close_time);
			}

			$(window).bind('resize',function()
			{
				that.__resize()
			})      
							
		},
		__render : function()
		{                

			var that = this;   

            if(that.is_cover)  
            {                    
                
                
                var corver_bg = $(that.corver_bg_html);
            
                corver_bg.append(that.alert_content_html);
                
                that.$el.append(corver_bg);                                     
                
                that.append_target.append(that.$el)                           
                
            }
            else
            {
                that.$el.append(that.alert_content_html); 

                that.append_target.append(that.$el)       
            }


            var alert_icon = that.$el.find("#alert_icon")
            var alert_text = that.$el.find("#alert_text")
            
            alert_icon.removeClass();                
            alert_icon.addClass("icon-bg-common " +that.type);
            alert_text.html(that.text); 
			
		},
		__resize : function()
		{
			var that = this;                               

			var page_width = $('body').width();
			var page_height = $('body').height();
		                               

			var alert_msg = that.$el.find('.alert_msg');                          
		
			var msg_width = (page_width - alert_msg.width())/2;
			var msg_height = (page_height - alert_msg.height())/2;                

			alert_msg.css({'top':msg_height+"px",'left' : msg_width+"px" })
			

		},
		__show : function()
		{
			var that = this;   
			

			if(that.is_fade)
			{
				that.__fadeIn();
			}
			else
			{
				that.$el.show();    
				that.show_callback.call(this)                
			}
			
			
		},
		close : function(close_now)
		{
			var that = this  
            var close_now = close_now || !that.is_fade
      
            if(close_now)
            {
                clearTimeout(that.time_out_id)
            }                                        
            
					   
			if(close_now)
			{
				that.$el.remove()                              

				that.close_tag = false
                
                that.closed_callback.call(this)  
			}
			else
			{
				that.__fadeOut()      
			}
			
		},
		__fadeIn : function()
		{
			var that = this;

			var alert_msg = that.$el.find(".alert_msg");

			alert_msg.css({'opacity':0});

			alert_msg.animate
			({
				opacity: 1,
			}, 
			that.duration,
			that.timing_function)

			setTimeout(function()
			{
				that.show_callback.call(this)

			},that.duration);

		},
		__fadeOut : function()
		{
			var that = this;

			var alert_msg = that.$el.find(".alert_msg");

			alert_msg.css({'opacity':1});

			alert_msg.animate
			({
				opacity: 0,
			}, 
			that.duration,
			that.timing_function)

			setTimeout(function()
			{				
				that.$el.remove();

				that.close_tag = false
                
                that.closed_callback.call(this); 

			},that.duration);

		},
		__config : function(options)
		{                
			var that = this;

			var options = options || {},
				auto_close_time = options.auto_close_time || false, // 自动关闭时间           
				is_cover = options.is_cover || false, // 是否模态             
				type = options.type || 'success', // 提示框类型（info success loading）
				text = options.text || 'Test', // 显示文本                    
				show_callback   = options.show_callback || function(){}, // 显示后的回调函数
				append_target = options.append_target || $('body'), // 插入目标
				closed_callback = options.closed_callback || function(){}, // 关闭后的回调函数                            
				is_fade = (options.is_fade==null) ? true : options.is_fade // 是否渐显渐隐效果
                        	
            				
            that.text = text      
			that.is_cover = is_cover;                                            
			that.auto_close_time = auto_close_time;    
			that.type = type;
			that.show_callback = show_callback;
			that.append_target = append_target                
			that.closed_callback = closed_callback
			that.is_fade = is_fade
		}
	})

	
    exports.show = function(options)
    {
        return new new_alert_view(options)
    }

})

if(typeof(process_add)=="function")
{
	process_add()
}