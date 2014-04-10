//IOS7´¦Àí
var w = window;
var n = w.navigator;
var app_ver = n.appVersion

var isAndroid = (/android/gi).test(app_ver)
var v = (app_ver).match(/OS (\d+)_(\d+)_?(\d+)?/);
var is_ios7_index = location.pathname.search('ios7')

if(is_ios7_index==-1 && v)
{
	var ios_version = v[1]

	if(v[2]) ios_version += '.'+v[2]
	if(v[3]) ios_version += '.'+v[3]

	if(ios_version>="7")
	{
		window.location.href = "http://m.poco.cn/mobile/index_ios7.html" + window.location.hash
	}
}

document.addEventListener('WeixinJSBridgeReady', function onBridgeReady(){ if(!isAndroid){WeixinJSBridge.call('hideToolbar')} })

var img=new Image,referer=encodeURIComponent(document.referrer);img.src="http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/enter?referer_outside="+referer+"&tmp="+(new Date).getTime(),window.onerror=function(){state_type="error"};var state_type="loading",load_timer=0,load_timer_handle=setInterval(function(){if(load_timer++,5==load_timer&&"error"==state_type){var a=new Image,b=encodeURIComponent(window.navigator.appVersion);a.src="http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/not_support?tmp="+(new Date).getTime()+"&ua="+b,clearInterval(load_timer_handle)}if(5==load_timer){var a=new Image;a.src="http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/open_5?tmp="+(new Date).getTime()}else if(10==load_timer){var a=new Image;a.src="http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/open_10?tmp="+(new Date).getTime()}else if(20==load_timer&&"loading"==state_type){alert("\u52a0\u8f7d\u7f13\u6162\uff0c\u53ef\u5c1d\u8bd5\u91cd\u65b0\u6253\u5f00\u9875\u9762");var a=new Image;a.src="http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/open_20?tmp="+(new Date).getTime(),clearInterval(load_timer_handle)}},1e3);


var seajs_no_cache = false
var seajs_uglify = true


