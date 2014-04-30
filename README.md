#Mobile web frame开发指南

## 索引
<p><div class="toc">
<ul style="list-style: none;">
<li><a href="#1使用web-app的条件和背景">1.使用Web App的条件和背景</a></li>
<li><a href="#2mobile-web-frame解决方案">2.Mobile web frame解决方案</a><ul>
<li><a href="#21-解决了什么">2.1 解决了什么？</a></li>
<li><a href="#22-结构说明">2.2 结构说明</a><ul>
<li><a href="#221-方案的基础">2.2.1 方案的基础</a></li>
<li><a href="#222-文件结构">2.2.2 文件结构</a></li>
<li><a href="#223-准备工作">2.2.3 准备工作</a></li>
</ul>
</li>
<li><a href="#23-使用说明">2.3 使用说明</a><ul>
<li><a href="#231-页面">2.3.1 页面</a></li>
<li><a href="#232-页面控制器">2.3.2 页面控制器</a></li>
<li><a href="#233-页面内容滚动">2.3.3 页面内容滚动</a></li>
</ul>
</li>
<li><a href="#24-功能组件">2.4 功能组件</a><ul>
<li><a href="#241-ua">2.4.1 UA</a></li>
<li><a href="#242-imgprocess">2.4.2 img_process</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#3-移动web开发规范经验总结分享">3. 移动Web开发规范、经验、总结分享</a><ul>
<li><a href="#31-前端技术">3.1 前端技术</a></li>
<li><a href="#32-交互设计">3.2 交互设计</a></li>
</ul>
</li>
</ul>
</li>
</ul>
</div>
</p>

##1.使用Web App的条件和背景

判断一个web页是否web app形式的标准是，在整个使用流程里浏览器由始至终没有刷新（也即常说的 `单页面应用`），所有的数据交互由ajax完成

和传统意义web的每页加载方式截然不同，它更贴近手机app上的即时响应，用户使用起来感觉和app没什么差别，是继web 2.0后伴随着HTML5标准在移动端的一场革新，唯一不变的是实现方式还是`html+js+css`

web app的核心价值：**web的开发模式 + app的功能&体验**

这样我们在开发的时候，首先就要考虑整个产品架构，是否适合做成web app模式。它和PC web最直接的区别在于功能层面，web app更侧重于实现移动设备某些特定的功能和需求

##2.Mobile web frame解决方案
###2.1 解决了什么？

Mobile Web App解决方案是一个高效、实用的webapp统一解决方案，它旨在提供

- 页面构建和应用路由
- 页面转换控制和页面转场效果
- 页面内容滚动
- 手机事件封装
- 独立的页面代码文件部署

和框架相比，解决方案会针对特定的场景或应用来给出相应的技术方案或者特性支持。目前业界的框架，都会专一于某个领域的问题，比如MVC框架（Backbone、AngularJS、EmberJS）、底层兼容性框架（jQuery、Zepto、jQ.Mobi）、模版引擎（JSTemplate，Mustache）、特性增强（iScroll）。在这些框架基础上，开发者如果要开发应用，仍需耗费一定精力，来巧妙的组合它们。而解决方案，帮组开发者完成了“组合”的工作。

这样开发者可以把精力集中于业务逻辑，而少关心WebApp的各种特性。它不仅解决了组合各种框架的难题，而且通过seajs部署，能让开发者按自己意愿随意进行低耦合组建

`框架本身不带UI相关`，界面可高度定制，当然交互和设计需要合理、规范，摒弃传统网站的思维，针对移动端做出调整优化，这需要 **设计-产品-前端** 互相配合，而不仅仅是前端开发的任务

关于移动端交互和设计上的技巧和经验，后面会陆续分享

###2.2 结构说明
####2.2.1 方案的基础

`seajs`: 因为单页不刷新的机制加上项目需要大量编写js代码，模块化开发对项目的维护性相当重要。框架内所有js文件使用都遵从seajs规范

`backbone`:提供web app锚点路由；数据模型(model)、集合(collection)、视图(view)控制。亦即它是一个`MVC`框架

`zepto`:jquery的移动版，它只针对webkit所以要比jq高效和轻量

`hammer`:专业的移动端手势事件库

`iscroll`:业内最好的web模拟原生滚动体验的库，没有之一

`mustache`:前端template渲染模板库，这类型的库很多，可自由选择

了解和熟悉上面的js类库，有助于更好的使用Mobile Web App方案进行开发

####2.2.2 文件结构
在项目根目录下的一般文件结构，以webapp_frame为例：
```
--webapp_frame
    ---js
        sea.js
        seajs_config.js
        ---base
            base_package.js
            backbone.js
            hammer.jq.js
            iscroll.js
            mustache.js    
            ua.js
            underscore.js
            zepto.js
        ---frame
            frame_package.js
            page_control.js
            page.js
            view_scroll.js
    ---css
        frame.css
```

sea.js和seajs_config.js是seajs基础文件，sea.js版本建议使用2.0或以上

base目录里包含所有基础类库，frame目录是web app控制类


seajs_config.js代码如下：
``` javascript
seajs.config
({
	alias: 
	{	
		'backbone': 'base/backbone',
		'underscore' : 'base/underscore',
		'zepto' : 'base/zepto',
		'mustache' : 'base/mustache',
		'iScroll' : 'base/iscroll',
		'hammer' : 'base/hammer.jq',
		'page_control' : 'frame/page_control',
		'page' : 'frame/page',
		'scroll' : 'frame/view_scroll',
		'ua' : 'base/ua',

		'base_package' : 'base/base_package',
		'frame_package' : 'frame/frame_package',
    }
})
```
对各个js文件配置了别名，方便模块调用

