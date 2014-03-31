#page_control.navigate_to_page( page , [state] , [replace] , [transition] )

@**return** {none}

@**param** {string} page ： 要路由到的页面 hash

```javascript
page_control.navigate_to_page('last')    //路由到hash对应是last的页面
page_control.navigate_to_page('last/1000')    //带参数的页面路由
page_control.navigate_to_page('last/1000/big')
```

@**param** {json} state ： 要传递给页面的数据，可以在 `page_init` `page_show` 等函数收到

```javascript
page_control.navigate_to_page('last' , { art_id : 1000 })    //路由到last，并传递参数
```

```javascript
options.page_init = function(page_view , params , state)
{
	//state即是 navigate 时传递的参数对象
	var art_id = state.art_id
}
```

这里要区别于url hash带参数的做法

这种情况是在两个页面间执行路由时传递参数，`不应该属于强制需求的传参`，如直接打开对应页面或刷新页面时，参数将没有办法传递，因为不是前后两个页面之间的路由交互

假如某个页面的参数是必须的，请使用url hash带参数的方法

@**param** {bool} replace 

按照backbone的说明：To update the URL without creating an entry in the browser's history

实际使用时，却是替换掉上一次的浏览器历史

所以 `该参数需慎用`

@**param** {emum} transition [none , slide , ~~slide reverse~~ , slideup , fade] ： 强制设置转场效果，忽略目标页面设定的 transition_type 
