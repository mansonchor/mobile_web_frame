define("wo/doorplate_last",["base_package",'frame_package',"btn_package","commom_function","wo_config","get_template","footer_view"],function(require, exports)
{
	var $ = require('zepto')
	var page_control = require('page_control')
	var Backbone = require('backbone')
	var common_function = require('commom_function')
    var wo_config = require('wo_config')
	var new_alert_v2 = require("new_alert_v2")
    
    exports.route = { "doorplate_last/:query(/:user_id)": "doorplate_last" }

	exports.new_page_entity = function()
	{
		var view_scroll_obj
		
		var _page_view 


		var options = {	
			transition_type : 'slide',
			dom_not_cache : true
		}
		
		options.initialize = function()
		{
			this.render();
		}
		
		options.render = function()
		{
			var init_html = '<div class="wrap-box"><header class="header font_wryh clearfix"><h3 class="clearfix" style="display:inline-block;width:100%;text-align:center"><span class="pl20"><label data-doorplate_name></label>门牌</span></h3></header><div class="content-10 main_wraper" style="padding: 0 10px;"><div style="padding-top:45px;"><div class="doorplate_last pt10 pb10 font_wryh" style="position:relative"><div class="content font_wryh " id="container" style="padding:20px;background:#fff;position:relative;text-align: center;-webkit-border-bottom-left-radius: 0;-webkit-border-bottom-right-radius: 0;"><table border="0" cellspacing="0" cellpadding="0" style="width:100%;text-align:center" class="bolder"><tr><td><div style="display: inline-block;width:200px;height:120px" class="mt10"><img style="max-width: 100%;" src="" data-doorplate_icon/><div class="progress_container_position " style="display:none"><table border="0" cellspacing="0" cellpadding="0" style="width: 100%;"><tbody><tr><td><div class="progress_container " style="width:150px;display:inline-block"><div class="progress_val " ></div></div></td><td width="26"><span data-level_num class="fwn" style="font-family: Tahoma;font-size: 10px;width: 25px;">Lv.0</span></td></tr></tbody></table></div></div></td></tr><tr><td><div style="display: inline-block;margin:20px 0 0 0"><label data-doorplate_name></label>门牌</div></td></tr></table></div><div class="content font_wryh " style="padding:20px;background:#fff;position:relative;text-align: left;border-top:1px solid #e6e6e6;-webkit-border-top-left-radius: 0;-webkit-border-top-right-radius: 0;"><div class="bolder" style="font-weight:bolder">获得条件:</div><div class="condition" data-condition></div><br/><div class="bolder" style="font-weight:bolder">当前进度:</div><div class="current_progress" data-current_progress></div></div></div></div></div></div>ryh " style="padding:20px;background:#fff;position:relative;text-align: left;border-top:1px solid #e6e6e6;-webkit-border-top-left-radius: 0;-webkit-border-top-right-radius: 0;"><div class="bolder" style="font-weight:bolder">获得条件:</div><div class="condition" data-condition></div><br/><div class="bolder"><img src="http://my.poco.cn/medal/common/images/2231978884_fw8xdic6_big.png" /> 当前进度:</div><div class="current_progress" data-current_progress></div></div></div></div></div></div>'						 

			this.$el.append($(init_html))
		}
		
		options.events = {			
			'tap .ui-btn-prev-wrap' : function(ev)
			{
				page_control.back()
			},  
			'swiperight' : function()
			{			    				     
				if(!common_function.get_ua().is_uc)
				{
					page_control.back()
				}
			}
		}

		options.window_change = function(page_view)
		{
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
		}
        
        var doorplate_model =  Backbone.Model.extend
        ({
    		defaults:
    		{
    		
    		},
            url : wo_config.ajax_url.get_doorplate_last,
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
			}            
    	})
		

		//页面显示时
		var is_login_tag = true
		options.page_before_show = function(page_view)
		{ 
			$(page_view.el).find('.main_wraper').height(common_function.container_height_with_head())
		}

        var doorplate_last_obj
        var _params_arr
        var _page_stae 
        var alert_tips
        var user_id
		var login_id
         
		//页面初始化时
		options.page_init = function(page_view,params_arr,page_stae)
		{
			var that = this;
			
			_page_view = $(page_view.el)		
			_params_arr = params_arr
            _page_stae = page_stae
           
			//容器滚动
			var main_wraper = $(page_view.el).find('.main_wraper')
                        
            
			var view_scroll = require('scroll')
			view_scroll_obj = view_scroll.new_scroll(main_wraper,{
				'view_height' : common_function.container_height_with_head()
			})
            
            //返回按钮
            var page_back_btn_container = $(page_view.el).find('header')
            var page_back_btn = require('page_back_btn')();
            page_back_btn_container.prepend(page_back_btn.$el)
            
            alert_tips = new_alert_v2.show({text:"正在加载",type:"loading",append_target:_page_view })
            
            user_id = common_function.get_local_poco_id()
            
            doorplate_last_obj = new doorplate_model
			doorplate_last_obj.bind('change', set_doorplate_info , page_view)
            
			
			if(common_function.is_empty(_params_arr[1]))
			{
				login_id = common_function.get_local_poco_id()
			}
			else
			{
				login_id = _params_arr[1]
			}

            doorplate_last_obj.fetch
			({
				type: "GET",  
				data: { user_id : login_id, doorplate_id:_params_arr[0], t : parseInt(new Date().getTime()) },
                success : function()
                {
                    alert_tips.close();
                },
                error : function()
                {
                    alert_tips.close();
                }
			})

		}
        
        function set_doorplate_info(model)
        {
            var page_view = this

			var model_data = model.attributes[0]
            
            var name = model_data.name;
            var rule_list = model_data.rule_list;
            var finish_status = model_data.finish_status;
            var big_photo = model_data.big_photo;
            var level = model_data.level;
            var nickname = model_data.nickname
            var max_level = model_data.max_level
            var is_have_doorplate = model_data.is_have_doorplate
            
            var condition = ""
            var progress = ""

            console.log(rule_list)
            

			$(rule_list).each(function(i,obj)
            {
				
				console.log(obj)
                
                condition += obj+"<br>"
			})
			
            if( user_id != login_id )
            {
                if(level>0)
                {                
                    finish_status = nickname +"当前处于Lv"+level
                }
                else
                {
                    finish_status = nickname +""+finish_status
                }    
            }

            
            // 有等级时，显示进度条
            
            if(is_have_doorplate!= 0&&level>0)
            {
                _page_view.find(".progress_container_position").show(); 
                
                _page_view.find("[data-level_num]").html("Lv."+level)                                       
                
                show_progress({cur_lv:level,total_lv:max_level});
            }       
            

            
            _page_view.find("[data-doorplate_name]").html(name)
            _page_view.find("[data-condition]").html(condition)
            _page_view.find("[data-doorplate_icon]").attr("src",big_photo)
            _page_view.find("[data-current_progress]").html(finish_status)
            
            
            
        }
        
        function show_progress(options)
		{

			var options = options || {},
				cur_lv = parseInt(options.cur_lv) || 0,// 当前级别
				total_lv = 	parseInt(options.total_lv) || 5, // 总级别
				speed = options.speed || 0, // 数字越大速度越慢
				callback = options.callback || function(){}, //   加载完进度条的回调
                aninmate = (options.aninmate == null)?true:false// 是否使用动画

			if(cur_lv>total_lv)	
			{
				alert("当前级别不能超过总级别")
				return;
			}
				
			var progress_container = _page_view.find('.progress_container');
			var progress_val = _page_view.find('.progress_val');
			var val = 0;
            
            if(aninmate)
            {
                var percent = parseInt((cur_lv/total_lv)*100)
					
					setTimeout(function(){
						progress_val.animate({ width: percent+"%",},300,'ease')
					},300)
            }
            else
            {
                val = parseInt((cur_lv/total_lv)*100)
                
                progress_val.css("width",val+"%")
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