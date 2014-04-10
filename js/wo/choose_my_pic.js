define("wo/choose_my_pic",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","new_alert_v2","img_process","popup"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
    var Mustache = require('mustache')
    var new_alert_v2 = require("new_alert_v2")
    var alert_tips
    

	exports.route = { "choose_my_pic(/:tag_id)": "choose_my_pic" }

	exports.new_page_entity = function()
	{
		var options = {	
			transition_type : 'slide',
			dom_not_cache: true
		}
		

		var sizes = parseInt((window.innerWidth-(32))/3); // 屏宽-页面边距-每个小方图的边距
        
        var loading = false
        var collection_options = 
		{
			ajax_load_finish : function(model,response)
			{
				loading = false

				_page_view.find('[data_page_num]').css('color','#fff')
                
                _page_view.find('.loadding_tips').html("滑动到底部加载下一页").show();
                
                if(response.list == null || response.list == false)
                {
                    _page_view.find('.loadding_tips').hide();
                }
                
                alert_tips.close();
			},
            before_refresh : function()
			{
				loading = true                                
                
                alert_tips = new_alert_v2.show({text:"正在加载", type : "loading" ,is_cover:true,append_target: _page_view})

				_page_view.find('[data_page_num]').css('color','#8D8D8D')

                special_paging_view_obj.loadding()
                                 
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
                return wo_config.ajax_url.get_my_life_pics
			},
			get_data : function(page)
			{
				collection_options.data = { tag_id : tag_id , p : page}

				common_function.collection_refresh_function.call(this,collection_options)
			},
            get_more_item : function(page)
			{
				var that = this

				collection_options.data = { tag_id : tag_id , p : page}

				common_function.collection_get_more_function.call(this,collection_options)
			},
            parse: function(response) 
			{
				index_page = response.index_page
				cat_name = response.cat_name
				
				_page_view.find('[data_page_num]').html(index_page)
                
                /*
				if(response.can_next_page)
				{
					special_paging_view_obj.use_next_btn()
				}
				else
				{
					special_paging_view_obj.ban_next_btn()
				}

				if(response.can_pre_page)
				{
					special_paging_view_obj.use_pre_btn()
				}
				else
				{
					special_paging_view_obj.ban_pre_btn()
				}
				
				
				if(response.total_page > 1 )
				{
					render_page_list(response.total_page)
				}
                */
				
				
				return response.list
			}
		})
        


        
        // 特殊分页按钮
        var special_paging_view = Backbone.View.extend
        ({
            tagName : "div",
            className : "comment-love-mod",            
            initialize : function() 
    		{             
    		    var that = this;                                                                      
                
    			that.render();
    		},
            render : function()
            {
                var that = this                                
                
                var template = '<ul class="clearfix"><li pre_page_btn="" class="pre" style="width:40%"><em class="icon icon-bg-common" style="margin: 0px 15px -4px 0;display:inline-block"></em>上一页</li><li data-page_num style="width:20%"><label data_page_num style="font-size:18px">1</label><em class="icon_arrow_down icon-bg-common" style="display:inline-block;vertical-align: 2px;"></em></li><li class="next" next_page_btn="" style="width:40%">下一页<em class="icon icon-bg-common" style="margin: 0px 0 -4px 15px;display:inline-block"></em></li></ul>'
                
                $(this.el).html(template)              
            },
			loadding : function()
			{
				$(this.el).find('[next_page_btn]').removeClass("click")
				$(this.el).find('[pre_page_btn]').removeClass("click")
			},
            reset : function()
			{
				this.pre_ban = false
				this.next_ban = false
			},
            use_pre_btn : function()
            {
                this.pre_ban = false
                $(this.el).find('[pre_page_btn]').addClass("click")
            },
            use_next_btn : function()
            {
                this.next_ban = false
                $(this.el).find('[next_page_btn]').addClass("click")
            },
            ban_pre_btn : function()
            {
                this.pre_ban = true
                $(this.el).find('[pre_page_btn]').removeClass("click")
            },
            ban_next_btn : function()
            {
                this.next_ban = true
                $(this.el).find('[next_page_btn]').removeClass("click")
            },
            get_pre_page_btn_ban_mode : function()
			{
				return this.pre_ban
			},
			get_next_page_btn_ban_mode : function()
			{
				return this.next_ban
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
    			'tap' : function()
				{
					if(tap_space)
					{
						new_alert_v2.show({text:"你操作得太快拉", type : "info" , auto_close_time : 1000})
						return 
					}

					tap_space = true

					var cover_wrap = this.$el.find('.selected')

					if(cover_wrap.hasClass('has_selected'))
					{
						var is_select = 0

						user_select_count--
						cover_wrap.removeClass('has_selected')
					}
					else
					{
						var is_select = 1

						user_select_count++
						cover_wrap.addClass('has_selected')
					}
					
					update_life_box_data(this.art_id , is_select)
					

					setTimeout(function(){
						tap_space = false
					},300)
				}
    		},
            render : function()
            {
                var that = this
                
                var data = this.model.toJSON();
                
                data.cover_img_url = common_function.matching_img_size(data.cover_img_url,"ss")
                
                that.cover_img_url = data.cover_img_url
                that.art_id = parseInt(data.art_id)
                that.is_exist = data.is_exist
                
           
                var template = '<div style="width:'+ sizes +'px;height:'+ sizes +'px"><div style="width:100%;height:100%" data-art_id="{{art_id}}" class="selected {{#is_exist}}has_selected{{/is_exist}}"  ><div class="selected_icon icon-bg-common"></div></div><img class="choose_img img_buffer_bg" src="{{cover_img_url}}"></div>' 
                
                var html = Mustache.to_html(template, data)			                                            
                
                $(this.el).html(html)
            }
            
        })
        
        // 已经选中的格项
        var has_choose_grid_item_view = Backbone.View.extend
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
    			'tap' : function()
				{
					
				}
    		},
            render : function()
            {
                var that = this
                
                var data = this.model.toJSON();
                
                data.cover_img_url = common_function.matching_img_size(data.cover_img_url,"ss")
                
                that.cover_img_url = data.cover_img_url
                that.art_id = parseInt(data.art_id)
                that.is_exist = data.is_exist
                
           
                var template = '<div style="width:'+ sizes +'px;height:'+ sizes +'px"><div style="width:100%;height:100%" data-art_id="{{art_id}}" class="selected {{#is_exist}}has_selected{{/is_exist}}"  ><div class="selected_icon icon-bg-common"></div></div><img class="choose_img img_buffer_bg" src="{{cover_img_url}}"></div>' 
                
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
			
			var init_html = '<div class="wrap-box choose_pic_wrap"><header class="choose_pic_header header font_wryh clearfix"><h3 class="tc"><span class="user_title"><label></label><span style="display: inline-block;overflow: hidden;">选择<label style="display:inline" data-cat_name></label>照片</span></span></h3></header><div class="content-8 main_wraper"><div class="choose_pic-box-page font_wryh" style="padding-top:60px;"><div style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);"></div></div><div class="grid_box"></div><div class="loadding_tips" data-loadding_tips="正在加载..." data-before_load_tips="滑动到底部加载下一页" >滑动到底部加载下一页</div></div></div><div class="has_choos_pics_box"><div class="btn_container"><div class="des">当前选中 <label data-pics_num>0</label> 张 (最多选择9张)</div><div class="ok_btn">确定</div></div><div class="pics_list"><div class="pics_list_container"></div></div></div></div><div class="wrap-box page_list_wrap" style="display:none"><header class="page_list_header header font_wryh clearfix"><h3 class="tc"><span class="user_title"><div class="ui-btn-header-wrap back_to_box_list" style="left:5px"><div class="ui-btn-header ui-btn-prev radius-2px"><span class="icon icon-arrow icon-bg-common"></span></div></div><span style="display: inline-block;overflow: hidden;">选择页数</span></span></h3></header><div class="content-8 main_wraper"><div class="page_list_container"><div class="page_list" style="padding-top:55px;padding-bottom:10px"></div></div></div></div>'       						

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
            'tap [pre_page_btn]' : function()
			{
                if( special_paging_view_obj.get_pre_page_btn_ban_mode() ) return false								
				
				var pre_page = index_page - 1
				my_life_grid_collection_obj.get_data(pre_page)                
			},
			'tap [next_page_btn]' : function()
			{
                if( special_paging_view_obj.get_next_page_btn_ban_mode() ) return false
				
				var next_page = index_page + 1
				my_life_grid_collection_obj.get_data(next_page) 
			},
            'tap [data-page_num]' : function()
            {
				if(loading) return 
				if(only_one_page) return

                _page_view.find(".page_list_wrap").show();
                _page_view.find(".choose_pic_wrap").hide();
            },
            'tap .back_to_box_list' : function()
            {
				if(loading) return 

                _page_view.find(".page_list_wrap").hide();
                _page_view.find(".choose_pic_wrap").show();
            },
            'tap .select_page_container' : function(ev)
            {
				if(loading) return 

                var select_page = $(ev.currentTarget).attr('data-page')

				my_life_grid_collection_obj.get_data(select_page)

				_page_view.find(".page_list_wrap").hide()
                _page_view.find(".choose_pic_wrap").show()
            },
			'tap .ui-btn-save-wrap' : function()
			{
				if(user_select_count>0)
				{
					new_alert_v2.show({text:"已新添加 "+user_select_count+" 张图片", type : "info" , auto_close_time : 2000})
				}

				page_control.back()
			}
		}

		
        options.window_change = function(page_view)
		{
			_page_view.find('.main_wraper').height( window.innerHeight - 114)
			

			sizes = parseInt((window.innerWidth-(32))/3); // 屏宽-页面边距-每个小方图的边距                        
            
            if(_page_view.find(".grid_box_container").last().width() != sizes)
            {
                _page_view.find(".grid_box_container").width(sizes).height(sizes)
                            
            }
            
		}
        
        
		var _page_view
		var tag_id
		var special_paging_view_obj
		var view_scroll_obj

		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
		    var that = this		  			
			
            _page_view = $(page_view.el)             
			tag_id = params_arr[0]
            
			
            if(state && state.cat_name)
            {
                cat_name = state.cat_name

				//设置标题
				$(page_view.el).find('[data-cat_name]').html(cat_name)
            }
			

			//返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)


			//分页按钮
			special_paging_view_obj = new special_paging_view()                       
			//page_view.$el.find(".choose_pic_wrap").append(special_paging_view_obj.$el)
			
			
            
			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')                        

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'recept_input' : true,
				'view_height' : window.innerHeight - 114,
                scroll_end : function(scroll_view_obj)
                {
                    /**/
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
            
            /*
			var page_list_scroll_view = view_scroll.new_scroll($(page_view.el).find('.page_list_container'),{
				'recept_input' : true,
				'view_height' : common_function.container_height_with_head()
			})
            */ 
			
			
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
				url : wo_config.ajax_url.update_my_life_grid_box,
				type : "GET",
				data : { tag_id : tag_id , art_id : art_id , is_select : is_select }
			})

			if(is_select)
			{
				new_alert_v2.show({text:"已选择", type : "success" , auto_close_time : 800})
			}
			else
			{
				new_alert_v2.show({text:"已取消", type : "success" , auto_close_time : 800})
			}
		}

		var only_one_page = true
		// 渲染页数
        function render_page_list(total_page)
        {           
			only_one_page = false

            var tpl = '';
            
            for(var i=0;i<total_page;i++)
            {
				var page = (i+1)
                tpl += '<div class="normal_item_list select_page_container" data-page="'+page+'"><div class="input-box" data-to_selected_page><table border="0" cellspacing="0" cellpadding="0" class="reset_table"><tbody><tr><td style="width: 100%;"><span data-page_num_txt>'+page+'</span></td></tr></tbody></table></div></div>';
            }
            
            _page_view.find(".page_list").html(tpl)
        }  


		function render_list()
		{
			var that = this	
            
            _page_view.find('.grid_box').html('');           
            

            if(index_page == 1)
            {
				
                var publish_item_view_obj = new publish_item_view();
                
                // 添加第一页的第一项为发布按钮
               _page_view.find('.grid_box').append(publish_item_view_obj.$el)	
            }                	        
                                                         
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
        
        function init_has_choose_pics(data)
        {
            var data = data || {};
            var choose_pics_num = data.choose_pics_num;
            var choose_pics_list = data.choose_pics_list || {};
            
            _page_view.find('[data-pics_num]').html(choose_pics_num)
            
            for(var i = 0 ; i<choose_pics_list.length;i++)
            {
                var item = new has_choose_grid_item_view();
            }
            
            _page_view.find('.pics_list_container').append(item_view.$el)
        }
        
        
		var page = require('page').new_page(options)
		
		return page
	}
})