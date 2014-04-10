/*
    hdw 照片榜
*/
define("wo/pics_rank",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","rank_nav","select_module","notice"],function(require, exports)
{
    var $ = require('zepto')
    var page_control = require('page_control')
    var Backbone = require('backbone')
    var common_function = require('commom_function')
    var wo_config = require('wo_config')    
    var new_alert_v2 = require("new_alert_v2")
    var Mustache = require('mustache')
    var select_module_class = require("select_module")()
    var notice = require('notice')
    
    exports.route = { "pics_rank(/:time)": "pics_rank" }

    exports.new_page_entity = function()
    {
        var options = {     
            title : "照片排行榜",
            route : { "pics_rank": "pics_rank" },
            transition_type : 'slide'
        }
        
        var view_scroll_obj     
        var _params_arr
        var _page_view
        var _params_obj
        var rank_nav_view
        var rank_nav_view_obj    
        var pics_rank_collection_obj   
        var location_city
        var cur_city = ''
        var cur_type 
        var page_count = 21
        var data_week_refresh = false 
        var data_day_refresh = true 
        var week_list_controller_obj
        var day_list_controller_obj
        var location_arr = [];
        var city_select_obj
        var first_time_load = false
        
        var load_more_ing = false
        var last_select_city_change = "";
        var select_defalut_key = "";
        var poco_id 
        var alert_tips
    
        var collection_options = 
        {
            ajax_load_finish : function(model,response,ajax_failed)
            {   
                alert_tips.close();
                
                load_more_ing = false
                
                if(poco_id > 0)
                {
                    if(!city_select_obj)
                    {
                        location_arr = response.location.select_list; 
                    
                        if(location_arr.length >0)
                        {                                    
                            select_defalut_key = response.location.cur_location_key
                            
                            if(!first_time_load)
                            {
                                var cur_location_city_name = response.location.cur_location_name
                            
                                _page_view.$el.find("[data_city_value]").html(cur_location_city_name)   
                                
                                first_time_load = true;  
                            }
                            
                            _page_view.$el.find('[data_select_location]').show();
                                                  
                        }                                                 
                        else
                        {
                            _page_view.$el.find('[data_select_location]').hide();
                        }                                                                
                        
                        console.log("new select_module_class")
                        
                        //地区下拉
                        city_select_obj = new select_module_class
                        ({ 
                            options_data : location_arr,
                            default_key : select_defalut_key,
                            onchange : function()
                            {
                                select_data = this.get_select_data()
                                
                                cur_city = select_data.key                                                                
                                
                                var cur_location_city = select_data.val
                    
                                _page_view.$el.find("[data_city_value]").html(cur_location_city)
                    
                                day_list_controller_obj.clear_list();
                    
                                week_list_controller_obj.clear_list();                                                                                                                                    
                                
                                pics_rank_collection_obj.refresh()
                                
                                console.log("select cur_city :"+cur_city);
                                
                                console.log("select cur_type :"+cur_type);
                                
                                
                            }
                        })                          
                    }
                }                                             
                else
                {
                    city_select_obj = null
                    
                    _page_view.$el.find('[data_select_location]').hide();
                }
                
                if(cur_type == 'week')
                {                                      
                    week_list_controller_obj.more_btn_reset()                                                                     
                
                    if((response.list==false || response.list.length < page_count))
                    {            
                        week_list_controller_obj.hide_more_btn()
                    }    
                }
                else if(cur_type == 'day')
                {
                    day_list_controller_obj.more_btn_reset()                                                                     
                
                    if((response.list==false || response.list.length < page_count))
                    {            
                        day_list_controller_obj.hide_more_btn()
                    }    
                }
                
            },
            before_refresh : function()
            {
                load_more_ing = true;
                
                alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",is_cover:false, append_target : _page_view.$el })
                
                if(cur_type == 'week')
                {
                    week_list_controller_obj.more_btn_loading()    
                }
                else if(cur_type == 'day')
                {
                    day_list_controller_obj.more_btn_loading()    
                }                
                
            },
            before_get_more : function()
            {
                load_more_ing = true;
                
                if(cur_type == 'week')
                {
                    week_list_controller_obj.more_btn_loading()    
                }
                else if(cur_type == 'day')
                {
                    day_list_controller_obj.more_btn_loading()    
                }
            }
        }

        
        //数据model
        var pics_rank_model = Backbone.Model.extend
        ({
            defaults:
            {
            
            }
        })
        
        
        //初始化数据        
        var pics_rank_collection = Backbone.Collection.extend
        ({
            model : pics_rank_model,    
            url : wo_config.ajax_url.get_charm_expense_rank_list,

            refresh : function()
            {
                var that = this
                
                collection_options.data = { date_type : cur_type , rank_type : "like_img" , location_city : cur_city}
                
                common_function.collection_refresh_function.call(this,collection_options)
            },
            get_more_item : function()
            {
                var that = this
                
                common_function.collection_get_more_function.call(this,collection_options)
                
            },
            parse: function(response) 
            {
                                
                
                if(response && typeof(response.list)!="undefined")
                {
                    return response.list
                }
                else
                {
                    return response
                }
            }
        })
        
        
        
        //照片榜前三位列表视图
        var top_three_pics_view = Backbone.View.extend
        ({
              tagName: "div",
              className: "pics_rank_top_three_pics pics_rank_contanier dib re",
              initialize: function(options) 
              {
                  this.render();
              },
              events: 
              {
                   'tap' : function ()
                   {
                        page_control.navigate_to_page("last/"+this.art_id,{cover_img_width : this.img_width,cover_img_height : this.img_height});  
                   }
              },
              render : function()
              {   
                  var data = this.model.toJSON();
                  
                  this.art_id = data.art_id;
                  this.art_location_id = data.art_location_id;                  
                  this.rank_value = data.rank_value;
                  this.sort_num = parseInt(data.sort_num);       
                  this.img_width = parseInt(data.img_width)
                  this.img_height = parseInt(data.img_height)  
                  this.user_name = data.user_name;
                  this.sex = data.sex;
                  this.item_count = parseInt(data.item_count);          
                  this.order_key = parseInt(data.order_key);                                                                                                        
                  
                  var first_pic_style = ""
                  var pic_style = ""                                                        
                  
                  // 设置第1、2、3的图片size
                  if(this.order_key == 1 )
                  {
                      if(!common_function.is_empty(data.cover_img_url))
                      {
                          data.cover_img_url = common_function.matching_img_size(data.cover_img_url,"mb");
                      }
                      
                      var pics_width = img_size().one_pics_width;                                                                                                         
                                                                   
                      pic_style = "width:"+pics_width+"px;height:"+img_size(this.img_width,this.img_height,1).one_pics_height+"px;overflow:hidden";
                      
                      
                      console.log("init ori_height:"+this.img_width,this.img_height)                                                                   
                  }
                  else if(this.order_key >1 && this.order_key <= 3)
                  {
                      if(!common_function.is_empty(data.cover_img_url))
                      {
                          data.cover_img_url = common_function.matching_img_size(data.cover_img_url,"ss");
                      }
                      
                      var pics_width = img_size().sec_and_thr_height + "px";
                      var pics_height = pics_width; 
                      pic_style = "width:"+pics_width+";height:"+pics_height+";overflow:hidden";
                  }

                  var template = '<div data-ori_img_width="'+this.img_width+'" data-ori_img_height="'+this.img_height+'" class="pics_container re mb5" style="'+pic_style+'"><div class="num no_'+this.order_key+' icon-bg-common"></div><img src="{{cover_img_url}}" class="w-100 img_buffer_bg"><div class="des"><h4 class="clearfix"><span class="user_name colorfff f12 fl">{{user_name}}</span><i class="sex_icon fl icon-bg-common "></i></h4><div ><span class="love-icon dib vam icon-bg-common"></span><span class="like_count ml5 colorfff f10">+{{rank_value}}</span></div></div><div class="fade_pic_box w-100 bgc-0-85"></div></div>'                                      
                                
                  var html = Mustache.to_html(template, data)
                
                  $(this.el).html(html)  
                  
                  if(this.sex == "男")
                  {
                      $(this.el).find('.sex_icon').addClass('icon-male')
                  }
                  else if(this.sex == "女")
                  {
                      $(this.el).find('.sex_icon').addClass('icon-female')
                  } 
              } 
                 
        })
        
        //照片榜普通列表视图
        var normal_pics_view = Backbone.View.extend
        ({
              tagName: "div",
              className: "pics_rank_normal_pics pics_rank_contanier dib mb5",
              initialize: function(options) 
              {
                  this.render();
              },
              events: 
              {
                  'tap' : function ()
                   {
                        page_control.navigate_to_page("last/"+this.art_id,{cover_img_width : this.img_width,cover_img_height : this.img_height});    
                   }  
              },
              render : function()
              {          
                  var data = this.model.toJSON();
                  
                  this.art_id = data.art_id;
                  this.art_location_id = data.art_location_id;                  
                  this.rank_value = data.rank_value;
                  this.sort_num = data.sort_num;
                  this.img_width = parseInt(data.img_width)
                  this.img_height = parseInt(data.img_height)                                  
                  
                  if(!common_function.is_empty(data.cover_img_url))
                  {
                      data.cover_img_url = common_function.matching_img_size(data.cover_img_url,"ss");
                  }                          
                  
                  var pics_height = img_size().normal_pics_height +"px"    
                  
                  var pics_width = pics_height  
                  
                  var template = '<div class="pics_container re"><div class="num dib tc colorfff f10 icon-bg-common">{{order_key}}</div><img style="width:'+pics_width+';height:'+pics_height+'" src="{{cover_img_url}}" data-pics_img class="w-100 img_buffer_bg"><div class="des"><div style="display:none"><span class="love-icon dib vam icon-bg-common"></span><span class="like_count ml5 colorfff f10">+{{rank_value}}</span></div></div></div>'
                                
                  var html = Mustache.to_html(template, data)
                
                  $(this.el).html(html)  
                  
                  if(this.sex == "男")
                  {
                      $(this.el).find('.sex_icon').addClass('icon-male')
                  }
                  else if(this.sex == "女")
                  {
                      $(this.el).find('.sex_icon').addClass('icon-female')
                  } 
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
            
            var footer_view = require('footer_view')
            
            //footer_view_obj = new footer_view({ cur : "focus" })
            
            var init_html = '<div class="wrap-box"><header class="header font_wryh fb tc re "><h3 class="tc" >照片榜</h3></header><div class="main_wraper"><div class="inside-page font_wryh" style="padding-top:45px;"><div style="overflow:hidden;position:relative;z-index: 1;"><div style="-webkit-transform:translateZ(0px);"></div></div><div class="main_container pb5"><div class="select-city-data clearfix mt10 content-10 color666"><div class="location_city bgcf0f border-style-be re fl radius-2px" data_select_location style="display:none"><span data_city_value class="city fl"></span><em class="fl ml20 icon-change mt5"></em></div><div class="data-list-change fr radius-2px"><ul class="clearfix"><li data_select_date="day">日榜</li><li data_select_date="week">周榜</li></ul></div></div><div day_list_charm_rank><div class="list-item mt10 content-10"><table cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td colspan="2" class="pics_view_container" data-top-three-view></td></tr><tr><td class="pics_view_container" data-top-three-view></td><td class="pics_view_container" data-top-three-view></td></tr></table><div data-normal-view class="pics_view_container"></div></div></div><div week_list_charm_rank style="display:none"><div class="list-item mt10 content-10"><table cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td colspan="2" class="pics_view_container" data-top-three-view></td></tr><tr><td class="pics_view_container" data-top-three-view width="50%"></td><td class="pics_view_container" data-top-three-view width="50%"></td></tr></table><div data-normal-view class="pics_view_container"></div></div></div></div></div></div><footer class="footer"></footer></div>'

            this.$el.append($(init_html))
            
            //底部
            //this.$el.find('.footer').append(footer_view_obj.$el)
        }
        
        
        options.events = {
                    
            'tap .ui-btn-prev-wrap' : function()
            {
                page_control.back()     
            },
            'swipeleft' : function()
            {                                    
                if(!common_function.get_ua().is_uc)
                {
                    //page_control.navigate_to_page("charm_rank")
                }
            },
            'tap [data_select_location]' : function()
            { 
                 city_select_obj.open()                  
            },
            //周加载更多
            'tap [data-for_week_get_more]' : function()
            {
                if(page_control.page_transit_status()) return false

                pics_rank_collection_obj.get_more_item()                                        
            },
            //总加载更多
            'tap [data-for_day_get_more]' : function()
            {
                if(page_control.page_transit_status()) return false

                pics_rank_collection_obj.get_more_item()                                        
            },
            //选择周和月            
            'tap [data_select_date]' : function(ev)
            {
                if(load_more_ing)
                {
                    return;
                }                              
                
                cur_type = $(ev.currentTarget).attr("data_select_date")
                
                if($(ev.currentTarget).hasClass("cur"))
                {                                       
                    pics_rank_collection_obj.refresh()
                    
                    return; 
                }
                
                control_select_date(cur_type)

            },
            'tap .ui-btn-refresh-wrap' : function()
            {
                pics_rank_collection_obj.refresh()
            }
        }
        

        options.window_change = function(page_view)
        {                      
            var sec_and_third_height = img_size().sec_and_thr_height
            
            var normal_pics_height = img_size().normal_pics_height                      
            
            // 前三位图片
            var pics_rank_top_three_pics ;
            
            // 普通类型图片
            var pics_rank_normal_pics ;                                                                     
            
            if(cur_type == 'week')
            {
                pics_rank_normal_pics = week_list_controller_obj.$el.find("[data-pics_img]")
                
                pics_rank_top_three_pics = week_list_controller_obj.$el.find('.pics_rank_top_three_pics');
            }
            else
            {
                pics_rank_normal_pics = day_list_controller_obj.$el.find("[data-pics_img]")
                
                pics_rank_top_three_pics = day_list_controller_obj.$el.find('.pics_rank_top_three_pics');
            }       
            
            var first_img_ori_width = pics_rank_top_three_pics.eq(0).find(".pics_container").attr("data-ori_img_width");
            var first_img_ori_height = pics_rank_top_three_pics.eq(0).find(".pics_container").attr("data-ori_img_height");                             
            
            var first_img_height = img_size(first_img_ori_width,first_img_ori_height,1).one_pics_height
            var first_img_width = img_size().one_pics_width;
            
            console.log("window change ori_height:"+first_img_ori_width,first_img_ori_height)
            
            // 设置前三张图的size
            pics_rank_top_three_pics.eq(0).find(".pics_container").height(first_img_height).width(first_img_width);
            
            pics_rank_top_three_pics.eq(1).find(".pics_container").width(sec_and_third_height).height(sec_and_third_height);
            
            pics_rank_top_three_pics.eq(2).find(".pics_container").width(sec_and_third_height).height(sec_and_third_height);
            
            // 最后一个不再设置高度了
            if(pics_rank_normal_pics.last().width() != normal_pics_height)
            {                
                pics_rank_normal_pics.width(normal_pics_height).height(normal_pics_height);                          
            }
            
            $(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
        }
        
        
        
        options.page_before_show = function(page_view)
        {
            window.localStorage.setItem("rank_nav_address","pics_rank");  
            
            notice.footer_notice_ui_refresh()

            poco_id = common_function.get_local_poco_id();        
        }               
        
        var refresh_btn
        //页面初始化时
        options.page_init = function(page_view,params_arr,params_obj)
        {
            _page_view = page_view
            _params_arr = params_arr
            _params_obj = params_obj      
            
            //刷新按钮  add by manson 2013.5.7
            refresh_btn = require('refresh_btn')()
            page_view.$el.find('.header').append(refresh_btn.$el)
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)  
            
            cur_type = (!_params_arr[0])?'day':_params_arr[0];              
            
            // 导航条
            /*
            rank_nav_view = require('rank_nav')
                        
            rank_nav_view_obj = new rank_nav_view
            ({
                cur_link_type : "pics_rank"
            })
            
            _page_view.$el.find('.tab-select_container').append(rank_nav_view_obj.$el)
            
            */                                                                      
            
            _page_view.$el.find('.data-list-change li').eq(0).addClass('cur');

            //容器滚动
            var main_wraper = $(page_view.el).find('.main_wraper')
            

            var view_scroll = require('scroll')
            view_scroll_obj = view_scroll.new_scroll(main_wraper,{
                'view_height' : common_function.container_height_with_head()                
            })
            
            week_list_controller_obj = new week_list_controller
            ({
                el : _page_view.$el.find('[week_list_charm_rank]')
            })
            
            day_list_controller_obj = new day_list_controller
            ({
                el : _page_view.$el.find('[day_list_charm_rank]')
            })
            
            pics_rank_collection_obj = new pics_rank_collection
                        
            pics_rank_collection_obj.bind('reset', re_render_list , page_view)
            
            //加载更多监听
            pics_rank_collection_obj.bind('add', add_render_list , page_view)
                        
            //pics_rank_collection_obj.refresh()
            
            control_select_date(cur_type)
            

        }
        
        var week_list_html
        var day_list_html
        
        var week_list_controller = Backbone.View.extend
        ({
            initialize : function(options)
            {
                var that = this
                
                var options = options || {}
                that.no_load_more = options.no_load_more || false
    
                //加载更多按钮   
                var load_more_btn = require('load_more_btn')()                        
                
                if(!that.no_load_more)
                {
                    $(this.el).append(load_more_btn.$el)
                }
                
                load_more_btn.$el.addClass("pl10 pr10")
                
                load_more_btn.$el.attr("data-for_week_get_more","1")                
                
                that.load_more_btn = load_more_btn
                
                that.load_more_btn.hide();
            },
            add_top3_item : function(item_view,idx)
            {
                 $(this.el).find("[data-top-three-view]").eq(idx-1).append(item_view.$el)
                 
                 if(!this.no_load_more)
                 {
                    this.load_more_btn.show()
                 }
            },      
            add_normal_item : function(item_view)
            {
                 $(this.el).find("[data-normal-view]").append(item_view.$el)
                 
                 if(!this.no_load_more)
                 {
                    this.load_more_btn.show()
                 }
            },
            get_list_count : function()
            {
                return $(this.el).find(".pics_rank_contanier").length;   
            },
            clear_list : function()
            {
                $(this.el).find(".pics_view_container").html("");
                
                this.load_more_btn.hide()
            },
            hide_more_btn : function()
            {           
                this.load_more_btn.hide()                
            },
            more_btn_loading : function()
            {
                this.load_more_btn.loadding()
            },
            more_btn_reset : function()
            {
                this.load_more_btn.reset()
            },            
            show_more_btn : function()
            {
                this.load_more_btn.show()
            },
            show : function()
            {
                $(this.el).show();
            },
            hide : function()
            {
                $(this.el).hide();
            }
        })
        
        var day_list_controller = Backbone.View.extend
        ({
            initialize : function(options)
            {
                var that = this
                
                var options = options || {}
                that.no_load_more = options.no_load_more || false
    
                //加载更多按钮   
                var load_more_btn = require('load_more_btn')()                        
                
                if(!that.no_load_more)
                {
                    $(this.el).append(load_more_btn.$el)
                }
                
                load_more_btn.$el.addClass("pl10 pr10")
                
                load_more_btn.$el.attr("data-for_day_get_more","1")                
                
                that.load_more_btn = load_more_btn
                
                that.load_more_btn.hide();
            },
            add_top3_item : function(item_view,idx)
            {
                 $(this.el).find("[data-top-three-view]").eq(idx-1).append(item_view.$el)
                 
                 if(!this.no_load_more)
                 {
                    this.load_more_btn.show()
                 }
            },      
            add_normal_item : function(item_view)
            {
                 $(this.el).find("[data-normal-view]").append(item_view.$el)
                 
                 if(!this.no_load_more)
                 {
                    this.load_more_btn.show()
                 }
            },
            get_list_count : function()
            {
                return $(this.el).find(".pics_rank_contanier").length;   
            },
            clear_list : function()
            {
                $(this.el).find(".pics_view_container").html("");
                
                this.load_more_btn.hide()
            },
            hide_more_btn : function()
            {           
                this.load_more_btn.hide()                
            },
            more_btn_loading : function()
            {
                this.load_more_btn.loadding()
            },
            more_btn_reset : function()
            {
                this.load_more_btn.reset()
            },            
            show_more_btn : function()
            {
                this.load_more_btn.show()
            },
            show : function()
            {
                $(this.el).show();
            },
            hide : function()
            {
                $(this.el).hide();
            }
        })
        
        function re_render_list()
        {
            common_function.page_pv_stat_action()

            var that = this;            
            
            day_list_html = _page_view.$el.find('[day_list_charm_rank]')
            
            if(cur_type == 'week')
            {
                week_list_controller_obj.clear_list();
            }
            else if(cur_type == 'day')
            { 
                day_list_controller_obj.clear_list();
            }                         
                                    
            
            pics_rank_collection_obj.each(function(item_model)
            {                
                
                var order_key = parseInt(item_model.attributes.order_key);
                
                if(order_key >0 && order_key < 4 )
                {
                    var pics_rank_view_obj = new top_three_pics_view   
                    ({
                        model : item_model
                    })      
                }
                else
                {
                    var pics_rank_view_obj = new normal_pics_view   
                    ({
                        model : item_model
                    })  
                }
                
                if(cur_type == 'week')
                {
                    if(order_key>0 && order_key < 4)
                    {
                        if(order_key == 3)
                        {
                            pics_rank_view_obj.$el.addClass("last")
                        }
                        
                        week_list_controller_obj.add_top3_item(pics_rank_view_obj,order_key)
                    }
                    else
                    {
                        week_list_controller_obj.add_normal_item(pics_rank_view_obj)    
                    }
                    
                }
                else if(cur_type == 'day')
                {
                    if(order_key>0 && order_key < 4)
                    {
                        if(order_key == 3)
                        {
                            pics_rank_view_obj.$el.addClass("last")
                        }
                        
                        day_list_controller_obj.add_top3_item(pics_rank_view_obj,order_key)
                    }
                    else
                    {
                        day_list_controller_obj.add_normal_item(pics_rank_view_obj) 
                    }
                  
                }
            })
        }
        

        function add_render_list(item_model)
        {
            var pics_rank_view_obj = new normal_pics_view   
            ({
                model : item_model
            }) 
            
            if(cur_type == 'week')
            {
                week_list_controller_obj.add_normal_item(pics_rank_view_obj)
            }
            else if(cur_type == 'day')
            {
                day_list_controller_obj.add_normal_item(pics_rank_view_obj)
            }
        }
        
        function img_size(ori_width,ori_height,s)
        {   
            var rate = 1;     
            
            var ori_width = parseInt(ori_width)
            var ori_height = parseInt(ori_height)                                         
            
            if(ori_width>ori_height)
            {
                rate = ori_height/ori_width
                                
            }
            else if(ori_height>ori_width)
            {
                rate = ori_width/ori_height
                                
            }                       
                                        
             
            return{
                one_pics_height : parseInt((window.innerWidth-20)*rate),
                one_pics_width : parseInt(window.innerWidth-20),
                sec_and_thr_height : parseInt(((window.innerWidth-25)/2)),
                normal_pics_height : parseInt(((window.innerWidth-32)/3))
            }
            
        }
        
        
        function control_select_date(cur_type)
        {
            _page_view.$el.find('[data_select_date]').removeClass('cur')
            _page_view.$el.find('[data_select_date=' + cur_type + ']').addClass('cur')

            // 没有登录，地区传递全部
            if (poco_id == 0)
            {
                cur_city = "all"
            }

            if (cur_type == 'day')
            {
                day_list_controller_obj.show()

                week_list_controller_obj.hide()

                if (day_list_controller_obj.get_list_count() == 0)
                {
                    pics_rank_collection_obj.refresh()
                }

            }
            if (cur_type == 'week')
            {
                week_list_controller_obj.show()

                day_list_controller_obj.hide()

                if (week_list_controller_obj.get_list_count() == 0)
                {
                    pics_rank_collection_obj.refresh()
                }
            }
        }

    

        var page = require('page').new_page(options);
        
        return page;
    }
    
})

if(typeof(process_add)=="function")
{
    process_add()
}