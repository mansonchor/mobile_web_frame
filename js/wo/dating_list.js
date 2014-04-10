define("wo/dating_list",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view","new_alert_v2","img_process","popup"],function(require, exports)
{
	var $ = require('zepto')
	var cookies = require('cookies')

	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
    var new_alert_v2 = require("new_alert_v2")
	var img_process = require('img_process')
    var Mustache = require('mustache')    
    var popup = require('popup')    
    var alert_tips = null    
    var page_count = 10
    var cat_conf_name = ""
    
	exports.route = { "dating_list": "dating_list" }

	exports.new_page_entity = function()
	{
		var options = {
			route : { "dating_list": "dating_list" },		
			transition_type : 'slide',
			dom_not_cache: true
		};	
		
        //数据model
		var dating_model = Backbone.Model.extend({
			defaults:{}
		})
        
        var collection_options = 
		{
			ajax_load_finish : function(model,response,ajax_failed,index_page)
			{
                alert_tips.close();
                
                if(response==false)
                {
                    dating_controler_obj.return_paging_btn().hide()
                    
                    new_alert_v2.show({ text:"没有寻找到合适的人",type : "info" , is_fade : false ,is_cover:true , auto_close_time : 1000 , closed_callback : function(){
						
                        
                        
						_page_view.find("[data-dating_list]").show();
                        _page_view.find("[data-filter_tag]").hide();                                                
                        
                        var data_sex_icon = get_local_storage("select_sex") 
                        
                        if(common_function.is_empty(data_sex_icon))
                        {
                            data_sex_icon = "全部"  
                            
                            set_local_storage("select_sex",data_sex_icon) 
                            
                            _page_view.find("[data-sex_icon='"+data_sex_icon+"']").find(".base_style").addClass("cur");
                        }
                        
                        set_local_storage("location_id","");    
                        set_local_storage("location_value","所有地区"); 
                        
                        cat_conf_name = "";
                        set_local_storage("cat_conf_name","");   
                        
                        dating_collection_obj.refresh() 
                                                
					}})
                                        
                }
                
                _page_view.find(".dating_list_container").css("visibility","visible");         
                 
                if(response==null)
    			{
    				dating_controler_obj.return_paging_btn().reset()                                        
                    
    				return
    			}
                                
    
    			if(index_page>1) 
    			{
					 _page_view.find(".banner").hide()

    				dating_controler_obj.return_paging_btn().open_pre_page_btn()
    			}
    			else
    			{
    				dating_controler_obj.return_paging_btn().ban_pre_page_btn()
    			}
    			
    			if(response==false || response.length < page_count)
    			{
    				dating_controler_obj.return_paging_btn().ban_next_page_btn()
    			}
    			else
    			{
    				dating_controler_obj.return_paging_btn().open_next_page_btn()
    			}                           
			},
			before_refresh : function()
			{	
			     alert_tips = new_alert_v2.show({text:"寻找中",type : "loading",append_target : _page_view,is_cover : true ,auto_close_time:false});
			},
            before_get_more : function()
            {
                dating_controler_obj.more_btn_loading();
            }
		}
        
        // 数据集
        var dating_collection = Backbone.Collection.extend({
			model : dating_model,
			refresh : function()
			{
			    var sex = get_local_storage("select_sex")                                
                
				if(common_function.is_empty(sex))
				{
					sex = "all"
				}
                
                if(sex == "全部")
                {
                    sex = "all"
                }
                
                var location_id = get_local_storage("location_id")
				if(common_function.is_empty(location_id))
				{
					location_id = ""
				}
                
                var cat_conf_name = get_local_storage("cat_conf_name")
                if(common_function.is_empty(cat_conf_name))
				{
					cat_conf_name = ""
				}
             
				collection_options.data = { sex :sex , location_id :location_id ,cat_conf_name : cat_conf_name }                                                            

				common_function.collection_refresh_function.call(this,collection_options)
                
                
			},
			get_more_item : function(is_pre_page)
			{
				var that = this
                
                var sex = get_local_storage("select_sex")
				if(common_function.is_empty(sex))
				{
					sex = "all"
				}
                
                if(sex == "全部")
                {
                    sex = "all"
                }
                
                var location_id = get_local_storage("location_id") 
				if(common_function.is_empty(location_id))
				{
					location_id = ""
				}
                
                var cat_conf_name = get_local_storage("cat_conf_name")
                if(common_function.is_empty(cat_conf_name))
				{
					cat_conf_name = ""
				}

                
                //瀑布流列表的order ukey处理
				if(this.models.length>0 && !is_pre_page)
				{
					collection_options.data = { sex :sex , location_id :location_id,cat_conf_name : cat_conf_name}
				}
				else
				{
					options.data = {}
				}
				

				common_function.collection_get_more_function.call(this,collection_options,is_pre_page)
			},
			parse: function(response) 
			{
				if(response && typeof(response.result_data)!="undefined")
				{				    
				    
					return response.result_data
				}
				else
				{
					return response
				}
			},
			url : function()
            {                                
                return wo_config.ajax_url.dating_list+"?is_online="+1;   
            }
		})
        
        //列表子项视图
        var dating_item_view = Backbone.View.extend
        ({
            className : "border_item bdb-line",  
            tagName :  "div",		                		
            initialize : function(options)
            {
    
                var data = this.img_size_sort(this.model.toJSON());                                
                
                if(data.location_province == data.location_city)
                {
                    data.location_name = data.location_city
                }
                else
                {
                    
                    if(!common_function.is_empty(data.location_city))
                    {
                        data.location_name = data.location_province + "·" + data.location_city
                    }
                    else
                    {
                        data.location_name = data.location_province     
                    }
                    
                }
                

                this.user_id = data.user_id
                               
                var template = '<div style="padding:10px"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td width="62" data-nav_userprofile="" data-user_nav><div class="user-img"><img lazyload_src="{{user_icon}}"></div></td><td data-nav_userprofile="" data-user_info="" data-user_nav><div class="clearfix"><div class="user_name fl" data-user_name="">{{nickname}}</div><span class="sex_icon_container {{#age}}has_age{{/age}}"><i class="sex_icon icon-bg-common fl " style="{{^age}}margin:0{{/age}}"></i><span class="age">{{age}}</span></span></div><div class="location_name" data-location_name="">{{location_name}}</div></td><td></td><td data-follow_btn_area align="right"></td></tr></tbody></table><div class="tag_container">{{#tags_arr}}<span class="tag_text radius-2px">{{tag_txt}}</span>{{/tags_arr}}</div><p class="des" style="{{^user_describe}}margin-top:0{{/user_describe}}">{{{user_describe}}}</p><div class="like-photo clearfix">{{#custom_data}}{{#cover_img_url_ss}}<img lazyload_src="{{cover_img_url_ss}}" data-nav_art="{{art_id}}" data-img_width="{{cover_img_url_width}}" data-img_height="{{cover_img_url_height}}" class="img_buffer_bg imgs " style="width:{{pic_size}}px;height:{{pic_size}}px;">{{/cover_img_url_ss}}{{/custom_data}}</div></div>'                                
                
                this.options = options;
                
                // 判断好友关系        
			    var ofb = {};
                    
				if(_state)
				{
					ofb = _state.follow_btn_obj
					
				}
				
				new_follow_btn = require('follow_btn')();                        
				
				follow_btn = new new_follow_btn
				({
					status : data.follow_status,
					user_id : data.user_id,
					other_follow_btn : ofb,
					account_type : "dating"
				})   
                
                
                this.new_follow_btn = follow_btn; 
                
                var html = Mustache.to_html(template, data)                                                                                
					
                $(this.el).html(html)                                    
                
                if(data.sex=="男")
                {
                    $(this.el).find('.sex_icon_container').addClass("icon_male_color")
                    $(this.el).find('.sex_icon').addClass("icon_male_style")
                                        
                }
                else if((data.sex=="女"))
                {
                    $(this.el).find('.sex_icon_container').addClass("icon_female_color")
                    $(this.el).find('.sex_icon').addClass("icon_female_style")                    
                }              
                
                if(data.had_like)
    			{
    				this.$el.find('.btn-love i').addClass("cur")
    			}
    			else
    			{
    				this.$el.find('.btn-love i').removeClass("cur")
    			}                  
                
                if(this.new_follow_btn)
                {
                    $(this.el).find('[data-follow_btn_area]').html("")
                
 				    $(this.el).find('[data-follow_btn_area]').html(this.new_follow_btn.$el)    
                }
                
                             
                
            },
            img_size_sort : function(model_data)
    		{   
                var len = model_data.custom_data.length
                
    		    for(var i = 0;i<len;i++)
                {
                    var custom_data = model_data.custom_data[i]
                    
                    if(!common_function.is_empty(custom_data.cover_img_url))
                    {                        
                        custom_data.cover_img_url_ss = common_function.matching_img_size(custom_data.cover_img_url,"ss")
    
    					//根据计算的图片大小值
    					custom_data.pic_size = this.options.pic_size                            
                    }                                                            
                }      		                                                								
    			
    			return model_data
    		},
			//针对新闻列表item的tap导航
			events : 
            {
                'tap [data-user_nav]' : 'navigate_to_user',
                'tap [data-nav_art]'  : 'navigate_to_art'                                  
			},                        
    		navigate_to_user : function()
    		{		    
                if(!this.user_id) {return;}    
                
                var btn_obj
				
				if(this.new_follow_btn) 
				{ 
					btn_obj =  this.new_follow_btn 
				}                                     
                                    
                page_control.navigate_to_page("user_profile/"+this.user_id,{ follow_btn_obj : btn_obj} )
    				
    		},
            navigate_to_art : function(ev)
            {
                var art_id = $(ev.currentTarget).attr("data-nav_art")
				
				var cover_img_width = $(ev.currentTarget).attr("data-img_width")
				var cover_img_height = $(ev.currentTarget).attr("data-img_height")
				
    			page_control.navigate_to_page("last/"+art_id +"/from_profile", { cover_img_width : cover_img_width,cover_img_height : cover_img_height } )
            }
            
        })
        
        // 控制器
        var dating_controler = Backbone.View.extend
        ({
            initialize : function()
			{
				var that = this ;
                
                //加载更多按钮   add by manson 2013.5.7
				var load_more_btn = require('paging_btn')()                
                
				$(this.el).parent().append(load_more_btn.$el)                                

				that.load_more_btn = load_more_btn    
                                
			},
			add_list_item : function(item_view)
			{
                var that = this;
			 
				$(this.el).append(item_view.$el)
                
                that.load_more_btn.show()
			},
			clear_list : function()
			{
				$(this.el).html("");
                                						
			},
			return_paging_btn : function()
			{
				return this.load_more_btn
			},
            more_btn_loading : function()
			{
				this.load_more_btn.loadding()
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
			
			var init_html = template_obj.dating                                						

			this.$el.append($(init_html)) 

		}
		
		options.events = {
			//后退
			'tap .ui-btn-prev-wrap' : function(ev)
			{
				page_control.back()
			},
            'tap [data-back_to_list]' : function(ev)
			{
				_page_view.find("[data-dating_list]").show();
                _page_view.find("[data-filter_tag]").hide();
			},
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{
					page_control.back()
				}
			},
            'tap [data-sex_icon]' : function(ev)
            {
                var sex_icon_container = _page_view.find("[data-sex_icon]");
                
                var cur_btn = $(ev.currentTarget);
                
                sex_icon_container.find(".base_style").removeClass("cur");
                sex_icon_container.find(".icon_text").removeClass("cur");
                
                cur_btn.find(".base_style").addClass("cur");
                cur_btn.find(".icon_text").addClass("cur");
                
                var select_sex = ""
                
                if(cur_btn.attr("data-sex_icon") == "全部")
                {
                    select_sex =  "all"
                    
                    set_local_storage("select_sex","全部");
                }
                else
                {
                    select_sex =  cur_btn.attr("data-sex_icon")
                    
                    set_local_storage("select_sex",select_sex);
                }
                
                
                
            },
            'tap [data-to_nav_location]' : function(ev)
			{
				page_control.navigate_to_page("set_location",{edit_location_obj : _page_view.find("[data-location_value]") })
			},
            'tap [data-filter_out]' : function(ev)
            {                
                _page_view.find("[data-dating_list]").show();
                _page_view.find("[data-filter_tag]").hide();
                
                var location_id = _page_view.find("[data-location_value]").attr("data-city_id")
                var location_value = _page_view.find("[data-location_value]").val()
                
				if(common_function.is_empty(location_id))
				{
					location_id = ""
				}
                
                cat_conf_name = encodeURIComponent(get_local_storage("tag_selected"));


                set_local_storage("location_id",location_id)  
                set_local_storage("location_value",location_value)
                
                dating_collection_obj.refresh() 


            },
            'tap [data-filter_in]' : function(ev)
            {
                _page_view.find("[data-dating_list]").hide();
                _page_view.find("[data-filter_tag]").show();    
                
                var data_sex_icon = get_local_storage("select_sex") 
                var location_id = get_local_storage("location_id")
                var location_value =get_local_storage("location_value")  
                
                
            
                _page_view.find("[data-sex_icon]").find(".base_style").removeClass("cur")
                _page_view.find("[data-sex_icon]").find(".icon_text").removeClass("cur")
                
                if(common_function.is_empty(data_sex_icon))
                {
                    data_sex_icon = "全部"   
                }
                
                _page_view.find("[data-sex_icon='"+data_sex_icon+"']").find(".base_style").addClass("cur"); 
                _page_view.find("[data-sex_icon='"+data_sex_icon+"']").find(".icon_text").addClass("cur"); 
                
                if(location_id)
                {
                    _page_view.find("[data-location_value]").val(location_value);
                    _page_view.find("[data-location_value]").attr("data-city_id",location_id);
                }
                else
                {
                    _page_view.find("[data-location_value]").val("所有地区");
                }
                
                //初始化选中的tag
                _page_view.find("[data-tag]").removeClass("selected");                                
                
                var tag_selected = get_local_storage("tag_selected")
                
                _page_view.find("[data-tag='"+tag_selected+"']").addClass("selected")

				//塞选条件页PV统计 add by manson 2013.9.30
				var stat_url = 'http://imgtj.poco.cn/poco_tj.css?tj_file=filter&tmp=' + Math.random()
				var stat_img = new Image()
				stat_img.src = stat_url
                                   
            },            
			'tap .pre_paging_btn' : function()
			{
				var paging_btn = dating_controler_obj.return_paging_btn()
				
				if( paging_btn.get_pre_page_btn_ban_mode() ) return false
                
				dating_collection_obj.get_more_item(true)
			},
			'tap .next_paging_btn' : function()
			{
				var paging_btn = dating_controler_obj.return_paging_btn()
				
				if( paging_btn.get_next_page_btn_ban_mode() ) return false

				dating_collection_obj.get_more_item(false)
			},
            'tap [data-tag]' : function(ev)
            {
                var cur_btn = $(ev.currentTarget);                                
                
                if(cur_btn.hasClass("selected"))
                {
                    set_local_storage("tag_selected","")
                    
                    cur_btn.removeClass("selected")
                                        
                }
                else
                {
                    _page_view.find("[data-tag]").removeClass("selected");
                    
                    cur_btn.addClass("selected")    
                    
                    set_local_storage("tag_selected",cur_btn.attr("data-tag"))
                                        
                }
                
                
                
                
            }
            
            
            
		}

		
		var user_info_obj
		var _page_view
		var _params_arr
		var _state
		var user_info_refresh_btn
        var blog_id
        var dating_collection_obj
        var dating_controler_obj
        var follow_btn 
        
        options.page_before_show = function()
        {
            var sex_icon = _page_view.find(".base_style");
            
            var icon_size = get_sex_icon_size();
            
            sex_icon.width(icon_size).height(icon_size)
            
            $(window).bind("resize",function()
            {
                var icon_size = get_sex_icon_size();
            
                sex_icon.width(icon_size).height(icon_size)
                
                _page_view.find('.like-photo img').css({height:'auto'})
            })
        }
        
        options.window_change = function(page_view)
		{		               
            $(page_view.el).find('.imgs').width(get_list_pic_size()).height(get_list_pic_size())         
		}
        
        var poco_id
    
		//页面初始化时
		options.page_init = function(page_view,params_arr,state)
		{
			
			var that = this;
            
            _page_view = $(page_view.el)             
			
            poco_id = common_function.get_local_poco_id();     

			//容器滚动
			var main_wraper = $(page_view.el).find('.dating_list')

			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{				
				'view_height' : common_function.container_height_with_head(),
				use_lazyload : true
			})
            
            view_filter_scroll_obj = view_scroll.new_scroll($(page_view.el).find(".filter_info_container"),{				
				'view_height' : common_function.container_height_with_head(),
				use_lazyload : true
			})
            
            if(state&&state.tag_name)
            {
                cat_conf_name = encodeURIComponent(state.tag_name);
                
                set_local_storage("tag_selected",state.tag_name)
            }
            else
            {
                cat_conf_name = encodeURIComponent(get_local_storage("tag_selected"));    
            }
            
            
            
            _state = state;                                                                                              
                        
            dating_collection_obj = new dating_collection;   
            
            dating_controler_obj = new dating_controler
            ({
                el : _page_view.find('.dating_list_container')
            });
            
            //刷新列表监听
			dating_collection_obj.bind('reset', re_render_list , page_view)
			
			//加载更多监听
			dating_collection_obj.bind('add', add_render_list , page_view)
            
            dating_collection_obj.refresh()
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find("header[data-dating_list]")
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
            
            show_interest_tag()
            
		}

	   
		function re_render_list()
		{  
			common_function.page_pv_stat_action()

		    dating_controler_obj.clear_list()
            
			dating_collection_obj.each(function(item_model)
			{

				var item_view = new dating_item_view({ 
					model : item_model,
                    pic_size : get_list_pic_size() 			                
				})			            
				
				//每次add入列表
				dating_controler_obj.add_list_item(item_view)		 
	 
			})
            
            //滚回顶部
			view_scroll_obj.scroll_to(0)
			_page_view.$el && _page_view.$el.find('header').animate({'translate3d':'0px, 0px, 0px'},0,'ease-in')
            
		}
        
        function add_render_list(item_model)
		{	   
			var item_view = new dating_item_view({ 
				model : item_model,
                pic_size : get_list_pic_size() 	 			      
			})                			
			
			//每次add入列表
			dating_controler_obj.add_list_item(item_view)   						  
		}
        
        function get_sex_icon_size()
        {
            return parseInt((window.innerWidth -25*2-20-35*2)/3);
        }
        
        function get_list_pic_size()
        {
            // 计算图片宽高
            return parseInt( (window.innerWidth - 20 - 10 * 5)/4 )
                         
        }
        
        function set_local_storage(key,value)
        {
            window.localStorage.setItem(key,value);
        }
        
        function get_local_storage(key)
        {
            return window.localStorage.getItem(key);
        }
        
        // 显示标签
        function show_interest_tag()
        {
            var data = wo_config.category_arr;
            
            var str = '';                           
            
            for(var i=0;i<data.length;i++)
            {
                str+= '<span data-tag="'+data[i]+'" class="tag_text radius-2px">'+data[i]+'</span>'
            }                                                                       
				
            _page_view.find('.tag_container').html(str)
        }
		
		var page = require('page').new_page(options);
		
		return page;
	}
})

if(typeof(process_add)=="function")
{
	process_add()
}