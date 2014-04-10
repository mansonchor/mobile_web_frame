define('wo/module/app_function',['wo_config','base_package','ua',"new_alert_v2","commom_function"],function(require, exports)
{
	var wo_config = require('wo_config')
	var $ = require('zepto')
	var new_alert_v2 = require("new_alert_v2")
    var ua = require('ua')
	var cookies = require('cookies')
	var common_function = require('commom_function')

	exports.is_world_app = function()
    {                
		return typeof(PocoWebViewJavascriptBridge)!="undefined"
    }
    
    exports.is_poco_app = function()
    {
        var is_embedded = cookies.readCookie('cok_framename')                                                
        
        return (is_embedded!=null && is_embedded!="")?true : false;
    }

	exports.is_poco_app_and_android = function()
    {
		var ret = this.is_poco_app() && ua.isAndroid
		
		return ret
	}

	exports.is_poco_app_and_iphone = function()
    {
		var ret = this.is_poco_app() && ua.isIDevice
		
		return ret
	}
	
	
	
	//可以在apps内分享，包括世界app和POCO相机  add by manson 2014.2.19
	exports.can_app_share = function()
    {
		var poco_camera_ver = cookies.readCookie('poco_camera_ver')

		var ret = this.is_world_app() || (this.is_poco_app_and_android() && poco_camera_ver >= '2.5.7') || (this.is_poco_app_and_iphone() && poco_camera_ver >= '2.5.8')
		
		return ret
	}
	

	exports.init_world_app_bridge = function()
    {
		if (window.PocoWebViewJavascriptBridge) 
		{
			PocoWebViewJavascriptBridge.init()
		} 
		else 
		{
			document.addEventListener('WebViewJavascriptBridgeReady', function() 
			{
				PocoWebViewJavascriptBridge.init()
			}, false)
		}
    }


	exports.app_get_picture = function(params , callback)
    {
		if( this.is_world_app() )
		{
			PocoWebViewJavascriptBridge.callHandler('PocoWorld.camera.getPicture', params , callback)
		}
	}


	exports.save_device_token = function()
	{
		if( this.is_world_app() )
		{
			var login_id = common_function.get_local_poco_id()
			
			if(login_id > 0)
			{
				PocoWebViewJavascriptBridge.callHandler('PocoWorld.device.token', {} , function(response)
				{
					if(response.code == "0000")
					{
						if(ua.isIDevice)
						{
							var device_type = 'ios'
						}
						else
						{
							var device_type = 'android'
						}

						common_function.send_request({
							url: 'http://m.poco.cn/mobile/action/save_device_token.php',
							data: 
							{
								device_token: response.token,
								device_type : device_type
							}
						})
					}
				})
			}
		}
	}

	exports.app_share_setup = function()
	{
		if( this.is_world_app() )
        {
			PocoWebViewJavascriptBridge.callHandler('PocoWorld.partner.share.set',{},function(){})
		}
	}


	exports.app_share = function(share_type,share_img,share_txt,share_url)
	{
		var share_type = share_type
		
		//世界app分享
		if( this.is_world_app() )
        {
			switch(share_type)
			{
				case 'sina' : share_type = 'weibo';break
				case 'qqweibo' : share_type = 'tencent';break
				case 'qqzone' : share_type = 'qzone';break 
				case 'weixin' : 
				      share_type = 'weixin';				       
				      break
			}

			var share_type_str = 'PocoWorld.partner.share.' + share_type
			
			PocoWebViewJavascriptBridge.callHandler( share_type_str ,{'shareImg': share_img , 'shareTxt': share_txt , 'shareUrl': share_url},function(response)
			{
			})
		}
		else
		{
			//POCO相机分享
			switch(share_type)
            {
                case 'sina' :
                     share_txt = share_txt + " " + share_url
                     break;                
                case 'qqweibo' : 
                     share_type = 'qq';                     
                     share_txt = share_txt + " " + share_url               
                     break;
                case 'qqzone' :
                     share_type = 'qzone';
                     share_txt = share_txt + " " + share_url
                     break;
                case 'weixin' :
                     share_url = encodeURIComponent(share_url) 
                     break;
            }
            
			share_txt = encodeURIComponent(share_txt)											
			
			window.location.href = 'PocoCamera://action_share/?shareplatform='+share_type+'&sharetxt='+share_txt+'&shareimg='+share_img+'&sharelink='+share_url
		}
	}


	exports.app_switch_mode = function(callback)
	{
		if( this.is_world_app() )
        {
			PocoWebViewJavascriptBridge.callHandler( 'PocoWorld.device.switchMode' , {} , callback)
		}
	}


	exports.get_app_coordinate = function(callback)
	{
		if( this.is_world_app() )
        {
			PocoWebViewJavascriptBridge.callHandler( 'PocoWorld.location.coordinate' , {} , callback)
		}
	}


	exports.get_package_ver = function(callback)
	{
		if( this.is_world_app() )
        {
			PocoWebViewJavascriptBridge.callHandler( 'PocoWorld.app.packageVer' , {} , callback)
		}
	}


	exports.sso_login = function(platform ,callback)
	{
		if( this.is_world_app() )
        {
			PocoWebViewJavascriptBridge.callHandler( 'PocoWorld.partner.login' , { 'platform' : platform } , callback)
		}
	}

})

if(typeof(process_add)=="function")
{
	process_add()
}