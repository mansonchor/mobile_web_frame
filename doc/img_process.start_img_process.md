#img_process.start_img_process( img_file , [process_options] , callback )

@**return** {none}

@**param** {file} img_file： 图片文件

@**param** {json} process_options： 参数

>{int}  **max_width** [defalut 600]： 等比缩放最大宽

>{int}  **max_height** [defalut 6000]： 等比缩放最大高

>{float}  **quality** [defalut 0.99]： 图片压缩质量[0.00 - 1.00]

>{string}  **type** [defalut image/jpeg]： 图片类型[png,jpg,gif]

@**param** {function} callback ： 回调函数，返回参数是图片处理后的 base64数据流


```html
<input  id="img_file"  type="file"  accept="image/*">
```

```javascript
document.getElementById('img_file').onchange = function()
{
    var img_file = this.files[0]

    img_process.start_img_process(img_file,{ max_width : 1024 , quality : 0.7 , type : img_file.type },function( base64_url )
    {
	    var image = new Image()
        image.src = base64_url            //可以直接用base64数据显示图片
    })
}
```