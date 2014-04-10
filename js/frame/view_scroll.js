define("frame/view_scroll",["base_package","ua"],function(require, exports){

	var $ = require('zepto')
	var ua = require('ua')
	
	exports.new_scroll = function(scroll_view_obj,options)
	{
		var that = this
		that.options = options
		var options = that.options || {}
		var view_height = options.view_height || "100%"
		
		$(scroll_view_obj).css('height' , view_height+'px')
		
		
		//针对高版本系统ios
		if( ua.ios_version<"6" || ua.isAndroid )
		{
			/*if(localStorage.getItem('poco_id')==54761328)
			{
				var iscroll_class = require('iScroll5')

				$(scroll_view_obj).css({'overflow':'hidden'})
				$(scroll_view_obj).css({'position':'relative'})

				var myScroll = new iscroll_class($(scroll_view_obj)[0],{
					scrollbars : true,
					bounce : false,
					useTransition : false
				})
				
				setTimeout(function(){
					myScroll.refresh()
				},1000)
				
			}
			else
			{*/
				var iscroll_class = require('iScroll')

				$(scroll_view_obj).css({'position':'relative'})
				
				var myScroll = new iscroll_class($(scroll_view_obj)[0],{
					checkDOMChanges : true,
					bounce : false
				})
                
                enableFormsInIscroll()
			//}
		}
		else
		{
			//req!!uire('view_scroll_css')
			$(scroll_view_obj).addClass('touch_scroll_css')
		}
		
		//返回的对象
		var scroll_obj = {}

		scroll_obj.scroll_to = function(top)
		{
			if(myScroll)
			{
				myScroll.scrollTo(0,top,0)
			}
			else
			{
				scroll_view_obj[0].scrollTop = top
			}
		}

		/*var scroll_interval_handle
		
		$(scroll_view_obj).scroll(function(){
			
			var that = this

			clearTimeout(scroll_interval_handle)
			scroll_interval_handle = setTimeout(function(){
				
				alert('scroll end')

			},500)
		})*/
        
        function enableFormsInIscroll(){
  [].slice.call(document.querySelectorAll('input, select, button, textarea')).forEach(function(el){
    el.addEventListener(('ontouchstart' in window)?'touchstart':'mousedown', function(e){
      e.stopPropagation();
    })
  })
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener('DOMContentLoaded', function () { setTimeout(iScrollLoad, 200); }, false);


		return scroll_obj
	}


});