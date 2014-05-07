define('base/ua',['zepto'],function(require, exports)
{
	var $ = require('zepto')

	var ua = {};
	var win = window;
	var nav = win.navigator;
	var app_version = nav.appVersion
	
	//访问来自手机 
	ua.isMobile = (/(iphone|ipod|android|ios|ipad|nokia|blackberry|tablet|symbian)/).test(nav.userAgent.toLowerCase());
	
	//手机系统
	ua.isAndroid = (/android/gi).test(app_version)
	ua.isIDevice = (/iphone|ipad/gi).test(app_version)
	ua.isTouchPad = (/hp-tablet/gi).test(app_version)
	ua.isIpad = (/ipad/gi).test(app_version)

	ua.otherPhone = !(ua.isAndroid || ua.isIDevice)
	
	
	//浏览器品牌类型
	ua.is_uc = (/uc/gi).test(app_version)
	ua.is_chrome = (/CriOS/gi).test(app_version) || (/Chrome/gi).test(app_version)
	ua.is_qq = (/QQBrowser/gi).test(app_version)
	ua.is_real_safari = (/safari/gi).test(app_version) && !ua.is_chrome && !ua.is_qq			//真正的原生IOS safari浏览器
	

	//iphone safari是否全屏
	ua.is_standalone = (window.navigator.standalone)? true : false
	
	

	ua.window_width = window.innerWidth
	ua.window_height = window.innerHeight

	//ua.window_height = $(window).height()
	
	//手机版本
	if(ua.isAndroid)
	{
		var android_version = parseFloat(app_version.slice(app_version.indexOf("Android")+8)); 
		ua.android_version = android_version
	}
	else if(ua.isIDevice)
	{
		var v = (app_version).match(/OS (\d+)_(\d+)_?(\d+)?/);
		
		var ios_version = v[1]
		
		if(v[2]) ios_version += '.'+v[2]
		if(v[3]) ios_version += '.'+v[3]

		ua.ios_version = ios_version
	}

	ua.is_iphone_safari_no_fullscreen = ua.isIDevice && ua.ios_version<"7" && !ua.isIpad && ua.is_real_safari && !ua.is_standalone
	
	return ua;
})

if(typeof(process_add)=="function")
{
	process_add()
}