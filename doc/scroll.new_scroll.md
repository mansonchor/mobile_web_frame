#scroll.new_scroll( scroll_view_obj, [options] )

@**return** {frame scroll object}

@**param** {dom | zepto对象} scroll_view_obj： 要滚动的容器

@**param** {json} options

>{int}  **view_height** ： 设定滚动容器的高度

>{bool}  **bounce** [defalut : false]： 滚动到边缘是否有反弹

>{function}  **scroll_start**： 滚动开始时触发

>{function}  **scroll_end**： 滚动完毕时触发

>{bool}  **use_lazyload** [defalut : false]： 是否使用lazyload加载图片

说明：

-  1. scroll_view_obj 是包裹着滚动内容的最外层容器，使用scroll控件需要html组织配合。iscroll官方建议html结构越简单越好




