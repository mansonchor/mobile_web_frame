define('wo/module/common_function',['wo_config','base_package','ua',"new_alert_v2","app_function"],function(require, exports)
{
	var wo_config = require('wo_config')
	var $ = require('zepto')
	var new_alert_v2 = require("new_alert_v2")
    var ua = require('ua')
	var cookies = require('cookies')
	var app_function = require('app_function')
	var page_control = require('page_control')

	//检查对象是否为空  add by manson 2013.8.26
	exports.is_empty = function(check_obj)
	{
		var obj_type = typeof(check_obj)
		
		//console.log(obj_type)
		switch(obj_type)
		{
			case "undefined" :
				var is_empty = true

				break

			case "boolean" :
				var is_empty = !check_obj
				break

			case "number" :
				if(check_obj>0)
				{
					var is_empty = false
				}
				else
				{
					var is_empty = true
				}
				break
			case "string" :
				
				if(check_obj=="" || ( check_obj<="0" && !isNaN(parseInt(check_obj)) )  )
				{
					var is_empty = true
				}
				else
				{
					var is_empty = false
				}

				break
			case "object" :
				if(check_obj==null)
				{
					var is_empty = true
				}
				//数组
				else if( check_obj instanceof Array )
				{
					if(check_obj.length == 0)
					{
						var is_empty = true
					}
					else
					{
						var is_empty = false
					}
				}
				else
				{
					var is_empty = true

					for (var name in check_obj)
					{
						is_empty = false
					}
				}

				break

			default :
				var is_empty = false
		}

		return is_empty
	}

	
	exports.container_height_with_head_and_nav = function()
	{
		var container_height
		if(true)
		{
			container_height = window.innerHeight - wo_config.nav_bar_height
		}
		else
		{
			container_height = window.innerHeight - wo_config.header_height - wo_config.nav_bar_height
		}
        
        
		return container_height
	}

	exports.container_height_with_head = function()
	{
		var container_height
		if(true)
		{
			container_height = window.innerHeight
		}
		else
		{
			container_height = window.innerHeight - wo_config.header_height
		}
		return container_height
	}

	exports.photowall_colume_width = function()
	{
		return ( (window.innerWidth - (wo_config.photowall_colume + 1)*wo_config.photowall_spacing)/wo_config.photowall_colume )
	}
	

	exports.last_page_container_width = function()
	{
		return ( window.innerWidth - wo_config.last_page_container_spacing*2 )
	}


	//图片转换size
	exports.matching_img_size = function(img_url,size)
	{
		var is_open_hd_photo = window.localStorage.getItem('open_hd_photo')
		var is_ipad = ua.isIpad
		
		var sort_size = size
		
		if(is_open_hd_photo && is_open_hd_photo==1)
		{
			switch (size)
			{
				case "mm" :
					if(is_ipad) sort_size = "m"
					else sort_size = "s"
					break;
				case "mb" :
					if(is_ipad) sort_size = "b"
					else sort_size = "m"
					break;
			}
		}

		return wo_img_resize(img_url,sort_size)
	}


	function wo_img_resize(img_url,size)
	{
		if(typeof(size) == 'undefined') 
		{
			size = 'b';	
		}
		
		// 解析img_url
		
		// 如果不是qing的图片，这里判断不是很严谨
		if(img_url.indexOf('.poco.cn/mypoco/qing/')<0)
		{
			return img_url;
		}
		
		// 拆出文件路径和文件名
		var last_separate_num = img_url.lastIndexOf('/'); // 最后分隔符位置
		var file_path = img_url.substring(0,last_separate_num+1); // 文件路径
		var file_name = img_url.substring(last_separate_num+1); // 文件名
		
		// 分拆文件名
		var parm_arr = file_name.split("_");
		var media_hash = parm_arr[0]; // 图片hash
		
		var size_arr = parm_arr[1].split("x");
		var img_width = size_arr[0];
		var img_height = size_arr[1];
		var come_from = parm_arr[2].substring(0,1);
		var type_code = parm_arr[2].substring(1,2);
		
		switch (type_code)
		{
			case 1:
				var type_name = '.gif';
				break;	
			case 6:
				var type_name = '.bmp';
				break;
			default:
				var type_name = '.jpg';
				break;
		}
		
		
		var _tmp_img_url = file_path + media_hash + '_'+img_width + 'x' + img_height + '_' + come_from + type_code + '0';
		switch(size)
		{
			case 'b':
				img_url = _tmp_img_url + type_name;
				break;
			case 'm':
				img_url = (come_from==2)?_tmp_img_url + type_name:_tmp_img_url+'_530.jpg';
				break;
			case 's':
				img_url = _tmp_img_url + '_260.jpg';
				break;
			case 'ss':
				img_url = _tmp_img_url + '_170.jpg';
				break;
			case 'ms':
				img_url = (come_from==3)?_tmp_img_url+'_64.jpg':_tmp_img_url+'_170.jpg';
				break;
			case 'mm':
				img_url = (come_from==3)?_tmp_img_url+'_300.jpg':_tmp_img_url+'_260.jpg';
				break;
			case 'mb':
				if (come_from==3){
					img_url = _tmp_img_url+'_600.jpg';
				}
				else if (come_from==2){
					img_url = _tmp_img_url + type_name;
				}
				else {
					img_url = _tmp_img_url+'_530.jpg';
				}
				break;

		}
		return img_url;
	}

	//针对两列瀑布流缩放图片size
	exports.get_photowall_zoom_height_by_zoom_width = function(ori_width,ori_height)
	{
		return get_zoom_height_by_zoom_width(ori_width,ori_height,this.photowall_colume_width())
	}

	//最终页图片显示size
	exports.get_last_page_zoom_height_by_zoom_width = function(ori_width,ori_height)
	{
		return get_zoom_height_by_zoom_width(ori_width,ori_height,this.last_page_container_width())
	}

	var get_zoom_height_by_zoom_width = function(ori_width,ori_height,zoom_width)
	{
		return parseInt( (ori_height * zoom_width)/ori_width )
	}

	
	//add by manson 2013.5.9    点击图片喜欢提交服务器处理
	exports.like_photo_action = function(art_id,is_like,action_from)
	{
		var action_from = action_from || "detail"

		this.send_request({
			url : wo_config.ajax_url.like_action,
			data : { art_id : art_id , is_like : is_like , action_from : action_from}
		})
	}
    
    // 请求服务器获取POCOid
    exports.get_poco_id = function(callback , send_device_token , error)
	{
		var send_device_token = send_device_token || false

		this.send_request({
			url : wo_config.ajax_url.poco_user,
			data : { params : 0},
			callback : function(data)
            {
                if(typeof callback == "function")
                {
                    callback.call(this,data)
                }
				
				if(send_device_token)
				{
					//记录客户端消息推送token  add by manson 2014.2.19
					app_function.save_device_token()
				}
            },
			error: function() 
    		{
    			if(typeof error == "function")
                {
                    error.call(this)
                }
    		}
		})
	}
    
    // 请求服务器退出登录
    exports.log_out = function(callback)
	{
		var that = this;
		
		that.set_local_poco_id(0)
		
		that.send_request({
			url : wo_config.ajax_url.poco_user,
			data : { params : 1},
			callback : function(data)
            {
                if(typeof callback == "function")
                {                    
                    callback.call(this,data.poco_id)
                }
            }
		})
	}
    
    // 获取本地POCOid
    exports.get_local_poco_id = function()
    {
		if(window.localStorage.getItem("poco_id"))
		{
			return parseInt(window.localStorage.getItem("poco_id"))
		}
		else
		{
			return 0
		}
    }
    
    // 获取本地POCOid
    exports.get_publish_count = function()
    {
		if(window.localStorage.getItem("publish_count"))
		{
			return parseInt(window.localStorage.getItem("publish_count"))
		}
		else
		{
			return 0
		}
    }
    
    // 设置本地POCOid
    exports.set_local_poco_id = function(val)
    {
        return window.localStorage.setItem("poco_id",val);
    }

    exports.set_mmk = function(val)
    {
        return window.localStorage.setItem("mmk",val);
    }
    
    exports.set_show_my_wall = function(val)
    {
        return window.localStorage.setItem("show_my_wall",val)
    }

	exports.get_show_my_wall = function()
    {
        return window.localStorage.getItem("show_my_wall")
    }


	exports.publish_login_requirement = function()
	{
		var that = this
		var is_embedded = cookies.readCookie('cok_framename')
		var poco_id = that.get_local_poco_id()
		
		//内嵌发布不需要登录
		if( !that.is_empty(is_embedded) )
		{
			return false
		}
		else
		{
			if(poco_id<=0)
			{
				return true
			}
			else
			{
				return false
			}
		}
	}
    
	
	/*
	 *	针对collection的刷新函数
	 *	1.统一处理onload，防止多次请求操作
	 *	2.统一暴露各阶段回调接口
	 *	3.统一的timeout过期时间设定，叠加参数设定
	 *	4.减少重复代码量，ajax API永远只有一个
	 *
	 *	add by manson 2013.5.10
	 */
	exports.collection_refresh_function = function(options)
	{
		var that = this
		var options = options || {}

		var before_refresh = options.before_refresh || null
		var ajax_load_finish = options.ajax_load_finish || null
		var data = options.data || {}
		var reset = (options.reset==null ? false : options.reset)
		var error_no_alert = (options.error_no_alert==null ? false : options.error_no_alert)

				
		if(that.onload)
		{
			return false
		}

		if(typeof(before_refresh) == 'function')
		{
			before_refresh.call(that);
		}

		that.onload = true
		that.index_page = 1;
		
		var now = parseInt(new Date().getTime())

		var merge_data = $.extend(data,{page : 1 , t : now })
		
		var ajax_start_time = now

		var ajax_handle = that.fetch
		({
			type: "GET",
			data: merge_data,
			timeout : wo_config.ajax_timeout,
			success : function(model,response)
			{
				console.log(model)
				console.log(response)


				that.onload = false 

				if(response==null) response=false
				

				//请求时间统计  add by manson 2013.6.19
				if(response && response.page_run_time)
				{
					var ajax_run_time = (parseInt(new Date().getTime()) - ajax_start_time)/1000
					var page_run_time = response.page_run_time
					

					//相隔时间超过5s或者页面运行时间超过10s
					if(ajax_run_time - page_run_time > 5 || page_run_time > 10)
					{
						var ajax_url = encodeURIComponent(that.url)
						var ajax_stat_url = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/ajax_timeout?ajax_url="+ajax_url+"&page_run_time="+page_run_time+"&ajax_run_time="+ajax_run_time+"&tmp="+now+"&touch=1"

						var stat_img = new Image()
						stat_img.src = ajax_stat_url
					}
					
					var response = response.result_data
					if(response==null) response=false
				}


				if(typeof(ajax_load_finish) == 'function')
				{
					ajax_load_finish.call(that,model,response,null,that.index_page)
				}
			},  
			error:function(err,ssss,aaaa)
			{
				if(!error_no_alert)
				{
					new_alert_v2.show({text:"数据请求失败，请重试",type:"info",auto_close_time : 2000})
				}
				

				that.onload = false
				

				var ajax_run_time = (parseInt(new Date().getTime()) - ajax_start_time)/1000

				var ajax_url = encodeURIComponent(that.url)
				var ajax_stat_url = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/ajax_timeout?ajax_url="+ajax_url+"&page_run_time="+ajax_run_time+"&ajax_run_time="+ajax_run_time+"&tmp="+now+"&touch=1"

				var stat_img = new Image()
				stat_img.src = ajax_stat_url

				if(typeof(ajax_load_finish) == 'function')
				{
					ajax_load_finish.call(that,null,null)
				}
			}  
		})

		return ajax_handle
	}

	//同上
	exports.collection_get_more_function = function(options,is_pre_page)
	{
		var that = this
		var options = options || {}

		var before_get_more = options.before_get_more || null
		var ajax_load_finish = options.ajax_load_finish || null
		var data = options.data || {}
		var remove = (options.remove==null ? true : options.remove)
		var error_no_alert = (options.error_no_alert==null ? false : options.error_no_alert)

		var that = this
		
		if(that.onload)
		{
			return false;
		}

		if(typeof(before_get_more) == 'function')
		{
			before_get_more.call(that);
		}

		that.onload = true
		
		var now = parseInt(new Date().getTime())
		
		
		if(is_pre_page!=null)
		{
			update = false
		}
		else
		{
			update = true
		}

		if(is_pre_page)
		{
			if(that.index_page==1)
			{
				that.onload = false
				return false
			}
			
			var merge_data = $.extend(data , {page : that.index_page - 1 , t : now } )
		}
		else
		{
			var merge_data = $.extend(data , {page : that.index_page + 1 , t : now } )
		}
		


		var ajax_start_time = now
		 
		var ajax_handle = this.fetch
		({
			remove : remove,
			update: update,
			type: "GET",  
			data: merge_data,
			timeout : wo_config.ajax_timeout,
			success : function(model,response)
			{
				that.onload = false

				if(response==null) response=false
				
				if(is_pre_page)
				{
					that.index_page--
				}
				else
				{
					that.index_page++
				}

				//请求时间统计  add by manson 2013.6.19
				if(response && response.page_run_time)
				{
					var ajax_run_time = (parseInt(new Date().getTime()) - ajax_start_time)/1000
					var page_run_time = parseInt(response.page_run_time)
					
					//相隔时间超过5s或者页面运行时间超过10s
					if(ajax_run_time - page_run_time > 5 || page_run_time > 10)
					{
						var ajax_url = encodeURIComponent(that.url)
						var ajax_stat_url = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/ajax_timeout?ajax_url="+ajax_url+"&page_run_time="+page_run_time+"&ajax_run_time="+ajax_run_time+"&tmp="+now+"&touch=1"

						var stat_img = new Image()
						stat_img.src = ajax_stat_url
					}

					var response = response.result_data
					if(response==null) response=false
					
				}
				
				if(typeof(ajax_load_finish) == 'function')
				{
					ajax_load_finish.call(that,model,response,is_pre_page,that.index_page);
				}
			},  
			error:function(err)
			{   
				if(!error_no_alert)
				{
					new_alert_v2.show({text:"数据请求失败，请重试",type:"info",auto_close_time : 2000})
				}
				

				that.onload = false

				var ajax_run_time = (parseInt(new Date().getTime()) - ajax_start_time)/1000

				var ajax_url = encodeURIComponent(that.url)
				var ajax_stat_url = "http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/ajax_timeout?ajax_url="+ajax_url+"&page_run_time="+ajax_run_time+"&ajax_run_time="+ajax_run_time+"&tmp="+now+"&touch=1"

				var stat_img = new Image()
				stat_img.src = ajax_stat_url


				if(typeof(ajax_load_finish) == 'function')
				{
					ajax_load_finish.call(that,null,null,is_pre_page,that.index_page)
				}
			}  
		})

		return ajax_handle
	}
	

	/*
	 *	通用交互异步请求处理
	 *
	 *	add by manson 2013.5.10
	 */
	exports.send_request = function(options)
	{
		var options = options || {}
		var url = options.url || ""
		var type = options.type || "GET"
		var data = options.data || {}
		var callback = options.callback || ""
		var error = options.error || ""
		
		var merge_data = $.extend(data , {t : parseInt(new Date().getTime())})

		$.ajax
		({
			type: type,
			url : url,
			data: merge_data,
			dataType : "json",
			timeout : wo_config.ajax_timeout,
			success : function(data)
			{                    
				if(typeof(callback)=="function")
				{
					callback.call(this,data)
				}
			},
			error : function()
			{
				new_alert_v2.show({text:"请求失败，请重试",type:"info",auto_close_time : 2000})

				if(typeof(error)=="function")
				{
					error.call(this)
				}
			}
		})
	}
    
 
    /*
        页面PV统计
    */
    exports.page_pv_stat_action = function()
    {
        
		var url_hash = window.location.hash
		url_hash = url_hash.replace("#", "")

		var slash_pos = url_hash.indexOf("/")
		if(slash_pos > 0)
		{
			var hash_parms = url_hash.substr(slash_pos + 1,url_hash.length)
			hash_parms = decodeURIComponent(hash_parms)

			var real_hash = url_hash.substr(0,slash_pos)
		}
		else
		{
			var hash_parms = ""
			var real_hash = url_hash
		}
		
		var come_from_cookie = cookies.readCookie('_tj_mobile_come_from')
		if(!come_from_cookie) come_from_cookie = "web"

		var tj_query = "come_from=" + come_from_cookie + '&hash_parms=' + hash_parms
		
		tj_query = encodeURIComponent(tj_query)
		
		
		var stat_url = 'http://imgtj.poco.cn/poco_tj.css?tj_query='+tj_query+'&tj_file='+real_hash+'&tmp='+Math.random()

		var stat_img = new Image()
		stat_img.src = stat_url
    }
    
    
    /*
        获取ua    
    */
    exports.get_ua = function()
    {
        return ua
    }
    

	exports.get_target_refresh_url_by_hash_name = function(hash)
	{
		var hash = (hash==null) ? false : hash
		
		if(hash)
		{
			var refresh_url = "http://" + location.host + location.pathname + "?" + parseInt(new Date().getTime()) + "#" + hash
		}
		else
		{
			var refresh_url = "http://" + location.host + location.pathname + "?" + parseInt(new Date().getTime())
		}

		return refresh_url
	}
	

	exports.bind_poco_in_camera = function(publish_bind)
	{
		var poco_camera_ver = cookies.readCookie('poco_camera_ver')
		var mmk = window.localStorage.getItem("mmk")
		var poco_id = this.get_local_poco_id()
		
		if(!this.is_empty(poco_id) && poco_camera_ver > "2.1.0" && !this.is_empty(mmk) )
		{
			if(publish_bind)
			{
				var time = 0
			}
			else
			{
				var time = 3000
			}

			setTimeout(function()
			{
				window.location.href = 'PocoCamera://action_bindpoco/?pcd=' + poco_id + '&mmk=' + mmk
			
				cookies.delCookie('world_user_login','.poco.cn','/')
			},time)
			
		}
	}
        
    
    exports.banner_tips = function(options)
    {
        var options = options || {};
        
        var html_str = options.html_str || "";
        
        var html = '<div class="banner_tips radius-2px clearfix re" style="padding: 15px 10px;"><div class="txt color333"><em class="icon icon-bg-common"></em><span >'+html_str+'</span></div><div class="btn-close-wrap"><span class="btn-close radius-2px"><i class="icon-close icon-bg-common"></i></span></div></div>'
        
        return html; 
    }
    
    exports.oau_login = function(login_tag,after_login_go_to,logining,callback,error)
    {
        var that = this;
        
        var req_url = "http://m.poco.cn/mobile/action/login_bind.php?is_jump_page=1&login_tag="+login_tag
			
        if( app_function.is_world_app())
        {                

            //SSO登录  add by manson 2014.4.4
            if(login_tag == "qqzone")
            {
                var platform = "qzone"
            }
            else if(login_tag == "sina")
            {
                var platform = "sina"
            }
            else if(login_tag == "qqweibo")
            {
                is_not_sso_login(req_url);

                return;
            }


            app_function.sso_login(platform , function(response)
            {                        
                alert(response.code)    
                if(response.code == "0000")
                {
                    if(typeof logining == 'function')
                    {                        
                        logining.call(this);
                    }
                    

                    alert(response.uid)
                    alert(response.token)

                    that.send_request({
                        url : 'http://m.poco.cn/mobile/action/sso_login.php',
                        data : { platform : platform , uid : response.uid , token : response.token},
                        callback : function(res)
                        {
                            alert(res.user_id)
                            
                            if( !that.is_empty(res.user_id) )
                            {
                                that.set_local_poco_id(res.user_id)

                                
                                if(typeof callback == 'function')
                                {
                                    callback.call(this,res)
                                }
                                
                            }
                            else
                            {
                                if(typeof error == 'function')
                                {
                                    error.call(this,res)
                                }
                                
                                
                            }
                        }
                    })
                }
                else
                {
                    if(typeof error == 'function')
                    {
                        error.call(this,res)
                    }
                    
                    //new_alert_v2.show({text:"登录失败",auto_close_time : 2000})
                    //page_control.back()
                }	
            })


        }            
        else
        {
            is_not_sso_login(req_url);
        }
        
        // 不使用sso登录
        function is_not_sso_login(req_url)
        {
            if(after_login_go_to)//_state && _state.url_form_font_page
            {
                var default_index_route = that.get_target_refresh_url_by_hash_name(after_login_go_to)
                
                top.location.href = req_url+ "&locate="+ encodeURIComponent(default_index_route)                
            }
            else
            {
                
                var last_url = ""    
            
                var history_arr = page_control.page_history();

                last_url = history_arr[history_arr.length-2];

                if(!last_url)
                {
                    last_url = that.get_target_refresh_url_by_hash_name()
                }
                
                
                top.location.href = req_url+ "&locate="+ encodeURIComponent(last_url)
            }
            
            
        }
    }
})

if(typeof(process_add)=="function")
{
	process_add()
}