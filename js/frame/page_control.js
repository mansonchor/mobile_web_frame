/**
  *	 页面导航 + 转场控制
  */
define("frame/page_control",['zepto',"ua","avalon"],function(require, exports)
{	
	var DEFAULT_INDEX_ROUTE , DEFAULT_TITLE , BEFORE_ROUTE , AFTER_ROUTE , _ORIGINAL_CONTAINER
	
	

	exports.init = function(original_container,options)
	{
		var that = this
		var options = options || {}
		DEFAULT_INDEX_ROUTE = options.default_index_route || ""
		DEFAULT_TITLE = options.default_title || ""
		BEFORE_ROUTE = options.before_route || ""
		AFTER_ROUTE = options.after_route || ""

		_ORIGINAL_CONTAINER = original_container
		
		if(DEFAULT_INDEX_ROUTE)
		{
			//匹配修正跳转链接 没有带hash的情况  add by manson 2013.6.28
			APP_ROUTE.route("" , "" , function()
			{
				that.navigate_to_page(DEFAULT_INDEX_ROUTE , {} , true)
			})
		}
	}
	
})