seajs.config({map:[[/^.*$/,function(e){return"undefined"!=typeof seajs_no_cache&&seajs_no_cache&&-1===e.indexOf(noCachePrefix)&&(e+=(-1===e.indexOf("?")?"?":"&")+noCacheTimeStamp),e}],[".js",function(e){return"undefined"!=typeof seajs_uglify&&seajs_uglify?".version.js":e}],[".css",function(e){return"undefined"!=typeof seajs_uglify&&seajs_uglify?".version.css":e}]],paths:{base:"mobile_wo/base",frame:"mobile_wo/frame",wo:"mobile_wo/wo",m_poco_wo:"http://m.poco.cn/mobile/js/wo/",wo_css_path:"mobile_wo_css/wo/"},alias:{web_wo_init:"m_poco_wo/web_wo_init",preparations:"wo/preparations",wo_config:"wo/wo_config",slider:"wo/module/slider",commom_function:"wo/module/common_function",load_more_btn:"wo/module/load_more_btn",paging_btn:"wo/module/paging_btn",refresh_btn:"wo/module/refresh_btn",user_list_view:"wo/module/user_list_view",system_notice_view:"wo/module/system_notice_view",user_list_controler:"wo/module/user_list_controler",photo_txt_view:"wo/module/photo_txt_view",photowall_item_view:"wo/module/photowall_item_view",photowall_controler:"wo/module/photowall_controler",mobile_photo_collection:"wo/module/mobile_photo_collection",user_list_collection:"wo/module/user_list_collection",footer_view:"wo/module/footer_view",follow_btn:"wo/module/follow_btn",new_alert_v2:"wo/module/new_alert_v2",page_back_btn:"wo/module/page_back_btn",show_big_img:"wo/module/show_big_img",photowall_other_item_view:"wo/module/photowall_other_item_view",popup:"wo/module/popup",world_list_module:"wo/module/world_list_module",select_module:"wo/module/select_module",message_nav:"wo/module/message_nav",emoticon_module:"wo/module/emoticon_module",pinyin_lib:"wo/module/pinyin_lib",rank_nav:"wo/module/rank_nav",index:"wo/index",hot_img:"wo/hot_img",new_img:"wo/new_img",theme:"wo/theme",friend:"wo/friend",my:"wo/my",last:"wo/last",theme_pic_list:"wo/theme_pic_list",user_profile:"wo/user_profile",user_photo:"wo/user_photo",follow:"wo/follow",fans:"wo/fans",cmt_notice:"wo/cmt_notice",cmt:"wo/cmt",login_and_reg:"wo/login_and_reg",like_photo_list:"wo/like_photo_list",like_notice:"wo/like_notice",get_template:"wo/get_template",login:"wo/login",edit:"wo/edit",edit_page:"wo/edit_page",recommend:"wo/recommend",invite_fans:"wo/invite_fans",publish:"wo/publish",about:"wo/about",new_tips:"wo/module/new_tips",notice:"wo/module/notice",news:"wo/news",placard:"wo/placard",setup:"wo/setup",doorplate_list:"wo/doorplate_list",doorplate_last:"wo/doorplate_last",search_result:"wo/search_result",theme_special:"wo/theme_special",set_location:"wo/set_location",select_user_data:"wo/select_user_data",get_location_data:"wo/get_location_data",daily_choice:"wo/daily_choice",weekly_newcomers_choice:"wo/weekly_newcomers_choice",master_recommend:"wo/master_recommend",dating_list:"wo/dating_list",my_wallet:"wo/my_wallet",send_gift:"wo/send_gift",category:"wo/category",ground:"wo/ground",my_life_box:"wo/my_life_box",choose_my_pic:"wo/choose_my_pic",event:"wo/event",theme_join_user_list:"wo/theme_join_user_list",extend:"wo/extend",choose_my_image:"wo/choose_my_image",my_image_wall:"wo/my_image_wall",message:"wo/message",notice_list:"wo/notice_list",message_list:"wo/message_list",get_friends_list:"wo/get_friends_list",weixin_callback:"wo/weixin_callback",dating_game:"wo/dating_game",rank_pic_list:"wo/rank_pic_list",encounter_game:"wo/encounter_game",recommend_me:"wo/recommend_me",about:"wo/about",pics_rank:"wo/pics_rank",charm_rank:"wo/charm_rank",wealth_rank:"wo/wealth_rank",no_login:"wo/module/no_login",about_test:"wo/about_test",red_package:"wo/red_package",wo_css:"wo_css_path/wo.css",test_css:"wo_css_path/test.css",view_scroll_css:"frame/view_scroll.css",backbone:"base/backbone",underscore:"base/underscore",jquery:"base/jquery",zepto:"base/zepto",jquery_form:"base/jquery_form",mustache:"base/mustache",iScroll:"base/iscroll",iScroll5:"base/iscroll5",hammer:"base/hammer.jq",page_control:"frame/page_control",page:"frame/page",scroll:"frame/view_scroll",ua:"base/ua",cookies:"base/cookies",megapix_img:"base/megapix_img",img_process:"base/img_process",exif:"base/exif",base_package:"base/base_package",photowall_package:"wo/module/photowall_package",frame_package:"frame/frame_package",btn_package:"wo/module/btn_package",less_use_page_package:"wo/less_use_page_package"}});


define("m_poco_wo/web_wo_init",["preparations","less_use_page_package","wo_config","commom_function","user_list_view","user_list_controler","index","friend","my","last","theme_pic_list","user_profile","cmt_notice","cmt","like_notice","get_template","base_package","ua","footer_view","edit","recommend","publish","new_tips","notice","news","user_list_collection","btn_package","setup","frame_package","slider","new_alert_v2","img_process","doorplate_list","doorplate_last","search_result","set_location","show_big_img","dating_list","popup","system_notice_view","master_recommend","world_list_module","category","user_photo","event","theme_join_user_list","select_module","choose_my_image","my_image_wall","message","notice_list","message_list","emoticon_module","get_friends_list","message_nav","weixin_callback","rank_pic_list","encounter_game","dating_game","recommend_me","about","rank_nav","pics_rank","charm_rank","wealth_rank","no_login","my_wallet","send_gift","red_package","hot_img","new_img"],function(e){e("preparations")});


seajs.use("wo_css")
seajs.use("m_poco_wo/web_wo_init")