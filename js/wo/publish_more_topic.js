define("wo/publish_more_topic",["base_package",'frame_package',"btn_package","wo_config","commom_function","get_template","footer_view","notice","new_alert_v2"],function(require, exports)
{
	var $ = require('zepto')
	var wo_config = require('wo_config')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var Mustache = require('mustache')
	var notice = require('notice')
    var cookies = require('cookies')
	
	var new_alert_v2 = require("new_alert_v2")
    
    
	exports.route = { "publish_more_topic": "publish_more_topic" }
		

	exports.new_page_entity = function()
	{
		var options = {
			route : { "publish_more_topic": "publish_more_topic" },		
			transition_type : 'fade',
			dom_not_cache : false,
			ignore_exist : false    
		};
		
        var reg = /(^\s*)|(\s*$)/g
        
		options.initialize = function()
		{
			this.render();
		}
		
        
		options.render = function()
		{		
			var that = this

			var init_html = '<div class="publish_more_page wrap-box font_wryh pb15"><header class="header re tc fb">更多话题</header><div class="select-item-wrap p15" style="margin-top:45px"><div class="select-item bgcfff"><table border="0" cellspacing="0" cellpadding="0" class="w-100 h-100 f12"><tr><td width="30" align="left"><em class="select-topic-icon icon-bg-common"></em></td><td><div class="input-box"><input type="text" class="input-class w-100 bdn bgn" data_to_topic_vaule value="" placeholder="请插入自定义话题名称"></div></td><td width="55"><div class="ui-btn-register btn-confirm oh" data_to_publish style="display:none"><span class="mt5 oh radius-2px">确认</span></div></td></tr></table></div></div><div class="topic-list-wrap"><div><ul class="data_topic-list" data_custom_topic></ul><ul class="topic-list pb15"></ul></div></div></div>'        
							
			that.$el.append($(init_html))
		}
		
		options.events = 
		{
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc && !life_show_scrolling)
				{				    				    
					
                    page_control.back()
				}
			},
			'tap .ui-btn-prev-wrap' : function(ev)
			{			     
				page_control.back()
			},
			//话题输入框改变
			'change [data_to_topic_vaule]' : function(ev)
			{				    
			    
				if(input_value_text.val().replace(reg,"").length>0)
				{
					_page_view.$el.find('.btn-confirm').show()
				}
                 else 
				{
					_page_view.$el.find('.btn-confirm').hide() 
				}
			 
			},
			

			//点击自定义话题确定按钮
			'tap [data_to_publish]' : function(ev)
			{
			    if(input_value_text.val().replace(reg,"").length == 0)
			    {
			        alert_tips = new_alert_v2.show({text:"自定义话题不能为空",type:"info",is_cover:false,auto_close_time:800})
			        return;
			    }
			    			     	
          
			    if (_state && _state.textarea)
                {   
			        var input_val = input_value_text.val()
					
					//创建自定义话题数组并且添加值
					if(get_localStorage())
					{
						input_val_arr = get_localStorage()
					}
					
					input_val_arr.splice(0,0,{keyword:input_val})                                                                                                                     

                    input_val_arr = unique(input_val_arr)   
                                                                                                                                                                                                             
                    if(input_val_arr.length>5)
                    {
                        input_val_arr.pop();   
                    }  
                    
					set_localStorage(input_val_arr)
			
			
			        //更新话题值
				    text_var = text_area.val()
					
				    var _input_val = ("#"+input_val+"# ")
			
				    text_var += _input_val

			        text_area.val(text_var)
			        
			        input_value_text.blur()
					  
					  
                    page_control.back()
					
					input_value_text.val('')
					
					_page_view.$el.find('.btn-confirm').hide() 
                 }
				 
			}
			
		}
		
		
		
		options.window_change = function(page_view)
		{						
			$(page_view.el).find('.topic-list-wrap').height(window.innerHeight-108)
		}
		
		
		var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed)
			{
                 alert_tips.close()
				 
			},
			before_refresh : function()
			{
				alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",is_cover:true,append_target:_page_view.$el})
				
			}
		}	
			
		//数据model
    	var more_topic_model = Backbone.Model.extend
        ({
    		defaults:
    		{
    		
    		}
    	})
 
		//初始化话题数据
		
		var more_topic_collection = Backbone.Collection.extend
        ({
            model : more_topic_model,    
			url : wo_config.ajax_url.get_topic_txt_list,
            refresh : function()
			{
			    var that = this 
                
				common_function.collection_refresh_function.call(this,collection_options)
			},
            parse: function(response) 
			{
				if(response && typeof(response.result_data.list)!="undefined")
				{
					return response.result_data.list
				}
				else
				{
					return response
				}
			}
		})
	
	     // 用户自定义话题视图
		 var custom_topic_view = Backbone.View.extend
        ({
            tagName : "li",
            className : "",
            initialize : function()
            {
                this.render()
            },
			events: 
            {
                'tap [data_to_title]' : function()
                {   	
				   if (_state && _state.textarea)
                   {   
				       //更新话题值
				      text_var = text_area.val()
					
				      var _input_val = ("#"+this.keyword+"# ")
			
				      text_var += _input_val

			          text_area.val(text_var)
					  
                      page_control.back()
                   }
                                                                                                                                   
                },
				
						    //长按自定义话题
			  'hold [data_to_custom_topic]' : function(ev)
			  {	
				  if(is_hold)
				  {
				    $(this.el).find('[data_del_btn]').show()
				 
				     is_hold = false
				 
				  }	
				  //再次长按自定义话题
				  else
				  {
					 $(this.el).find('[data_del_btn]').hide()
					 
					 is_hold = true
				   
				  }
			  },

			
			  //点击自定义话题的删除按钮
			  'tap [data_del_btn]' : function(ev)
			  {	
			      var that = this;
                 
				  var local_history_data = get_localStorage()				  
			      
				  _page_view.$el.find('li [data_to_custom_topic="'+this.keyword+'"]').remove()
				  
				  console.log(that.keyword) 
				  	
				  $.each(local_history_data, function( key, value ) 
				  {	
	                  
                      if(value.keyword == that.keyword )
				      {
				          local_history_data.splice(key,1) 
				      }
					  
                  })
                  
				  set_localStorage(local_history_data)
                  
			  }
				
            },

            render: function()
            {
                var that = this; 
				
                that.keyword = this.model.keyword
				
                var html = '<div class="list-box re" data_to_custom_topic='+that.keyword+'><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tr><td><div class="title f14 color333" data_to_title>#'+that.keyword+'#</div></td><td width="50"><div style="width:40px;height:23px;position:absolute;right:15px;bottom:10px;display:none" class="re" data_del_btn><span class="ui-icon-delete radius-2px"><em class="icon-delete icon-bg-common"></em></span></div></td></tr></table></div>'               
                
                $(this.el).html(html)
            }           
        
        })
		
		//话题视图
		var more_topic_view = Backbone.View.extend({
			tagName: "li",
			className: "",
			 initialize: function(json_data) 
    		  {
    		      this.render()
    	
    		  },
              events: 
              {
			    'tap [data_to_publish_topic]' : function()
                {   
					
				   if (_state && _state.textarea)
                   {   
				       //更新话题值
				      text_var = text_area.val()
					  
				      var _keyword = ("#"+this.keyword+"# ")
					
					  text_var += _keyword

					  text_area.val(text_var)
					  
                      page_control.back()
                   }
                                                                                                                                   
                }
              },
              render : function()
              {
                var json_data = this.model.toJSON() 
				
                this.keyword = json_data.keyword
    			this.desc = json_data.desc
				
    			var template = '<div class="list-box" data_to_publish_topic><div class="title f14 color333">#{{keyword}}#</div><p class="color999">{{desc}}</p></div>'
				var html = Mustache.to_html(template, json_data)
				
				this.$el.html(html)
                
              } 
			
		})	
			


	    options.page_before_show = function(page_view, params_arr, state)
        {
            if(get_localStorage())
			{
			    input_val_arr = get_localStorage()
				
			    fun_topic_list(input_val_arr) 	
			}
            
	
		 }
		
		var alert_tips
		var topic_arr
		var more_topic_collection_obj
		var _page_view
		var _state
		var text_area
		var text_var
		var view_scroll_obj
		var topic_list_height
		var input_val_arr = []
		var input_value_text
		var is_hold = true
		
		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
		   
		    //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
		   
		   input_value_text = page_view.$el.find('[data_to_topic_vaule]')
		   
		   topic_list_height =  window.innerHeight-108 
		   
		   //容器滚动
		    var wraper_con = $(page_view.el).find('.topic-list-wrap')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(wraper_con,{
				'view_height' : topic_list_height
			})
			
			_page_view = page_view
			_state = state
			
			text_area = _state.textarea   
			
			
			// 初始化数据集
			more_topic_collection_obj = new more_topic_collection              
			
			//个人主页九宫格图片刷新列表监听
			more_topic_collection_obj.bind('reset', more_topic_collection_list , page_view)
			
			more_topic_collection_obj.refresh()

		}
		
	    function more_topic_collection_list()
		{
			var that = this;			        
			_page_view.$el.find('.topic-list').html('')
			
			
			more_topic_collection_obj.each(function(item_model)
			{
				//渲染话题列表
				var more_topic_view_obj = new more_topic_view
                ({
                    model : item_model
                })	
				_page_view.$el.find('.topic-list').append(more_topic_view_obj.$el)
                
                
			})

		}
		
		
		function fun_topic_list(data)
        {
            _page_view.$el.find('[data_custom_topic]').html('')

            $(data).each(function(i,item_model)
            {
				//渲染用户自定义话题列表
			    if(data.length>0)
			    {
				    var custom_topic_view_obj = new custom_topic_view
					
                    ({ model : item_model})                                            

                     _page_view.$el.find('[data_custom_topic]').append(custom_topic_view_obj.$el)
			    }

                
                
            })
        }
		
		//设置自定义话题的本地变量
		function set_localStorage(data_arr)
        {
              var json_str = JSON.stringify(data_arr) 

              window.localStorage.setItem("record_topic_arr",json_str) 
        }
		
		//获取自定义话题的本地变量
		function get_localStorage()
        {

			 return JSON.parse(window.localStorage.getItem("record_topic_arr"))


        }
		
		
		function unique(arr)
        {
            //var a1=((new Date).getTime())
            for (var i = 0; i < arr.length; i++)
                for (var j = i + 1; j < arr.length; j++)
                    if (arr[i].keyword === arr[j].keyword)
                    {
                        arr.splice(j, 1);
                        j--;
                    }
            //console.info((new Date).getTime()-a1)
            return arr.sort(function(a, b)
            {
                return a - b
            });
        }
		
		var page = require('page').new_page(options);
		
		return page;
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}