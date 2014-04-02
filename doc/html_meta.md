# HTML前期实用属性配置

设置让窗口和屏幕等宽；禁止用户在屏幕双指缩放界面；并且兼容IPHONE 5的长度
```HTML
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"  />
<meta name="viewport" content="initial-scale=1.0 , maximum-scale=1.0 , user-scalable=no" media="(device-height: 568px)" />
```


禁止手机浏览器自动识别电话号码和EMAIL

```HTML
<meta content="telephone=no" name="format-detection" />
<meta content="email=no" name="format-detection" />
```

IOS safari把网址添加到桌面的时候，可以设置ICON，启动封面图等
```HTML
/*ICON各种size适配*/
<link rel="apple-touch-icon-precomposed" sizes="57x57" href="images/app_icon-57x57.png" /> 
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="images/app_icon-72x72.png" /> 
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="images/app_icon-114x114.png" /> 
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="images/app_icon-144x144.png" /> 

/*启动封面各种size适配*/
<!-- iPhone (Retina) -->
<link href="images/start_up_640x920.png" media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image">

<!-- iPhone 5 -->
<link href="images/start_up_640x1096.png"  media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image">

<!-- iPad Portrait -->
<link href="images/ipad_start_up_768x1004.png" media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)" rel="apple-touch-startup-image">

<!-- iPad Landscape -->
<link href="images/ipad_start_up_1024x748.png" media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)" rel="apple-touch-startup-image">

<!-- iPad Portrait (Retina) -->
<link href="images/ipad_start_up_1536x2008.png" media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image">

<!-- iPad Landscape (Retina) -->
<link href="images/ipad_start_up_2048x1496.png" media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image">


/*桌面书签形式打开时，没有顶部状态栏*/
<meta name="apple-mobile-web-app-capable" content="yes" />
```


解决横竖屏会出现字体加粗不一致情况
```CSS
html,body { 
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;
}
```


禁止用户长按行为和选中文字
```CSS
html,body {  -webkit-touch-callout: none; -webkit-user-select: none; -webkit-tap-highlight-color: none; }
```

![此处输入图片的描述][1]

![此处输入图片的描述][2]


  [1]: http://mansonchor.github.io/mobile_web_frame/images/select_text.jpg
  [2]: http://mansonchor.github.io/mobile_web_frame/images/hold_demo.jpg