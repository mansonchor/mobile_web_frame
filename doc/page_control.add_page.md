#page_control.add_page( page_controler )

@**return** {none}

@**param** {frame page类模块} page_controler

page_controler是一个seajs模块，这个模块应该暴露两个接口

>{json} **route** ： 页面的路由配置，基础是[backbone的route][1]

```javascript
exports.route = { "index": "index"  }
```
也可以组建带参数的url hash
```javascript
exports.route = { "last/:art_id": "last"  }    //能匹配 #last/1000 等url hash

exports.route = { "cat/:cat_id/:art_id": "cat"  }    //能匹配 #cat/2/1000 等url hash
```

也可通过()设置非强制参数
```javascript
exports.route = { "hot/(:is_big_img)": "hot"  }    //能匹配 #hot 和 #hot/true

exports.route = { "cat/:cat_id/(:art_id)": "cat"  }    //能匹配 #cat/2/1000 和 #cat/2
```

url参数可在页面的 `page_init` `page_show` 等监听下接收到

```
//页面路由配置
exports.route = { "last/:art_id": "last"  }
exports.new_page_entity = function()
{
	options.page_init = function(page_view , params)
	{
        //params是一个数组，依次是url传递的参数
	    var art_id = params[0]    //url的第一个参数，即art_id
	}

	var page = require('page').new_page(options)
	return page     //最后return  frame page类实例
} 
```

----------

>{function} **new_page_entity** ： 处理该页面业务的所有代码内容，**该方法最后必须return一个[frame page类实例][2]**

假设要添加一个页面 index
```javascript
page_control.init( $('.page_container'),{
	default_index_route : "index"
})

var index_page = require('index')

page_control.add_page(index_page)
```

index.js文件如下：
```javascript
define(function(require, exports)
{
	//页面路由配置
	exports.route = { "index": "index"  }

	exports.new_page_entity = function()
	{
		//页面配置
		var options = {
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
		     
		var page = require('page').new_page(options)
		
		return page		//最后return  frame page类实例
	}	
})
```

  [1]: http://www.css88.com/doc/backbone/#Router
  [2]: https://www.zybuluo.com/mansonchor/note/5894