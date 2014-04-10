define('wo/wo_config',[],function(require, exports)
{
	var wo_config = {}
	wo_config.ajax_url = {}

	wo_config.version = "1.23"

	wo_config.header_height = 45												//头部高度
	wo_config.nav_bar_height = 45												//底部导航栏高度
	wo_config.photowall_spacing = 10											//瀑布流间距
	wo_config.last_page_container_spacing = 10									//最终页间距
	wo_config.photowall_colume = 2												//瀑布流列数
    
	wo_config.ajax_timeout = 30000												//异步请求超时时间 
	wo_config.upload_timeout = 90000											//上传图片超时时间
    
    wo_config.notice_time = 1000*60*3;											//通知数定期请求时间（3分钟）
        
    
	//数据接口
	var ajax_url_path = "http://m.poco.cn/mobile/action/"
	wo_config.ajax_url.index = ajax_url_path + "index_v2.php"
	wo_config.ajax_url.category = ajax_url_path + "category.php"
	wo_config.ajax_url.new_img = ajax_url_path + "new_img_list.php"
	wo_config.ajax_url.hot_img = ajax_url_path + "hot_img_list.php"
	wo_config.ajax_url.theme = ajax_url_path + "topic_list.php"
	wo_config.ajax_url.theme_pic_list = ajax_url_path + "theme_pic_list_v2.php"
	wo_config.ajax_url.friend = ajax_url_path + "feed_photo_list.php"
	wo_config.ajax_url.last = ajax_url_path + "photo_info.php"
	wo_config.ajax_url.cmt = ajax_url_path + "cmt_list_v2.php"
    wo_config.ajax_url.add_cmt = ajax_url_path + "add_cmt.php"
	wo_config.ajax_url.like_action = ajax_url_path + "like_photo.php"
	wo_config.ajax_url.poco_user = ajax_url_path + "use_poco_id.php"
    wo_config.ajax_url.user_profile = ajax_url_path + "user_profile_v2.php"
	wo_config.ajax_url.user_photo = ajax_url_path + "user_photo.php"
    wo_config.ajax_url.my = ajax_url_path + "my.php"
    wo_config.ajax_url.follow_list = ajax_url_path + "user_follow_list.php"
    wo_config.ajax_url.fans_list = ajax_url_path + "user_fans_list.php"
    wo_config.ajax_url.follow_user = ajax_url_path + "follow_user.php"
    wo_config.ajax_url.my_cmt_list = ajax_url_path + "cmt_notice.php"
	wo_config.ajax_url.like_photo_list = ajax_url_path + "like_photo_list.php"
    wo_config.ajax_url.like_notice = ajax_url_path + "like_notice.php"
    wo_config.ajax_url.login = ajax_url_path + "login.php"
    wo_config.ajax_url.update_user_info = ajax_url_path + "update_user_info.php"
    wo_config.ajax_url.recommend_friend_list = ajax_url_path + "recommend_friend_list.php"
    wo_config.ajax_url.invite_friend_list = ajax_url_path + "invite_fans_list.php"
    wo_config.ajax_url.invite_friend = ajax_url_path + "invite_fans.php"
    //wo_config.ajax_url.invite_friend_wo = ajax_url_path + "invite_fans_v2.php"
    wo_config.ajax_url.del_acticle = ajax_url_path + "del_acticle.php"
    wo_config.ajax_url.del_cmt = ajax_url_path + "del_cmt.php"
	wo_config.ajax_url.publish = ajax_url_path + "publish_v2.php"										//发布接口
	wo_config.ajax_url.accept_auth = ajax_url_path + "accept_auth.php"
    wo_config.ajax_url.news_list = ajax_url_path + "news.php"
    wo_config.ajax_url.setup = ajax_url_path + "setup.php"		
    wo_config.ajax_url.get_doorplate_list = ajax_url_path + "doorplate_list.php"
    wo_config.ajax_url.get_doorplate_last = ajax_url_path + "doorplate_last.php"
	wo_config.ajax_url.get_user_info = ajax_url_path + "get_user_info.php"
    wo_config.ajax_url.search = ajax_url_path + "search.php"																				
    wo_config.ajax_url.ad_list = ajax_url_path + "ad_list.php"
    wo_config.ajax_url.theme_special = ajax_url_path + "theme_special.php"
    wo_config.ajax_url.get_user_follow_count = ajax_url_path + "get_user_follow_count.php"
    wo_config.ajax_url.get_everyday_hot = ajax_url_path + "everyday_hot_v2.php"
    wo_config.ajax_url.get_everyweek_new = ajax_url_path + "everyweek_new.php"
    wo_config.ajax_url.get_everyweek_super_user = ajax_url_path + "everyweek_super_user.php"
    wo_config.ajax_url.follow_all_users = ajax_url_path + "follow_all_users.php"
    wo_config.ajax_url.dating_list = ajax_url_path + "dating_list.php"
    wo_config.ajax_url.ps_upload = ajax_url_path + "ps_upload.php"
    wo_config.ajax_url.my_life_grid_box = ajax_url_path + "my_life_grid_box.php"
    wo_config.ajax_url.get_my_life_pics = ajax_url_path + "get_my_life_pics.php"
    wo_config.ajax_url.update_my_life_grid_box = ajax_url_path + "update_my_life_grid_box.php"
	wo_config.ajax_url.theme_join_user_list = ajax_url_path + "theme_join_user_list.php"
    wo_config.ajax_url.check_is_admin = ajax_url_path + "check_is_admin.php"
    wo_config.ajax_url.manage_action = ajax_url_path + "manage_action.php"
    wo_config.ajax_url.get_choose_my_image = ajax_url_path + "get_choose_my_image.php"
    wo_config.ajax_url.update_my_image_box = ajax_url_path + "update_my_image_box.php"
    wo_config.ajax_url.get_my_wonderful_article_list = ajax_url_path + "get_my_wonderful_article_list.php"
    wo_config.ajax_url.get_user_article_date = ajax_url_path + "get_user_article_date.php"
    wo_config.ajax_url.user_notice = ajax_url_path + "user_notice.php"
    wo_config.ajax_url.message_notice = ajax_url_path + "message_notice.php"
    wo_config.ajax_url.get_message_list = ajax_url_path + "get_message_list.php"
    wo_config.ajax_url.add_message = ajax_url_path + "add_message_v2.php"
    wo_config.ajax_url.get_relation_id = ajax_url_path + "get_relation_id.php"
    wo_config.ajax_url.get_friends_list = ajax_url_path + "get_friends_list.php"
    wo_config.ajax_url.get_dating_game_pics = ajax_url_path + "get_dating_game_pics.php"
    wo_config.ajax_url.get_rank_list = ajax_url_path + "get_rank_list.php"
    wo_config.ajax_url.get_charm_expense_rank_list = ajax_url_path + "get_charm_expense_rank_list.php"
    wo_config.ajax_url.get_user_photos_profile_achievement = ajax_url_path + "get_user_photos_profile_achievement.php"
    wo_config.ajax_url.pull_back = ajax_url_path + "pull_back.php"
    wo_config.ajax_url.to_red_package = ajax_url_path + "to_red_package.php"
    wo_config.ajax_url.get_topic_txt_list = ajax_url_path + "get_topic_txt_list.php"
    wo_config.ajax_url.add_report = ajax_url_path + "add_report.php"
    wo_config.ajax_url.get_world_daliy = ajax_url_path + "get_world_daliy.php"
	wo_config.ajax_url.theme_act = ajax_url_path + "theme_act.php"
	wo_config.ajax_url.daily = ajax_url_path + "daily.php"	
	wo_config.ajax_url.same_city = ajax_url_path + "same_city.php"
	wo_config.ajax_url.show_life_element = ajax_url_path + "show_life_element.php"
	wo_config.ajax_url.save_life_element = ajax_url_path + "save_life_element.php"
	wo_config.ajax_url.get_life_element = ajax_url_path + "get_life_element.php"
	wo_config.ajax_url.register = ajax_url_path + "register.php"
	

	wo_config.fixed_header_pos_page = ['index','ground','news','user_profile','theme_pic_list','like_photo_list','cmt_notice','like_notice','follow','fans','daily_choice','master_recommend','new_img','hot_img','friend','category','user_photo','theme_join_user_list','event','notice_list','message','pics_rank','charm_rank','wealth_rank','theme_act','daily']

	//分类数组  add by manson 2013.11.5
	wo_config.category_arr = ['自拍','旅游','美食','萌宠','玩物','摄影','玩乐','我的城市','心情'];
    
    //首页路由
    wo_config.default_index_route = "friend";

	return wo_config;
})

if(typeof(process_add)=="function")
{
	process_add()
}