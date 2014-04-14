#page_control.add_page( page_controler_arr )

@**return** {none}

@**param** {array} page_controler

page_controler_arr是一个seajs模块数组，这个模块应该返回 [frame page类实例][2]的 options


假设要添加两个页面 index和last
```javascript
page_control.init( $('.page_container'),{
	default_index_route : "index"
})

var index_page = require('index')
var last_page = require('last')

page_control.add_page([index_page , last_page])
```

index.js文件如下：
```javascript
define(function(require, exports)
{
	function new_page_entity()
	{
		//页面配置
		var options = {
			route : { "index": "index"  },
			transition_type : 'none'
		}
		
		options.initialize = function()
		{
			//页面初始化
		}

		
		options.events = {
			...
			...
			...
		}
		
		return options
	}	

	return new_page_entity
})
```

这里之所以要在模块里再多封一层new_page_entity()，是为了解决多个页面同时存在时，变量污染的问题。

在业务开发时，可以把页面的所有逻辑代码写到 new_page_entity()里面，最后return **options**，模块本身return  **new_page_entity**方法，在add_page的时候，会自动建立页面并且操作在各自的闭包范围内


  [1]: http://www.css88.com/doc/backbone/#Router
  [2]: https://github.com/mansonchor/mobile_web_frame/blob/master/doc/page.new_page.md