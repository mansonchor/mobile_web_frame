#page_control.init( container , [options] )

@**return** {none}

@**param** {dom | zepto对象} container ： 承载页面的容器 

@**param** {json} options

>{string}  **default_index_route** ： 当初次进入应用没有指定路由地址时，默认自动路由到该地址

>{string}  **default_title** ： 浏览器的title显示，页面没有特定title时的默认显示文案

>{function}  **before_route** ： 在控制器路由响应之前触发

>{function}  **after_route** ： 在控制器路由响应之后触发


代码示例
``` javascript
var $ = require('zepto')
var page_control = require('page_control')

page_control.init( $('.page_container') ,
{
	default_title : "xxxxx",
	default_index_route : "index",
	before_route : function()
	{
		alert('before_route ')
	},
	after_route : function()
	{
		alert('after_route ')
	}
})
```