define('m_poco_wo/web_wo_init',['commom_function','base_package','img_process'],function(require, exports){
    
	var $ = require('zepto')
	var img_process = require('img_process')
	var common_function = require('commom_function')
	
	var td_size = (window.innerWidth - 10*4)/3

	$('td').height(td_size).width(td_size)

	
	$('.publish_img_file').change(function()
	{
		var file_obj = this
		var img_file = file_obj.files[0]

		img_process.start_img_process(img_file,{ type : img_file.type , max_width : 1024 , quality : 0.9 },function(base64_url)
		{
			var img_upload_url = "http://imgup-s.poco.cn/ultra_upload_service/get_img_file_fun_qing.php?t=" + Math.random()
                    
			//上传图片请求
			common_function.send_request
			({
				url : img_upload_url,
				type : "POST",
				data : { return_json : 1,acao_h : 1 , get_img_type : 3, img_base64 : base64_url ,user_id : 54761328 }, 
				callback : function(data)
				{						    
				    var fullurl = common_function.matching_img_size(data.item_url,'mm')
					$(file_obj).parents('td').find('.publish_img_output').attr('src',fullurl).show()
					
				},
				error:function()
				{
					alert('上传失败，请重新选择上传')
				}
			})
		})
	})
})