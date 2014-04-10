/**
  *  未登陆模块
  *  lj
  *  2014.1.8
  */
define("wo/module/no_login", ["base_package"], function(require, exports)
{
    var $ = require('zepto')
    var Backbone = require('backbone')
    var common_function = require('commom_function')
    var page_control = require('page_control')

    var no_login_view = Backbone.View.extend(
    {
        className : 'content-25 no_login',
        initialize : function(options)
        {

            var options = options || {}
            
            var message = options.message || '你尚未登录，请点击按钮进行登录/注册。'                        

            this.message = message                  

            this._render()
        },
        _render : function()
        {

            var html = '<div class="me-page-nologin font_wryh"><table border="0" cellspacing="0" cellpadding="0"><tbody><tr><td align="center"><p>' + this.message + '</p><div login_btn class="ui-btn-register mt20"><span>登录</span></div></td></tr></tbody></table></div>'                        

            this.$el.html(html)                       

        },
        show : function()
        {
            var that = this;

            that.$el.show()

        },
        hide : function()
        {
            var that = this;

            that.$el.hide()
        },
        events :
        {
            'tap [login_btn]' : function()
            {
                page_control.navigate_to_page("login")
            }
        }

    })

    return no_login_view

})

if(typeof(process_add)=="function")
{
	process_add()
}