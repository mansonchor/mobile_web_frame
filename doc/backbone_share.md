# 在单页应用 善用backbone MVC

在单页应用下，经常需要处理 `大量` 的DOM操作，事件绑定，AJAX，界面渲染等工作，即所谓 `heavy js` 项目，随着代码的增多，代码的耦合程度越高，可维护性会大大下降，影响开发效率

backbone提供了强大的对模型、视图和交互的抽象


**数据模型（Model）**：负责数据模型，数据结构  （近年比较流行的 [RESTful][1] 架构思想）

**数据集合（Collection）**：一组数据的实体集合，负责数据模型的 GET、POST、PUT、DELETE操作

**视图（View）**：处理页面的渲染、事件绑定、交互等工作


先看一个业务例子：要从服务器获取一组作品，然后顺序列出来

一般的做法是
```javascript
$.ajax('data.php' , function(data)
{
    $(data).each(fucntion(i,json)
    {
        //对数据进行循环渲染，中间可能会涉及模板使用
        var html_str = '<p>'+json.content+'</p><img src="'+json.img_url+'">'
        
        $('#container').append( html_str )
    })
})
```
实现起来很简单，也很好理解

现在多加一个功能：按刷新按钮获取最新的数据

这时需要增加对刷新按钮的事件绑定了
```javascript
$('refresh_btn').tap(function()
{
    $.ajax('data.php' , function(data)
	{
        $('#container').html('')    //先把旧数据清掉

	    $(data).each(fucntion(i,json)
	    {
		    //对数据进行循环渲染，中间可能会涉及模板使用
		    var html_str = '<p>'+json.content+'</p><img src="'+json.img_url+'">'
		
		    $('#container').append( html_str )
	    })
	})
})
```

如果之后再增加 加载更多和删除某篇作品的功能，你可以想象得到 事件、AJAX、对DOM的处理将杂乱无章的分布在你的代码里面。而这仅仅是你应用里的一个小功能

使用backbone，可以把作品结构映射到Models，通过作品集Collection可以获取数据，销毁或者保存到服务器上。当界面上的操作引起 Collection集合变化时，Collection会触发change事件;那些用来显示Collection状态的view会接受到Collection触发change的消息，进 而发出对应的响应，并且重新渲染新的数据到界面。在一个完整的backbone应用中，你不需要写那些胶水代码来从DOM中通过特殊的id来获取节点，或 者手工的更新HTML页面，因为在Collection发生变化时，views会很简单的进行自我更新。

```javascript
var art_model = Backbone.Model.extend({
	defaults:
	{
		content : "",						//作品内容
		img_url : ""						//作品图片
	}
})

var art_collection = Backbone.Collection.extend({
    model : art_model ,
    url : 'data.php'
})

var art_view = Backbone.View.extend({
    el : $('#container'),
    render : function()
    {
        //数据刷新界面DOM处理集中到这里

        var that = this

        that.$el.html('')

        art_collection_obj.each(function(art_model)
        {
            var html_str = '<p>'+art_model.attributes.content+'</p><img src="'+art_model.attributes.img_url+'">'
		
		    that.$el.append( html_str )
        }
    },
    events : {
        //刷新按钮事件
        'tap refresh_btn' : function()
        {
            art_collection_obj.fetch()
        }
    }
})

var art_view_obj = new art_view
var art_collection_obj = new art_collection

//collection reset事件和view的刷新处理联系上
art_collection_obj.bind( 'reset' , art_view_obj.render )    

art_collection_obj.fetch()        //初次数据获取
```


  [1]: http://baike.baidu.com/link?url=-p0t6C5aaK3weBlY7gHztCFnHxFHIL1rxWOrHsKuu_WfcMDoFqR8zaQ-JfMg81lYJnnC2z4B9NqxHGhly7hPqK