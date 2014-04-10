/**
  *  送礼物、发私信弹出层模块
  *  lj
  *  2014.2.11
  */
define("wo/module/interact_module", ["base_package"], function(require, exports)
{
    var $ = require('zepto')
    var Backbone = require('backbone')
    var common_function = require('commom_function')
    var page_control = require('page_control')
	var ua = require('ua')
	var new_alert_v2 = require("new_alert_v2")
	var select_module_class = require("select_module")()
	var wo_config = require('wo_config')

    var interact_module_view = Backbone.View.extend(
    {
        className : 'pop_interact_module',
        initialize : function(options)
        {

            var options = options || {}                                                  											
			
			this.just_show_lv2_layout = options.just_show_lv2_layout || false;
			
			this.show_share_btn_list = options.show_share_btn_list || false; 
			
			this.extend_params = options.extend_params || {};
			
			this.sort_key_arr = []
			
			this.animate_time = 300
			
			for(var key_name in options)
			{

			    var s = key_name.toString().replace(/_btn_obj/g,"")
			    
			    this.sort_key_arr.push(s);
			}										
			
			// 礼物按钮对象
			this.gift_btn_obj = options.gift_btn_obj;			
			if(this.gift_btn_obj)
			{
			   this.gift_btn_obj.show = options.gift_btn_obj.show || false;     
			   this.gift_btn_obj.click_btn_callback = options.gift_btn_obj.click_btn_callback || function(){} 
			}					
			
			// 私信按钮对象
			this.message_btn_obj = options.message_btn_obj;
			if(this.message_btn_obj)
			{
			   this.message_btn_obj.show = options.message_btn_obj.show || false;
			   this.message_btn_obj.click_btn_callback = options.message_btn_obj.click_btn_callback || function(){} 
			}	
			
			// 分享按钮对象
			this.share_btn_obj = options.share_btn_obj;
            if(this.share_btn_obj)
            {
               this.share_btn_obj.show = options.share_btn_obj.show || false;
               this.share_btn_obj.count = options.share_btn_obj.count || 4;
               this.share_btn_obj.show_share_btn_list = options.share_btn_obj.show_share_btn_list
               this.share_btn_obj.click_btn_callback = options.share_btn_obj.click_btn_callback || function(){}
               this.share_btn_obj.share_btn_list_click_callback = options.share_btn_obj.share_btn_list_click_callback || function(){} 
            }					                       
			
			// 下载按钮对象
			this.download_btn_obj = options.download_btn_obj;
			if(this.download_btn_obj)
			{
			   this.download_btn_obj.show = options.download_btn_obj.show || false;    
			   this.download_btn_obj.click_btn_callback = options.download_btn_obj.click_btn_callback || function(){}
			}          
            
            // 举报按钮对象
            this.report_btn_obj = options.report_btn_obj;
            if(this.report_btn_obj)
            {
               this.report_btn_obj.show = options.report_btn_obj.show || false; 
               this.report_btn_obj.click_btn_callback = options.report_btn_obj.click_btn_callback || function(){}
            }						                                              
			
			// 刷新按钮对象
			this.refresh_btn_obj = options.refresh_btn_obj;
			if(this.refresh_btn_obj)
			{
			   this.options.refresh_btn_obj.show = options.refresh_btn_obj.show || false; 
			   this.refresh_btn_obj.click_btn_callback = options.refresh_btn_obj.click_btn_callback || function(){}
			}                      

            this._render()
            
            this.hide();
        },
        _render : function()
        {
            var btns_html = [];
            
            var share_btn_list_html = [];                           
            
            for(var i=0;i<this.sort_key_arr.length;i++)
            {
                
                if(this.sort_key_arr[i]=='gift')
                {
                                     
                    if(this.gift_btn_obj&&this.gift_btn_obj.show)
                    {
                        // 礼物按钮模板
                        btns_html.push('<div data-to-gift_list class="first_layout_btn td-send-gift w-100 bdb-line-e1e"><p >送礼物</p></div>')                                
                        
                    }
                }
                if(this.sort_key_arr[i]=='message')
                {
                    
                    if(this.message_btn_obj&&this.message_btn_obj.show)
                    {
                        // 私信按钮模板
                        btns_html.push('<div data-to-letter class="first_layout_btn td-letter w-100 bdb-line-e1e"><p >发私信</p></div>')
                    }
                }
                if(this.sort_key_arr[i]=='share')
                {
                                        
                    if(this.share_btn_obj&&this.share_btn_obj.show)
                    if(true)
                    {
                        // 分享按钮模板
                        //btns_html.push('<div align="center" valign="middle" class="td-share w-100"><span data-to-share="" class="icon-wrap radius-2px"><em class="icon icon-share icon-bg-common"></em></span><p class="mt10">分享</p></div>');
                        
                        var o = this.share_btn_obj.show_share_btn_list; 
                        
                        var items_arr = [];                               
                        
                        for(var obj in o)                               
                        {                    
                            
                            if(o[obj]&&obj == 'sina')
                            {
                                items_arr.push('<td align="center" valign="middle" class="td-sina"><span data-to-share_list="sina" class="icon-wrap radius-2px"><em class="icon icon-sina icon-bg-common"></em></span><p class="mt10">新浪微博</p></td>');
                            }
                            if(o[obj]&&obj == 'qqweibo')
                            {
                                items_arr.push('<td align="center" valign="middle" class="td-qqweibo"><span data-to-share_list="qqweibo" class="icon-wrap radius-2px"><em class="icon icon-qqweibo icon-bg-common"></em></span><p class="mt10">腾讯微博</p></td>')
                            }
                            if(o[obj]&&obj == 'qqzone')
                            {
                                items_arr.push('<td align="center" valign="middle" class="td-qqzone"><span data-to-share_list="qqzone" class="icon-wrap radius-2px"><em class="icon icon-qqzone icon-bg-common"></em></span><p class="mt10">QQ空间</p></td>')
                            }
                            if(o[obj]&&obj == 'weixin')
                            {
                                items_arr.push('<td align="center" valign="middle" class="td-weixin"><span data-to-share_list="weixin" class="icon-wrap radius-2px"><em class="icon icon-weixin icon-bg-common"></em></span><p class="mt10">朋友圈</p></td>')
                            }
                        }                                                                                      
                                                        
                        var len = items_arr.length;                
                        var idx = 0;
                        var str = '';
                        var tr_str = '';
        
                        for(var m = 0;m<len;m++)
                        {                       
                            idx++
                            
                            str += items_arr[m];                   
                            
                            if(idx == this.share_btn_obj.count||m==len-1)
                            {                                               
                                idx = 0
                                
                                tr_str = '<tr class="color666">'+str+'</tr>';        
                                
                                share_btn_list_html.push(tr_str)
                                
                                str = '';
                                
                                tr_str = '';                                             
                            }
                                               
                        }
                                        
        
                        
                    }
                }
                if(this.sort_key_arr[i]=='download')
                {                                          
                    if(this.download_btn_obj&&this.download_btn_obj.show)
                    {
                        // 下载按钮模板
                        btns_html.push('<div data-to-download class="first_layout_btn td-download w-100 bdb-line-e1e"><p >下载</p></div>');
                    }
                }
                if(this.sort_key_arr[i]=='report')
                {
                                       
                    if(this.report_btn_obj&&this.report_btn_obj.show)
                    {
                        // 举报按钮模板
                        btns_html.push('<div data-to-report class="first_layout_btn td-report w-100 bdb-line-e1e"><p >举报</p></div>');
                    }
                }
                if(this.sort_key_arr[i]=='refresh')
                {
                    
                    if(this.refresh_btn_obj&&this.refresh_btn_obj.show)
                    {
                        // 刷新按钮模板
                        btns_html.push('<div data-to-refresh class="first_layout_btn td-refresh w-100 bdb-line-e1e"><p >刷新</p></div>');
                    }
                }
                               
            }                     

            
            var html = '<div class="fade-page-module w-100 h-100" style="display:none;"></div><div class="pop-personal-wrap w-100 oh color333" data-pop-personal=""><div class="font_wryh"><div class="item bgcfaf" data-first_lv_layout style="display:none"><div class="f14 w-100 color333 " style="text-align:center">'+btns_html.join("")+'</div></div><div data-second_lv_layout class="bdb-line-dcd" style="display:none"><div class="item bgcfaf"><p class="color666" style="text-align: center;padding: 15px 0 5px 0;">分享到</p><table border="0" cellspacing="0" cellpadding="0" class="w-100 f10"><tbody>'+share_btn_list_html.join("")+'</tbody></table></div></div><div class="btn-cancel tc" data-cancel="">取消</div><div class="btn-cancel tc" data-sec_cancel="" style="display:none">取消</div></div></div>'                                               

            this.$el.html(html)
            
            this.data_pop_personal_obj = this.$el.find('[data-pop-personal]')
            
            this.data_pop_personal_obj.css({'bottom':'-30000px'})                                               
            
            if(this.just_show_lv2_layout)
            {
                this.$el.find("[data-first_lv_layout]").hide();
                this.$el.find("[data-second_lv_layout]").show();
            }   
            
            if(this.show_share_btn_list)
            {
                this.$el.find("[data-second_lv_layout]").show();
                this.$el.find("[data-second_lv_layout]").show();
            }
                   

        },
        show : function()
        {
            var that = this;                                  
            
            if(ua.isAndroid)
			{
				this.animate_time = 0
			}
			
			this.data_pop_personal_obj.css({'bottom':-this.data_pop_personal_obj.height()+'px'}) 
						            
            that.bg_show()                                     
            
            if(this.just_show_lv2_layout)
            {
                this.data_pop_personal_obj.animate({'translate3d':'0px, -'+parseInt(this.data_pop_personal_obj.height())+'px, 0px'},this.animate_time,'ease-in-out')                
            }
            else
            {
                that.$el.find('[data-first_lv_layout]').show();   
                
                this.data_pop_personal_obj.animate({'translate3d':'0px, -'+parseInt(this.data_pop_personal_obj.height())+'px, 0px'},this.animate_time,'ease-in-out')
            }
                        

        },
        hide : function()
        {
            var that = this			                     
            
            if(ua.isAndroid)
            {
                this.animate_time = 0
            }            			
			
			if(this.just_show_lv2_layout)
			{
			    this.data_pop_personal_obj.animate({'translate3d':'0px, 1000px, 0px'},this.animate_time,'ease-in-out')
              
                that.bg_hide()
			}
			else
			{			    
			    this.data_pop_personal_obj.animate({'translate3d':'0px, '+parseInt(this.data_pop_personal_obj.height())+'px, 0px'},this.animate_time,'ease-in-out')
              
                that.bg_hide()                                                      
                
                that.$el.find('[data-first_lv_layout]').show();    
			}
			

        },
        bg_show : function(callback)
        {
            var that = this
            
            that.$el.find('.fade-page-module').show()
            
        },
        bg_hide : function()
        {
            var that = this
            
            that.$el.find('.fade-page-module').hide();
                        
        },
        events :
        {
			//送礼物
            'tap [data-to-gift_list]' : function()
            {
                var that = this;
                
                if(typeof this.gift_btn_obj.click_btn_callback == 'function')
                {                                      
                    this.gift_btn_obj.click_btn_callback.call(this);
                    
                    that.hide();
                }
            },			
			//发私信
            'tap [data-to-letter]' : function()
            {
                var that = this;
                
                if(typeof this.message_btn_obj.click_btn_callback == 'function')
                {                                      
                    this.message_btn_obj.click_btn_callback.call(this);
                    
                    that.hide();
                }
            },
            //分享
            'tap [data-to-share]' : function()
            {
                var that = this;
                
                if(typeof this.share_btn_obj.click_btn_callback == 'function')
                {                                      
                    this.share_btn_obj.click_btn_callback.call(this);
                                                                         
                }
                
                that.$el.find('[data-first_lv_layout]').hide();
            
                that.$el.find('[data-second_lv_layout]').show();
                                    
            },
            //下载
            'tap [data-to-download]' : function()
            {
                var that = this;
                
                if(typeof this.download_btn_obj.click_btn_callback == 'function')
                {                                      
                    this.download_btn_obj.click_btn_callback.call(this);
                    
                    that.hide();
                }
            },
			//举报
            'tap [data-to-report]' : function()
            {
                var that = this;
                
                if(typeof this.report_btn_obj.click_btn_callback == 'function')
                {                                      
                    this.report_btn_obj.click_btn_callback.call(this,this.select_report_obj);
                    
                    that.hide();
                }
            },
            //刷新
            'tap [data-to-refresh]' : function()
            {
                var that = this;
                
                if(typeof this.refresh_btn_obj.click_btn_callback == 'function')
                {                                      
                    this.refresh_btn_obj.click_btn_callback.call(this);
                    
                    that.hide();
                }
            },
			
			// 点击取消按钮
			'tap [data-cancel]' : function()
			{
				var that = this
			    that.hide()
			},
			// 点击取消第二层按钮
            'tap [data-sec_cancel]' : function()
            {
                var that = this
                
                that.hide_share_list()
                                
                            
            },	
			//点击遮罩层
			'tap .fade-page-module' : function()
			{
                var that = this
			    that.hide()
			},
			'tap [data-to-share_list]' : function(ev)
			{
			    var that = this
			    
			    var share_type = $(ev.currentTarget).attr('data-to-share_list')
			    
			    if(typeof this.share_btn_obj.share_btn_list_click_callback == 'function')
			    {
			        this.share_btn_obj.share_btn_list_click_callback.call(this,share_type);
			        
			        var stat_img = new Image()
                    stat_img.src = 'http://imgtj.poco.cn/pocotj_touch.css?url=touch://mpoco/mobile/share_btn_click'
                                         
			    }
			    
			    that.hide()
			}
			
        },
        init_report_select_control : function(art_id)
        {
            var select_report_obj = new select_module_class
            ({ 
                options_data : 
                [
                    { key : "裸体" , val : "裸体" },
                    { key : "版权" , val : "版权" },
                    { key : "其他" , val : "其他" }
                ],
                onchange : function()
                {
                    var select_data = this.get_select_data()                                                              
                    
                    if(!common_function.is_empty(select_data))
                    {                        
                        common_function.send_request
                        ({
                            url : wo_config.ajax_url.add_report,
                            data : { art_id : art_id,t : parseInt(new Date().getTime())},
                            callback : function()
                            {   
                                new_alert_v2.show({text:"举报成功",type : "info",is_cover:false,auto_close_time : 2000});
                            }
                        })
                    }
                    
                }
            })
            
            this.select_report_obj = select_report_obj;
            
            return this.select_report_obj
                        
        },		
        give_gift_action : function(to_user_id)
        {            

            var login_requirement = common_function.publish_login_requirement()
            if(login_requirement)
            {
                page_control.navigate_to_page("login") 
                
                return;
            }
            
            var poco_id = common_function.get_local_poco_id()
			
            if(to_user_id == poco_id)
            {                  
                var alert_tips = new_alert_v2.show({text:"自己不能给自己送礼物！",type : "info",is_cover : false ,auto_close_time:1000}); 
				
				
            }
            else
            {
                page_control.navigate_to_page("send_gift/"+to_user_id)   
            }
                                            
        },
		control_nav_to_message_list : function(to_user_id)
        {            
		
            var login_requirement = common_function.publish_login_requirement()
            if(login_requirement)
            {
                page_control.navigate_to_page("login") 
                    
                return;
             }
			
			var poco_id = common_function.get_local_poco_id()
            
            if(poco_id == to_user_id)
		    {			                    
                var alert_tips = new_alert_v2.show({text:"你不能向自己发私信！",type : "info",is_cover : false ,auto_close_time:1000});	
			}
			else
			{
				page_control.navigate_to_page("message_list/"+to_user_id)
                                
			}	
                                            
        },        
        share_img : function(cur_share_tag,share_img,share_txt,share_url)
        {
            var shareImg = encodeURIComponent(share_img)
            var shareTxt = encodeURIComponent(share_txt)
            var shareUrl = encodeURIComponent(share_url)

            switch(cur_share_tag)
            {
                case "sina" :
                    var url = 'http://service.weibo.com/share/share.php?title=' + shareTxt + '&url=' + shareUrl + '&pic=' + shareImg + '&appkey=1684948437&source=bookmark'
                    break;
                case "qqweibo":
                    var url = 'http://share.v.t.qq.com/index.php?c=share&a=index&title=' + shareTxt + '&url=' + shareUrl + '&pic=' + shareImg + '&source=bookmark'
                    break;
                case "qqzone":
                    var url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' + shareTxt + '&summary=' + shareTxt + '&desc=' + shareTxt + '&url=' + shareUrl + '&pics=' + shareImg                                                                               
                    break;
            }            

            window.open(url)

        }


    })

    return interact_module_view

})

if(typeof(process_add)=="function")
{
	process_add()
}