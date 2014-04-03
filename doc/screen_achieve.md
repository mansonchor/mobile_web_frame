# 适应各种屏幕的界面还原方案

有没有遇到过一个情况？在iphone 4+机器上开发时，明明分辨率是960*640，我们写一个320px的容器，竟然占满了屏幕宽；素材图片会出现模糊失真，必须把原素材缩小一倍才会正常。

假如你不知道为什么这样，请自行脑补 [手机PPI][1]

或者根本没遇过这种情况，那可以先不用看下文了，因为可能看完了也不会有一个感性的认知


###**我的解决方案是：按高清屏还原，向下兼容**

亦即我们针对PPI>320，默认缩放比例为2的机器

**viewport**
```HTML
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"  />
```
不要再使用 `target-densitydpi` 属性，**webkit已经发了公布将不再支持这一属性**

设置默认缩放比例 `initial-scale=1.0` 即可

通常设计稿会按照IPHONE高清标准 960*640，我们缩小一半处理
例如设计稿上头像大小 100px*100px，界面还原时css应该是 50px*50px
一个内容区域的长度是200px，界面还原时就应该是100px，不过这只是我举个例子，实际设计中，`是不应该固定死布局的宽度的`，而应该使用 `自适应` 的解决方案，这个会在另外一文中探讨

素材考虑使用css sprite，然后通过设置background-size缩小一半使用

![此处输入图片的描述][2]

例如上图素材为 200px*100px，css如下

```CSS
background-image: url(xxx.png);
background-repeat: no-repeat;
background-size: 100px 50px;
```
各个素材通过 background-position 定位使用

好处：一套代码，兼容高清屏、标清屏、普屏，虽然针对非高清屏存在流量浪费，也有些方案是针对不同屏幕做两套素材的，但是觉得这样成本更大。

今天，千元级的手机基本都是高清屏了，所以可以放心以高清屏为标准


----------

**这里需要注意的是，素材要按照 高清标准 960*640 提取出来，只是使用的时候缩小一半**
这和布局界面的缩小一半还原，是有本质的区别的。因为HTML渲染出来的是矢量图，而素材（png,jpg,gif）是位图，位图和矢量图的区别是经过缩放会失真（[百度脑补计算机知识][3]）

一个简单的试验：打开淘宝首页，使用浏览器缩放功能放大到200%，会看到使用素材的界面模糊失真，而文字、线框布局等用HTML渲染的界面没有失真

![此处输入图片的描述][4]


  [1]: http://www.qianduan.net/mobile-webapp-develop-essential-knowledge.html
  [2]: http://mansonchor.github.io/mobile_web_frame/images/css_spice.jpg
  [3]: http://zhidao.baidu.com/link?url=0Y4ChFZ8gU6QjrtKZX2A6QrOHHKXxzd9J8b7Rj2uyviSmOVwbRyMe3ORnm2ryc4sYDDMZ0-xAFysMxU7T3TLSq
  [4]: http://mansonchor.github.io/mobile_web_frame/images/scrall.jpg