define("wo/choose_my_image",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","new_alert_v2","img_process","popup","select_module"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
    var Mustache = require('mustache')
    var new_alert_v2 = require("new_alert_v2")
    var alert_tips
    

	exports.route = { "choose_my_image": "choose_my_image" }

	exports.new_page_entity = function()
	{
		var options = {	
			transition_type : 'slide',
			dom_not_cache: false
		}
		        

		var sizes = parseInt((window.innerWidth-(32))/3); // 屏宽-页面边距-每个小方图的边距        
        var loading = false
        var select_module_class = require("select_module")()        
        var cur_year = parseInt(new Date().getFullYear());                        
        var start_year = 1970;        
        var select_year_data = []
        var search_keyword = ""
        var search_year = 0 
        var search_month = 0                
        var select_year_obj
        var no_more_pics = false;
        
        common_function.send_request
		({
			url : wo_config.ajax_url.get_user_article_date ,
			type : "GET",
			data : { mod : 1 },
            callback : function(data)
            {               
               var arr = data.article_date;
               var len = arr.length;
               while(len--)
               {
                  select_year_data.push
                  ({
                     key : arr[len],
                     val : arr[len]
                  })
               }
                
               select_year_data.unshift({key :0 ,val : "不选"});  
               
               // 年份下拉框
 		       select_year_obj = new select_module_class
               ({ 
        			options_data : select_year_data,        			
        			onchange : function()
        			{
        				var select_data = this.get_select_data()		
                        
                        search_year = parseInt(select_data.key);
        				
        				_page_view.find("[data-year_txt]").html(select_data.val);
                        
                        if(search_year == 0)
                        {
                            _page_view.find("[data-select_month]").hide()
                            
                            select_month_obj.reset()
                
                            _page_view.find("[data-month_txt]").html("")    
                        }
                        else
                        {
                            _page_view.find("[data-select_month]").show()
                        }
                                                
        			}
        		})  
                                              
            }
		})
                                             
        
        
        
        // 月份下拉框
		var select_month_obj = new select_module_class({ 
			options_data : 
            [
                {key : 0 ,val : "不选"},
                {key : 1 ,val : "1月"},
                {key : 2 ,val : "2月"},
                {key : 3 ,val : "3月"},
                {key : 4 ,val : "4月"},
                {key : 5 ,val : "5月"},
                {key : 6 ,val : "6月"},
                {key : 7 ,val : "7月"},
                {key : 8 ,val : "8月"},
                {key : 9 ,val : "9月"},
                {key : 10 ,val : "10月"},
                {key : 11 ,val : "11月"},
                {key : 12 ,val : "12月"}
            ],			
			onchange : function()
			{
				var select_data = this.get_select_data()		
				
				_page_view.find("[data-month_txt]").html(select_data.val);
                
                search_month = parseInt(select_data.key);
			}
		})
        
        var collection_options = 
		{
			ajax_load_finish : function(model,response)
			{
				loading = false

				_page_view.find('[data_page_num]').css('color','#fff')
                
                _page_view.find('.loadding_tips').html("滑动到底部加载下一页").show();
                
                no_more_pics = false;
                
                if(response.list == null || response.list == false || response.list.length<20)
                {
                    _page_view.find('.loadding_tips').hide();
                    
                    no_more_pics = true;
                    
                    //alert_tips = new_alert_v2.show({text:"没有图片了", type : "info" ,auto_close_time:800})
                }
                
                alert_tips.close();
			},
            before_refresh : function()
			{
				loading = true                                
                
                alert_tips = new_alert_v2.show({text:"正在加载", type : "loading" ,is_cover:true,append_target:_page_view})

				_page_view.find('[data_page_num]').css('color','#8D8D8D')


                                 
			},
            before_get_more : function()
            {
                loading = true   
                
                _page_view.find('.loadding_tips').html("正在加载...").show();
            }
		}
        
        
		var index_page = 1
		var cat_name
        var idx_num = 1

		//初始化数据
		var my_life_grid_collection = Backbone.Collection.extend
        ({ 
			url : function()
			{
                return wo_config.ajax_url.get_choose_my_image 
			},
			get_data : function(page)
			{
				collection_options.data = {  p : page , search_keyword : search_keyword,search_year : search_year,search_month : search_month}

				common_function.collection_refresh_function.call(this,collection_options)
			},
            get_more_item : function(page)
			{
				var that = this                                

				collection_options.data = {  p : page , search_keyword : search_keyword,search_year : search_year,search_month : search_month}

				common_function.collection_get_more_function.call(this,collection_options)
			},
            parse: function(response) 
			{
				return response.list
			}
		})
        
        

        var publish_item_view = Backbone.View.extend
        ({
            tagName : "div",
            className : "grid_box_container white_container bdb-line",            
            initialize : function() 
    		{             
    		    var that = this;                                                                      
                
    			that.render();

    		},
    		events : 
            {
    			'tap' : function()
				{
					page_control.navigate_to_page("publish",{key_word : cat_name,camera_sharestr : "#"+cat_name+"#"})
				}
    		},
            render : function()
            {
                var template = '<div style="width:'+ sizes +'px;height:'+ sizes +'px"><table class="has_cover_container" cellspacing="0" cellpadding="0" border="0" width="100%" height="100%"><tr><td align="center" valign="middle"><div class="add_container"><div class="add_icon icon-bg-common" style="margin:0"></div></div></td></tr></table></div>'
                
                $(this.el).html(template) 
            }
        })
                
		var user_select_count = 0
		var tap_space = false

        // 九宫格项
        var my_life_grid_item_view = Backbone.View.extend
        ({
            tagName : "div",
            className : "grid_box_container",            
            initialize : function() 
    		{            
    		    var that = this;                                                                      
                
    			that.render();
                
    		},
    		events :
            {
    			'tap' : function(ev)
				{
				    var cur_btn = $(ev.currentTarget)                    

					var cover_wrap = this.$el.find('.selected')
                    
                    var is_select = 1		
                    
                    var img_url = cur_btn.find(".choose_img").attr("src");
					
					update_life_box_data(this.art_id , is_select)
                    
                    if(_state && _state.font_cover_btn)
                    {
                        if(_state.font_cover_btn.no_img_tag)// 新添加封面
                        {
                            
                            _state.font_cover_btn.reset_item(img_url,display_order)
                        }
                        else// 原来有封面，现在换新封面
                        {                            
                            _state.font_cover_btn.change_font_cover_img(img_url)    
                        }
                    }
                    
                    page_control.back()
				}
    		},
            render : function()
            {
                var that = this
                
                var data = this.model.toJSON();
                
                data.cover_img_url = common_function.matching_img_size(data.cover_img_url,"ss")
                
                that.cover_img_url = data.cover_img_url
                that.art_id = parseInt(data.art_id)
                that.is_exist = data.is_exists
                
           
                var template = '<div style="width:'+ sizes +'px;height:'+ sizes +'px"><div style="width:100%;height:100%" data-art_id="{{art_id}}" class="selected {{#is_exists}}has_selected{{/is_exists}}"  ><div class="selected_icon icon-bg-common"></div></div><img class="choose_img img_buffer_bg" src="{{cover_img_url}}"></div>' 
                
                var html = Mustache.to_html(template, data)			                                            
                
                $(this.el).html(html)
            }
            
        })

		
		options.initialize = function()
		{
			this.render();
		}
			
		options.render = function()
		{
			var template_control = require('get_template')

			
			var template_obj = template_control.template_obj()			       						

			var init_html = '<div class="wrap-box choose_pic_wrap" ><header class="choose_pic_header header font_wryh clearfix"><h3 class="tc"><span class="user_title"><label></label><span style="display: inline-block;overflow: hidden;">选择<label style="display:inline" data-cat_name></label>照片</span></span></h3><div class="ui-btn-header-wrap ui-btn-click-wrap" data-filter_in=""><div class="ui-btn-header ui-btn-filter ui-btn-click radius-2px"><label class="filter_text tc dib w-100 h-100 f12">查找</label></div></div></header><div class="content-8 main_wraper"><div class="choose_pic-box-page font_wryh" style="padding-top:60px;"><div style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);"></div></div><div class="grid_box"></div><div class="loadding_tips pb10" data-loadding_tips="正在加载..." data-before_load_tips="滑动到底部加载下一页">滑动到底部加载下一页</div></div></div></div><div class="wrap-box search_pics" style="display:none"><header class="search_pics_header header font_wryh clearfix"><div style="left: 5px;" data-back_to_list="" class="ui-btn-header-wrap"><div class="ui-btn-header ui-btn-prev radius-2px"><span class="icon icon-arrow icon-bg-common"></span></div></div><h3 class="tc"><span style="display: inline-block;overflow: hidden;">查找</span></h3><div class="ui-btn-header-wrap ui-btn-click-wra ui-btn-click-empty" data-filter_out="" style="width:72px"><div class="ui-btn-header ui-btn-filter bgc-fff-e6e ui-btn-click radius-2px" style="width:64px"><label class="filter_text tc dib w-100 h-100 f12">清空条件</label></div></div></header><div class="content-8 main_wraper"><div class="choose_pic-box-page font_wryh" style="padding-top:60px;"><div style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);"></div></div><div class="select-box-item"><div class="input-box bgcfff bdb-line"><input data-key_word type="text" class="input-class w-100 pl15 pr15 color999" value="" placeholder="输入关键字"></div><div class="select-box bgcfff color666 mt10 bdb-line"><div class="select-year select" data-select_year><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tr><td><div class="year"><span style="display:inline-block">选择年份</span><span data-year_txt class="time_txt" style="display:inline-block;color:#00922d;margin-left:5px"></span></div></td><td width="8"><span class="icon-go icon-bg-common"></span></td></tr></table></div><div class="select-year select" data-select_month style="border-bottom: none;display:none"><table border="0" cellspacing="0" cellpadding="0" class="w-100 f12"><tr><td><div class="day"><span style="display:inline-block">选择月份</span><span data-month_txt class="time_txt" style="display:inline-block;color:#00922d;margin-left:5px"></span></div></td><td width="8"><span class="icon-go icon-bg-common"></span></td></tr></table></div></div><div class="btn-search colorfff bdb-line tc mt10 f16" data-search_btn>查找</div></div></div></div></div>'       						

			this.$el.append($(init_html))

		}
		
		options.events = {

			'tap .ui-btn-prev-wrap' : function()
			{
				page_control.back()		
			},
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{
					page_control.back()
				}
			},
            'tap [data-filter_in]' : function()
            {
                _page_view.find('.choose_pic_wrap').hide();
                _page_view.find('.search_pics').show();
                                
            },
            'tap [data-filter_out]' : function()
            {
                // 清空条件
                
                search_keyword = "";
                
                search_year = 0;
                
                search_month = 0;
                
                select_year_obj.reset()
                
                select_month_obj.reset()
                
                _page_view.find("[data-key_word]").val("")                
                _page_view.find("[data-year_txt]").html("")
                _page_view.find("[data-month_txt]").html("")
                
                _page_view.find("[data-select_month]").hide()
                                
                
            },
            'tap [data-back_to_list]' : function()
            {
                _page_view.find('.choose_pic_wrap').show();
                _page_view.find('.search_pics').hide();
            },
            'tap [data-select_year]' : function()
            {
                select_year_obj.open()
                
                
            },
            'tap [data-select_month]' : function()
            {
                select_month_obj.open()
                
                _page_view.find("[data-month_txt]").html(select_month_obj.get_select_data().val);
            },
            'tap [data-search_btn]' : function()
            {
                search_keyword = encodeURIComponent(_page_view.find("[data-key_word]").val());   
                
                idx_num = 1;// 重置p             
                                
                my_life_grid_collection_obj.get_data(1)
                
                _page_view.find('.choose_pic_wrap').show();
                _page_view.find('.search_pics').hide();
                                
            }
		}

		
        options.window_change = function(page_view)
		{
			_page_view.find('.main_wraper').height(common_function.container_height_with_head())			

			sizes = parseInt((window.innerWidth-(32))/3); // 屏宽-页面边距-每个小方图的边距                        
            
            if(_page_view.find(".grid_box_container").last().width() != sizes)// 防止每次触发resize函数都赋值，导致滚动卡
            {
                _page_view.find(".grid_box_container").width(sizes).height(sizes)
            
            }
            
		}

        options.page_show = function(page_view,params_arr,state)
        {
            _state = state
            
            if(state && state.display_order!=null)
            {
                display_order = state.display_order
            }
        }
        
        
		var _page_view
		var tag_id
		var special_paging_view_obj
		var view_scroll_obj
        var _state
        var display_order

		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
		    var that = this		  			
			
            _page_view = $(page_view.el) 
            _state = state                      		
			
           
            
			//返回按钮
            var page_back_btn_container = $(page_view.el).find('.choose_pic_header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
						
            
			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')                        

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'recept_input' : true,
				'view_height' : common_function.container_height_with_head(),
                scroll_end : function(scroll_view_obj)
                {
                    if(no_more_pics)
                    {
                        return;
                    }
                    
                    var trigger_range = 50
            		var that = this
            		var cur_scroll_y = Math.abs(that.y)
            		var scroll_view_height = $(scroll_view_obj).height()                           
                    var container_height = $(page_view.el).find('.choose_pic-box-page').height()
                    
                    //console.log(cur_scroll_y +  scroll_view_height +trigger_range)
                    //console.log(container_height)                                                                                    
        
        			if((cur_scroll_y +  scroll_view_height + trigger_range) >= container_height)
        			{
        				if(!loading)
                        {
                            console.log("trigger")                                                
                    
                            idx_num ++;  
                        
                            my_life_grid_collection_obj.get_more_item(idx_num)
                        }
        			}
                    
                    
                }
			})                        
            

			
			
            // 初始化数据集
			my_life_grid_collection_obj = new my_life_grid_collection                                                            
			
			//刷新列表监听
			my_life_grid_collection_obj.bind('reset', render_list , page_view)
            
            //加载更多监听
			my_life_grid_collection_obj.bind('add', add_render_list , page_view) 

			my_life_grid_collection_obj.get_data(1)
		}
		
		var tap_space = false
		function update_life_box_data(art_id , is_select)
		{
			var is_select = is_select || 0

			common_function.send_request
			({
				url : wo_config.ajax_url.update_my_image_box,
				type : "GET",
				data : { art_id : art_id , is_select : is_select , display_order : display_order }
			})
            
            new_alert_v2.show({text:"已选择", type : "success" , auto_close_time : 800})
            
            /*
			if(is_select)
			{
				new_alert_v2.show({text:"已选择", type : "success" , auto_close_time : 800})
			}
            
			else
			{
				new_alert_v2.show({text:"已取消", type : "success" , auto_close_time : 800})
			}
            */
		}

		var only_one_page = true
		

		function render_list()
		{
			var that = this	
            
            _page_view.find('.grid_box').html('');                                     	        
                                                         
			my_life_grid_collection_obj.each(function(item_model)
			{
			    if(common_function.is_empty(item_model.attributes.cover_img_url))
                {
                    return false
                }
                 
				var item_view = new my_life_grid_item_view
                ({ 
					model : item_model         
				})			            
				
				_page_view.find('.grid_box').append(item_view.$el)			 
			})
            
            

			view_scroll_obj.scroll_to(0)
		}
        
        function add_render_list(item_model)
		{
			var that = this;
            
            if(common_function.is_empty(item_model.attributes.cover_img_url))
            {
                return false
            }			        
                                                         
			var item_view = new my_life_grid_item_view
            ({ 
				model : item_model              
			})			            
			
			//每次add入列表
			_page_view.find('.grid_box').append(item_view.$el)			

            
		}
        
        
        
		var page = require('page').new_page(options)
		
		return page
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}