/**
  *	 话题模块
  */
define("wo/module/topic_txt_module", [ "base_package" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
    var Mustache = require('mustache')
	var common_function = require('commom_function')


	var topic_txt_module_class =  Backbone.View.extend
	({
		className : 'publist_topic_txt_container topic_txt_container p10 bgcfff', 
        topic_txt_str_arr : [],                    
		initialize : function(options)
		{
			var options = options || {}                                                    
			
            var that = this;           
            
            that.click_topic_txt_callback = options.click_topic_txt_callback || function(){}
            
            that.click_more_callback = options.click_more_callback || function(){}
            
            that.data = options.data;
			
            that.history_data = JSON.parse(options.history_data); 
			
			this._render()
			
			this._render_history_data(that.history_data)	

            this.hide();

		},
		_render : function()
		{
		     var that = this;   		 		     		     		     
		
		     var template = '{{#list}}<div class="tag-wrap dib p5"><span class="tag-item tag-theme radius-2px" data-topic_txt title="{{title}}" keyword="{{keyword}}">{{title}}</span></div>{{/list}}';

		     var topic_txt_html = Mustache.to_html(template, that.data)
		     
		     var html = '<div class="tag-box-wrap colorfff clearfix">'+topic_txt_html+'</div>'
             
             this.$el.html(html)                          
             
             var more_btn = '<div class="tag-wrap dib p5"><span class="tag-item tag-theme radius-2px tag-thmen-more" data-click_more>更多</span></div>'
             
             this.$el.find('.tag-box-wrap').append(more_btn);
                          
		},
		_render_history_data : function(data)
		{
		    var that = this;		    			    		   
			
			if(data&&data.length>0)
			{
			    var tpl = [];
			    
				$.each(data,function(i,value)
			    {
			        tpl.push('<div class="tag-wrap dib p5"><span class="tag-item tag-theme radius-2px" data-topic_txt title="'+data[i].keyword+'" keyword="'+data[i].keyword+'">'+data[i].keyword+'</span></div>')	
							   		
			    })
			    
			    that.$el.find('.tag-box-wrap').prepend(tpl.join(''));
			}
	
			 
		},
		refresh : function(history_data)
		{
		     var that = this;
		     
		     that._render();
		     
		     that._render_history_data(history_data);
		},
		events : 
        {
			'tap [data-topic_txt]' : function(ev)
            {
                var that = this;                
                
                if(typeof that.click_topic_txt_callback == 'function')
                {
                    var topic_txt_str = that.get_topic_txt_str(ev)
                    
                    that.click_topic_txt_callback.call(this,topic_txt_str)
                }                                        
            },
            'tap [data-click_more]' : function(ev)
            {
                var that = this;
                
                if(typeof that.click_more_callback == 'function')
                {
                    that.click_more_callback.call(this)
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
        // 获取话题
        get_topic_txt_str : function(e)
        {            
            var that = this ;           
            
            that.topic_txt_str_arr = []; 
            
            var cur_obj = e.currentTarget
            
            var topic_txt_str = '#' + $(cur_obj).attr('keyword') + '# '
            
            that.topic_txt_str_arr.push(topic_txt_str)                        
            
            return that.topic_txt_str_arr[0]    
                            
        }	
        	
	})

	return topic_txt_module_class
})

if(typeof(process_add)=="function")
{
	process_add()
}