/**
  *	 图文模块
  *	 hdw 尚未完成
  *  modify by manson 2013.5.15
  */
/*define("wo/module/photo_txt_view",["base_package",'frame_package',"commom_function","get_template"],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var Mustache = require('mustache')
	var common_function = require('commom_function')
	var page_control = require('page_control')
	
    new_photo_txt_item_view = function(options)
    {
        var options = options || {}

		var view_options = 
        {
            tagName :  "div",
        	className : "item-act",
        	art_id : "",
        	user_id : "",
        	on_like : false,
        	initialize : function() 
        	{
        		var template_control = require('get_template')
        		var template_obj = template_control.template_obj()		           
        		this.template_html = template_obj.photo_txt       
                  
        		this.theme_keyword = options.theme_keyword || ""
        	},
        	events : {
        		'tap .art-user-info' : function()
        		{
        			if(page_control.page_lock_status()) return false
        
        			page_control.navigate_to_page("user_profile/"+this.user_id)
        		},
        		//@人 链接
        		'tap poco_at' : function(ev)
        		{
        			var at_target = ev.currentTarget
        
        			var user_id = $(at_target).attr('user_id')
        
        			if(user_id>0)
        			{
        				page_control.navigate_to_page("user_profile/"+user_id)
        			}
        		},
        		//关键字 链接
        		'tap poco_keyword' : function(ev)
        		{
        			var target = ev.currentTarget
        			
        			var encode_keyword = encodeURIComponent( $(target).attr('keyword') )
        			
        			page_control.navigate_to_page("theme_pic_list/"+encode_keyword)
        		},
        		'tap .btn-comment' : function()
        		{
        			if(page_control.page_lock_status()) return false
        
        			page_control.navigate_to_page("cmt/" + this.art_id)	
        		},
        		'tap .btn-love' : 'like_action',
        		'hold .img' : function()
        		{
        			var that = this
        			
        			if( !common_function.is_empty(that.theme_keyword) && !common_function.is_empty(that.is_admin))
        			{
        				if(confirm("是否排除出该主题?"))
        				{
        					common_function.send_request({
        						url : 'http://m.poco.cn/mobile/action/del_keyword.php',
        						data : { keyword : that.theme_keyword , art_id : that.art_id }
        					})
        				}
        			}
        		}
        	},
        	render : function()
        	{
        		var data = this.model.toJSON()
        		
        		//模块内记 art_id
        		this.art_id = data.art_id
        		this.user_id = data.user_id
                this.is_admin = data.is_admin
                
        
        		var sort_model_data = this.img_size_sort(data)
        
                
                if(sort_model_data.like_count<=0)
                {
                    sort_model_data.like_count = "";
                }						
                
                if(sort_model_data.cmt_count<=0)
                {
                    sort_model_data.cmt_count = "";   
                }			
                
        		var html = Mustache.to_html(this.template_html, sort_model_data)
        		
        		$(this.el).html(html)
                            
        	},
        	img_size_sort : function(model_data)
        	{
        		model_data.cover_img_url_s = this.change_img_size(model_data.cover_img_url)
        		
        		//是否喜欢处理
        		if(model_data.had_like == 1)
        		{
        			model_data.like_style = 1
        		}
        
        		if(model_data.user_sex == "女")
        		{
        			model_data.sex_type = "icon-female"
        		}
        		else if(model_data.user_sex == "男")
        		{
        			model_data.sex_type = "icon-male"
        		}
                
                if(!model_data.nickname)
                {
                    model_data.nickname = model_data.user_nickname
                }
        		
        		model_data.img_show_height = common_function.get_last_page_zoom_height_by_zoom_width(model_data.cover_img_width,model_data.cover_img_height)                             								
        		return model_data
        	},
        	change_img_size : function(img_url)
        	{
        		return common_function.matching_img_size(img_url,"mb")
        	},
        	//操作UI交互和数据交换封装
        	like_action : function()
        	{
        		if(page_control.page_lock_status()) return false
        
        		var that = this
        
        		poco_id = common_function.get_local_poco_id()
            
                if(poco_id == 0)
                {
                    page_control.navigate_to_page("login")
                    return
                }
        		         
                var btn_love_i = that.$el.find('.btn-love i')
                
                if(that.on_like)
                {                   
                    return
                }
                                                      
                that.on_like = true
                   
                var counts_obj = that.$el.find("[replace_like_count]");             
                var counts_num = 0;
                
                if(counts_obj.html()!="")
                {
                    counts_num = parseInt(counts_obj.html());
                }
        
                //判断是取消还是喜欢
        		if(btn_love_i.hasClass("cur"))
        		{
        			btn_love_i.removeClass("cur")
                    
                    if(this.btn_love_obj) { this.btn_love_obj.removeClass("cur") }
                    
                    if(counts_num-1 <= 0 )
                    {
                       counts_obj.html("")
                    }
                    else
                    {
                        counts_obj.html(counts_num-1 )
                    }
                    
        			
        			var is_like = 0
        		}
        		else
        		{
        			btn_love_i.addClass("cur")
                    
                    if(this.btn_love_obj) { this.btn_love_obj.addClass("cur") }
                    
        			counts_obj.html(counts_num+1)
        			var is_like = 1
        		}   
        
        
                // 发送喜欢请求                    
                common_function.like_photo_action(that.art_id,is_like,"detail");
                                                 
                that.on_like = false
        	}            
        }
        
        //选项继承
		view_options = $.extend(view_options, options)
		
		var photo_txt_view_class = Backbone.View.extend(view_options)
		
		return new photo_txt_view_class
    }
    
    return new_photo_txt_item_view
    
    // 列表子项视图

})*/