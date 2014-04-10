define('wo/my_life_element',["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","new_alert_v2"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
    var wo_config = require('wo_config')
	var new_alert_v2 = require("new_alert_v2")
    var iscroll_class = require('iScroll') 
        
	exports.route = { "my_life_element": "my_life_element" }
            
    exports.new_page_entity = function()
	{
		var _page_view
		var view_scroll_obj
		var alert_tips
        var select_tag_arr = []

		var options = {
			title : '我的生活元素',
			route : { "my_life_element": "my_life_element" },
			transition_type : 'slide',
			dom_not_cache : true,
			ignore_exist : true
		}

		options.initialize = function()
		{
			this.render();
		}

		options.render = function()
		{
			
            var init_html = '<div class="wrap-box life-element"><header>我的生活元素</header><div class="main_wraper"><div class="pt45"><div class="life-element-list clearfix"></div><div class="btn-mod btn-finish colorfff mt10" data_to_save>完成</div></div></div></div>'
            
			this.$el.append($(init_html))
		}

		
		
         //列表视图
        var life_element_view = Backbone.View.extend
        ({
		      tagName: "div",
    		  className: "item-element bgcfff fl",
    		  initialize: function(options) 
    		  { 
    		      this.render()
    	
    		  },
              events:               
              { 
				  'tap .item-element' : function(ev)
                  {
                      var cur_btn = $(ev.currentTarget)
                
                      var select_tag = cur_btn.find(".select_tag"); 
                      
                      var cur_tag_html = cur_btn.find('.tag-txt').html()
				
				      var element_is_show
				
                      if(select_tag.hasClass("icon-no-select"))
                      {
                          // 选中
						   
						  element_is_show = 1
						  
                          selected_ui_action(cur_btn,element_is_show)	  
						  
						  select_tag_arr.push(cur_tag_html)
                       }
                       else
                      {
                          // 取消
                    
					        element_is_show = 0
							
                            selected_ui_action(cur_btn,element_is_show)
							
							delect_arr_element(select_tag_arr,cur_tag_html)
                      }  
					  	  
                  },          
				  
              },
              render : function()
              {  
                var json_data = this.model
					
    			var templ = '<table border="0" cellspacing="0" cellpadding="0" class="w-100 f12 p10"><tr><td><span class="tag-txt">'+json_data+'</span></td><td width="40" align="right"><span class="dib select_tag icon-no-select"></span></td></tr></table>'
                
				$(this.el).width(item_element_width())
				
    			$(this.el).html(templ)
                
              } 
    		     
		})
		
	
 
		options.events = {
			
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{				    				    
                    page_control.back()
				}
			},
			'tap .ui-btn-prev-wrap' : function(ev)
			{			     
				page_control.back()
			},
			//保存
			'tap [data_to_save]':function(ev)
			{
				common_function.send_request
				({
				    url : wo_config.ajax_url.save_life_element,
				    data : { life_tags_new  : select_tag_arr}
				})
				
				page_control.navigate_to_page("edit",
				{
                   mark_from_element : true
				   
                 })	
			}
		}
		

		options.window_change = function(page_view)
		{
			page_view.$_('.item-element').width(item_element_width())
			
			page_view.$_('.main_wraper').height(common_function.container_height_with_head())                  
		}

		 
		//页面初始化
		options.page_init = function(page_view,params_arr,state)
		{
			  _page_view = page_view	
                                
			
			//容器滚动
			var main_wraper = page_view.$_('.main_wraper')   
			var view_scroll = require('scroll')                
			
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head(),
				use_lazyload : true
			})                                  
			

            //返回按钮
            var page_back_btn_container = page_view.$_('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)       
			
            lift_element_refresh()
			
		}	
		
		
		function lift_element_refresh(){
			
			alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",append_target:_page_view.$el})
			
			common_function.send_request
			({
				url : wo_config.ajax_url.show_life_element,
				type : "POST",
				callback : function(data)
				{
					
                    $(data).each(function(i) {			
					
					    var life_element_view_obj = new life_element_view
					    ({
					         model:data[i]
					    })
					    
					    _page_view.$_('.life-element-list').append(life_element_view_obj.$el)
						
					
                    })
                   
				    alert_tips.close()
					
				},
				error : function()
				{
					alert_tips = new_alert_v2.show({text:"网络不给力，刷新试试",type:"info",auto_close_time : 1000})
					
				}
			})
		}
		
		// 勾选操作
		function selected_ui_action(cur_btn,val)
        {
                var select_tag = cur_btn.find(".select_tag"); 
                var selected_html = '<em class="icon icon-bg-common"></em>'
                
                if(val == 1 )
                {                    
                    select_tag.removeClass("icon-no-select")
                    select_tag.addClass("icon-yi-select")
                    select_tag.append(selected_html)

                }
                else
                {
                    select_tag.addClass("icon-no-select")
                    select_tag.removeClass("icon-yi-select")
                    select_tag.html("")
                }
        }
		
		//删除数组某个元素
		function delect_arr_element(arr,val)
		{   
			 var index = arr.indexOf(val)
			 
              if (index > -1) 
			  { 
                  arr.splice(index, 1); 
              }  
		}
		
		
		//每一生活元素块的宽度
		function item_element_width()
		{
			return (window.innerWidth-40)/2
		}
		
		var page = require('page').new_page(options)
		
		return page
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}