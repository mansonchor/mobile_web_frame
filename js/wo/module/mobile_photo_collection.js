/**
  *	 瀑布流列表collection
  *	 @author Manson
  *  @version 2013.5.2
  */
define("wo/module/mobile_photo_collection", [ "base_package", "commom_function" ],function(require, exports)
{
	var $ = require('zepto')
	var Backbone = require('backbone')
	var common_function = require('commom_function')

	//数据model
	var mobile_photo_model = Backbone.Model.extend({
		defaults:
		{
			summary : "",
			cover_img_url : "",
			like_count : "",
			art_id : "",
			cover_img_width : "",
			cover_img_height : "",
            order_ukey : ""
		}
	})

	
	new_mobile_photo_collection = function(options)
	{
		var options = options || {}
		
		var collection_options = {
			onload : false,
			model : mobile_photo_model,
			refresh : function()
			{
				options.data = { }

				common_function.collection_refresh_function.call(this,options)
			},
			get_more_item : function()
			{
				//瀑布流列表的order ukey处理
				options.data = { order_ukey : this.models[this.models.length-1].attributes.order_ukey}

				common_function.collection_get_more_function.call(this,options)
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
			}
		}
		
		//选项继承
		collection_options = $.extend(collection_options, options)
                
		
		var photowall_item_list_class = Backbone.Collection.extend(collection_options)
		
		return new photowall_item_list_class
	}

	return new_mobile_photo_collection
})

if(typeof(process_add)=="function")
{
	process_add()
}