/**
  *	 单列信息列表collection（通知、好友推荐、粉丝、关注）
  *	 @author Manson
  *  @version 2013.6.19
  */
define("wo/module/user_list_collection", [ "base_package", "commom_function" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var common_function = require('commom_function')

	//数据model
	var user_list_model = Backbone.Model.extend({
		defaults:
		{
			
		}
	})

	
	new_user_list_collection = function(options)
	{
		var options = options || {}

		var user_list_collection_class = Backbone.Collection.extend
		({
			model : user_list_model,        
			refresh : options.refresh,
			get_more_item : options.get_more_item,
			url : options.url,
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

		return new user_list_collection_class
	}

	return new_user_list_collection
})

if(typeof(process_add)=="function")
{
	process_add()
}