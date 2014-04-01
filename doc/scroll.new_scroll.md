#scroll.new_scroll( scroll_view_obj, [options] )

@**return** {frame scroll object}

@**param** {dom | zepto对象} scroll_view_obj： 要滚动的容器

@**param** {json} options

>{int}  **view_height** ： 设定滚动容器的高度

>{bool}  **bounce** [defalut : false]： 滚动到边缘是否有反弹

>{bool}  **hideScrollbar** [defalut : true]： 静止时隐藏滚动条

>{function}  **scroll_start**： 滚动开始时触发

>{function}  **scroll_end**： 滚动完毕时触发

>{bool}  **use_lazyload** [defalut : false]： 是否使用lazyload加载图片

说明：

-  1. scroll_view_obj 是包裹着滚动内容的最外层容器，使用scroll控件需要html组织配合。iscroll官方建议html结构越简单越好，具体可参考 [iScroll文档][1]

```html
<div id="wrapper">
    <ul>
        <li>...</li>
        <li>...</li>
        ...
    </ul>
</div>
```

```javascript
var view_scroll = require('scroll')
var scroll_view_obj = $('#wrapper')

view_scroll.new_scroll( scroll_view_obj )
```

- 2. view_height的设定，可以随意控制页面滚动的范围，例如以下几种情况

![此处输入图片的描述][2]

![此处输入图片的描述][3]

![此处输入图片的描述][4]


- 3. lazyload功能也需要HTML配合，在渲染 <img>时，先不要显式设置 src
```html
<img  lazyload_src="xxxx">
```
这样图片只会在滚动到屏幕可视位置时，才会加载

各种滚动 [DEMO][5]


  [1]: http://iscrolljs.com/#getting-started
  [2]: http://mansonchor.github.io/mobile_web_frame/images/scroll_1.png
  [3]: http://mansonchor.github.io/mobile_web_frame/images/scroll_2.png
  [4]: http://mansonchor.github.io/mobile_web_frame/images/scroll_3.png
  [5]: http://mansonchor.github.io/mobile_web_frame/demo/scroll.html