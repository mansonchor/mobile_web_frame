define("frame/view_scroll",["base_package","ua"],function(require, exports){

	var $ = require('zepto')
	var ua = require('ua')
	

	//lazyload属性暂时统一用 lazyload_src，不做传参，模板需按格式整合  add by manson 2013.10.23
	function lazyload_control(scroll_view_obj)
	{
		var trigger_range = 200			//触发lazyload的增加范围

		var that = this
		var cur_scroll_y = Math.abs(that.y)
		var scroll_view_height = $(scroll_view_obj).height()

		$(scroll_view_obj).find('[lazyload_src]').each(function(i,img_obj)
		{
			var jq_img_obj = $(img_obj)
			
			var position = jq_img_obj.position()
			var position_top = position.top
			var img_height = jq_img_obj.height()
			
			//console.log(position_top)

			if(position_top + img_height > 0 && position_top < scroll_view_height + trigger_range)
			{
				var img_url = jq_img_obj.attr('lazyload_src')
				jq_img_obj.attr('src',img_url).removeAttr('lazyload_src')
			}
		})
	}


	exports.new_scroll = function(scroll_view_obj,options)
	{
		var that = this
		that.options = options
		var options = that.options || {}
		var view_height = options.view_height || "100%"
        var use_lazyload = options.use_lazyload || false
        var bounce = options.bounce || false

        var scroll_end = options.scroll_end || function(){}
		var scroll_start = options.scroll_start || function(){}
		    
        var hideScrollbar = options.hideScrollbar==null ? true : options.hideScrollbar

		$(scroll_view_obj).css('height' , view_height+'px')

		
		//针对高版本系统ios
		if( ua.ios_version<"6" || ua.isAndroid || true )
		{
			var iscroll_class = require('iScroll')

			$(scroll_view_obj).css({'position':'relative'})
			
			var myScroll = new iscroll_class($(scroll_view_obj)[0],{
				checkDOMChanges : true,
				bounce : bounce,
				hideScrollbar : hideScrollbar,
                useTransform: true,
				useTransition : false,
                zoom: false,
				onScrollEnd : function()
				{
				    if(typeof scroll_end == 'function')
                    {
                        scroll_end.call(this,scroll_view_obj)
                    }
				    
					if(use_lazyload)
					{
						lazyload_control.call(this,scroll_view_obj)
					}
				},
				onScrollStart : function()
				{
					
					if(typeof scroll_start == 'function')
                    {
                        scroll_start.call(this,scroll_view_obj)
                    }
				}
			})		  			
		}
		else
		{
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
		
		scroll_obj.trigger_scrollend = function()
		{
			if(myScroll)
			{
				myScroll.options.onScrollEnd()
			}
		}

		return scroll_obj
	}
})