如果你对sea.js模块化开发还是一知半解，建议移步 [sea.js官网](http://seajs.org/docs/) 先进行学习

因为基础的js库和控制类平常不用修改，可以把基础模块整合到一起，下面是 base_package.js的内容：

![](http://mansonchor.github.io/mobile_web_frame/images/base_package.jpg)

这样 `require` 两个模块就可以开始使用框架


####2.2.3 准备工作
在根目录下创建index.html，头部引入 frame.css 、sea.js、seajs_config.js

```html
<head>
    <link href="../css/frame.css" rel="stylesheet">

    <script src="../js/sea.js"></script>
    <script src="../js/seajs_config.js"></script>
</head>
```
然后用sea.js use API调用准备好的模块
```javascript
seajs.use(["base_package","frame_package"],function()
{
    alert('调用成功')
})
```
使用框架开发准备工作至此，[看DEMO猛点我](http://mansonchor.github.io/mobile_web_frame/demo/prepare.html)

###2.3 使用说明
####2.3.1 页面
模块page是可继承的自定义类，用来创建应用下每一个独立的页面

页面配置路由后，可以通过访问不同的Hash片段来访问不同的页面，它是路由响应的入口，占据整个活动区域，呈现内容并提供交互。每个页面中可包含多个视图。每一次导航操作，会让当前页面退出可视区域，让下一个页面进入。

- [**new_page( options )**](https://github.com/mansonchor/mobile_web_frame/blob/master/doc/page.new_page.md)  **新建一个页面** 


####2.3.2 页面控制器

页面控制的核心其实是 `路由` 和 `浏览器历史` 控制

它是系统链接页面的一个桥梁，也是页面与页面链接的桥梁


- [**init( container , [options] )**](https://github.com/mansonchor/mobile_web_frame/blob/master/doc/page_control.init.md)  **初始化一个页面控制器**

- [**add_page( page_controler )**](https://github.com/mansonchor/mobile_web_frame/blob/master/doc/page_control.add_page.md)  **往控制器添加一个页面**

- [**route_start( )**](https://github.com/mansonchor/mobile_web_frame/blob/master/doc/page_control.route_start.md)  **开始进行路由监听**

- [**navigate_to_page( page , [state] , [replace] , [transition] )**](https://github.com/mansonchor/mobile_web_frame/blob/master/doc/page_control.navigate_to_page.md)  **路由到指定页面** 

- [**back( )**](https://github.com/mansonchor/mobile_web_frame/blob/master/doc/page_control.back.md)  **返回上一页面** 

- [**return_current_page_view( )**](https://github.com/mansonchor/mobile_web_frame/blob/master/doc/page_control.return_current_page_view.md)  **返回当前页面的视图对象**


####2.3.3 页面内容滚动
内容滚动可以说是最常规的需求，从前我们的页面可能是这样的

![此处输入图片的描述][1]

如果一个窗口只显示一个页面，浏览器自带的滚动机制会帮我们处理得很好

可是单页应用没有这么简单，我们需要在一个窗口 ~~同时显示这些高度不同的页面~~ 切换着来显示这些高度不同页面 ，这时候浏览器窗口只有一个滚动条就满足不了多页面的需求了（切换时的体验，记录页面历史滚动位置等）

该方案处理滚动的核心思想是借助 [iScroll][2]，让每个页面的滚动独立处理

![此处输入图片的描述][3]


- [**new_scroll( scroll_view_obj , [options] )**](https://github.com/mansonchor/mobile_web_frame/blob/master/doc/scroll.new_scroll.md)  **新建一个滚动**


### 2.4 功能组件

#### 2.4.1 UA

UA组件提供移动设备的各种信息

```javascript
var ua = require('ua')

ua.isMobile                        //是否移动设备
ua.isAndroid                       //是否安卓设备
ua.isIDevice                       //是否IOS设备
ua.isIpad                          //是否ipad
ua.otherPhone			           //IOS和安卓外的其它移动设备

ua.is_uc			               //UC浏览器
ua.is_chrome		               //手机chrome浏览器
ua.is_qq			               //手机QQ浏览器
ua.is_real_safari		           //IOS原生safari浏览器

ua.android_version		           //安卓系统版本  4.0.2
ua.ios_version			           //IOS系统版本   7.0
ua.is_iphone_safari_no_fullscreen  //原生IOS safari浏览器，但不是保存书签到桌面形式打开
```

#### 2.4.2 img_process

前端图片文件处理模块

- **[start_img_process( img_file , process_options , callback )][4]** ： 进行图片处理

- **[can_web_upload_img( )][5]** ： 判断手机是否能用该模块处理图片


## 3. 移动Web开发规范、经验、总结分享

### 3.1 前端技术
- [**在web app善用backbone MVC**][6]

- [**HTML前期实用属性配置**][7]

- [**适应各种屏幕的界面还原方案**][8]


### 3.2 交互设计

- **[自适应设计和针对webapp的设计][9]**


  [1]: http://mansonchor.github.io/mobile_web_frame/images/pc_scroll.png
  [2]: http://iscrolljs.com/
  [3]: http://mansonchor.github.io/mobile_web_frame/images/mobile_scroll.png
  [4]: https://github.com/mansonchor/mobile_web_frame/blob/master/doc/img_process.start_img_process.md
  [5]: https://github.com/mansonchor/mobile_web_frame/blob/master/doc/img_process.can_web_upload_img.md
  [6]: https://github.com/mansonchor/mobile_web_frame/blob/master/doc/backbone_share.md
  [7]: https://github.com/mansonchor/mobile_web_frame/blob/master/doc/html_meta.md
  [8]: https://github.com/mansonchor/mobile_web_frame/blob/master/doc/screen_achieve.md
  [9]: https://github.com/mansonchor/mobile_web_frame/blob/master/doc/adaptive_design.md