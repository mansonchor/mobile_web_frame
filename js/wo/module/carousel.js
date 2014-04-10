/*
 * 新版滚动图片模块 
 * 
 */
define('wo/module/carousel', ['wo_config', 'base_package', 'ua', "new_alert_v2", "commom_function"], function(require, exports)
{
    var $ = require('zepto');
    var page_control = require("page_control");
    var Backbone = require("backbone");
    var common_function = require("commom_function");
    var Mustache = require("mustache");

    function new_carousel()
    {
        var Mobify = window.Mobify = window.Mobify ||
        {
        };
        Mobify.$ = Mobify.$ || $;
        Mobify.UI = Mobify.UI ||
        {
            classPrefix : 'm-'
        };
    
        (function($, document)
        {
    
            $.support = $.support ||
            {
            };
    
            $.extend($.support,
            {
                'touch' : 'ontouchend' in document
            });
    
        })(Mobify.$, document);
    
        /**
         @module Holds common functions relating to UI.
         */
        Mobify.UI.Utils = (function($)
        {
            var exports =
            {
            }, has = $.support;
    
            /**
             Events (either touch or mouse)
             */
            exports.events = (has.touch) ?
            {
                down : 'touchstart',
                move : 'touchmove',
                up : 'touchend'
            } :
            {
                down : 'mousedown',
                move : 'mousemove',
                up : 'mouseup'
            };
    
            /**
             Returns the position of a mouse or touch event in (x, y)
             @function
             @param {Event} touch or mouse event
             @returns {Object} X and Y coordinates
             */
            exports.getCursorPosition = (has.touch) ? function(e)
            {
                e = e.originalEvent || e;
                return{
                    x : e.touches[0].clientX,
                    y : e.touches[0].clientY
                }
            } : function(e)
            {
                return{
                    x : e.clientX,
                    y : e.clientY
                }
            };
    
            /**
             Returns prefix property for current browser.
             @param {String} CSS Property Name
             @return {String} Detected CSS Property Name
             */
            exports.getProperty = function(name)
            {
                var prefixes = ['Webkit', 'Moz', 'O', 'ms', ''], testStyle = document.createElement('div').style;
    
                for (var i = 0; i < prefixes.length; ++i)
                {
                    if (testStyle[prefixes[i] + name] !== undefined)
                    {
                        return prefixes[i] + name;
                    }
                }
    
                // Not Supported
                return;
            };
    
            $.extend(has,
            {
                'transform' : !!(exports.getProperty('Transform')),
                'transform3d' : !!(window.WebKitCSSMatrix && 'm11' in new WebKitCSSMatrix())
            });
    
            // translateX(element, delta)
            // Moves the element by delta (px)
            var transformProperty = exports.getProperty('Transform');
            if (has.transform3d)
            {
                exports.translateX = function(element, delta)
                {
                    if ( typeof delta == 'number')
                        delta = delta + 'px';
                    element.style[transformProperty] = 'translate3d(' + delta + ',0,0)';
                };
            }
            else if (has.transform)
            {
                exports.translateX = function(element, delta)
                {
                    if ( typeof delta == 'number')
                        delta = delta + 'px';
                    element.style[transformProperty] = 'translate(' + delta + ',0)';
                };
            }
            else
            {
                exports.translateX = function(element, delta)
                {
                    if ( typeof delta == 'number')
                        delta = delta + 'px';
                    element.style.left = delta;
                };
            }
    
            // setTransitions
            var transitionProperty = exports.getProperty('Transition'), durationProperty = exports.getProperty('TransitionDuration');
    
            exports.setTransitions = function(element, enable)
            {
                if (enable)
                {
                    element.style[durationProperty] = '';
                }
                else
                {
                    element.style[durationProperty] = '0s';
                }
            }
            // Request Animation Frame
            // courtesy of @paul_irish
            exports.requestAnimationFrame = (function()
            {
                var prefixed = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                function(callback)
                {
                    window.setTimeout(callback, 1000 / 60);
                });
    
                var requestAnimationFrame = function()
                {
                    prefixed.apply(window, arguments);
                };
    
                return requestAnimationFrame;
            })();
    
            return exports;
    
        })(Mobify.$);
    
        Mobify.UI.Carousel = (function($, Utils)
        {        
            
            var defaults =
            {
                dragRadius : 10,
                moveRadius : 20,
                classPrefix : undefined,
                classNames :
                {
                    outer : 'carousel',
                    inner : 'carousel-inner',
                    item : 'item',
                    center : 'center',
                    touch : 'has-touch',
                    dragging : 'dragging',
                    active : 'active'
                }
            }, has = $.support;
    
            // Constructor
            var Carousel = function(element, options)
            {
                this.setOptions(options);
                this.initElements(element);
                this.initOffsets();
                this.initAnimation();
                this.bind();
                
            };
            
            var sit;
            
            var anmating = false;
    
            // Expose Dfaults
            Carousel.defaults = defaults;
    
            Carousel.prototype.setOptions = function(opts)
            {            
                var options = this.options || $.extend(
                {
                }, defaults, opts);
    
                /* classNames requires a deep copy */
                options.classNames = $.extend(
                {
                }, options.classNames, opts.classNames ||
                {
                });           
    
                /* By default, classPrefix is `undefined`, which means to use the Mobify-wide level prefix */
                options.classPrefix = options.classPrefix || Mobify.UI.classPrefix;            
                
                this.options = options;
                            
            };
    
            Carousel.prototype.initElements = function(element)
            {
                this._index = 1;
    
                this.element = element;
                this.$element = $(element);
                this.$inner = this.$element.find('.' + this._getClass('inner'));
                this.$items = this.$inner.children();
    
                this.$start = this.$items.eq(0);
                this.$sec = this.$items.eq(1);
                this.$current = this.$items.eq(this._index);
    
                this._length = this.$items.length;
                this._alignment = this.$element.hasClass(this._getClass('center')) ? 0.5 : 0;
    
            };
    
            Carousel.prototype.initOffsets = function()
            {
                this._offset = 0;
                this._offsetDrag = 0;
            }
    
            Carousel.prototype.initAnimation = function()
            {
                this.animating = false;
                this.dragging = false;
                this._needsUpdate = false;
                this._enableAnimation();
            };
    
            Carousel.prototype._getClass = function(id)
            {
                return this.options.classPrefix + this.options.classNames[id];
            };
    
            Carousel.prototype._enableAnimation = function()
            {
                if (this.animating)
                {
                    return;
                }
    
                Utils.setTransitions(this.$inner[0], true);
                this.$inner.removeClass(this._getClass('dragging'));
                this.animating = true;
            }
    
            Carousel.prototype._disableAnimation = function()
            {
                if (!this.animating)
                {
                    return;
                }
    
                Utils.setTransitions(this.$inner[0], false);
                this.$inner.addClass(this._getClass('dragging'));
                this.animating = false;
            }
    
            Carousel.prototype.update = function()
            {
                /* We throttle calls to the real `_update` for efficiency */
                if (this._needsUpdate)
                {
                    return;
                }
    
                var self = this;
                this._needsUpdate = true;
                Utils.requestAnimationFrame(function()
                {
                    self._update();
                });
            }
    
            Carousel.prototype._update = function()
            {
                if (!this._needsUpdate)
                {
                    return;
                }
    
                var x = Math.round(this._offset + this._offsetDrag);
    
                Utils.translateX(this.$inner[0], x);
    
                this._needsUpdate = false;
            }
    
            Carousel.prototype.bind = function()
            {
                var abs = Math.abs, dragging = false, canceled = false, dragRadius = this.options.dragRadius, xy, dx, dy, dragThresholdMet, self = this, $element = this.$element, $inner = this.$inner, opts = this.options, dragLimit = this.$element.width(), lockLeft = false, lockRight = false;
                
                var that = this;
                
                function start(e)
                {
                    if (!has.touch)
                        e.preventDefault();
    
                    dragging = true;
                    canceled = false;
    
                    xy = Utils.getCursorPosition(e);
                    dx = 0;
                    dy = 0;
                    dragThresholdMet = false;
    
                    // Disable smooth transitions
                    self._disableAnimation();
    
                    lockLeft = self._index == 1;
                    lockRight = self._index == self._length;
                }
    
                function drag(e)
                {
                    if (!dragging || canceled)
                        return;
    
                    var newXY = Utils.getCursorPosition(e);
                    dx = xy.x - newXY.x;
                    dy = xy.y - newXY.y;
    
                    if (dragThresholdMet || abs(dx) > abs(dy) && (abs(dx) > dragRadius))
                    {
                        dragThresholdMet = true;
                        e.preventDefault();
    
                        if (lockLeft && (dx < 0))
                        {
                            dx = dx * (-dragLimit) / (dx - dragLimit);
                        }
                        else if (lockRight && (dx > 0))
                        {
                            dx = dx * (dragLimit) / (dx + dragLimit);
                        }
                        self._offsetDrag = -dx;
                        self.update();
                    }
                    else if ((abs(dy) > abs(dx)) && (abs(dy) > dragRadius))
                    {
                        canceled = true;
                    }
                }
    
                function end(e)
                {
                    if (!dragging)
                    {
                        return;
                    }
    
                    dragging = false;
    
                    self._enableAnimation();
    
                    if (!canceled && abs(dx) > opts.moveRadius)
                    {
                        // Move to the next slide if necessary
                        if (dx > 0)
                        {
                            self.next();
                        }
                        else
                        {
                            self.prev();
                        }
                        
                        that.stop();
                    }
                    else
                    {
                        // Reset back to regular position
                        self._offsetDrag = 0;
                        self.update();
                        
                        
                    }
    
                }
    
                function click(e)
                {
                    if (dragThresholdMet)
                        e.preventDefault();
                }
    
    
                $inner.on(Utils.events.down + '.carousel', start).on(Utils.events.move + '.carousel', drag).on(Utils.events.up + '.carousel', end).on('click.carousel', click).on('mouseout.carousel', end);
    
                $element.on('click', '[data-slide]', function(e)
                {
                    e.preventDefault();
                    var action = $(this).attr('data-slide'), index = parseInt(action, 10);
    
                    if (isNaN(index))
                    {
                        self[action]();
                    }
                    else
                    {
                        self.move(index);
                    }
                });
    
                $element.on('afterSlide', function(e, previousSlide, nextSlide)
                {
                    self.$items.eq(previousSlide - 1).removeClass(self._getClass('active'));
                    self.$items.eq(nextSlide - 1).addClass(self._getClass('active'));
    
                    self.$element.find('[data-slide=\'' + previousSlide + '\']').removeClass(self._getClass('active'));
                    self.$element.find('[data-slide=\'' + nextSlide + '\']').addClass(self._getClass('active'));
                    
                    // 滚动之后回调
                    if(typeof that.options.slide_callback == 'function')
                    {
                        var total = self._length;
                        
                        that.options.slide_callback.call(that,that._index,total);
                        
                        if(that.options.layzload)
                        {
                            var slide_item = $('.m-carousel').find('[data-carousel-layz-src]')
                        
                        
                            if(that._index == 1)
                            {
                                console.log('first')
                                                        
                                slide_item.eq(0).attr('src',slide_item.eq(0).attr('data-carousel-layz-src'))
                                slide_item.eq(1).attr('src',slide_item.eq(1).attr('data-carousel-layz-src'))
                            }
                            else if(that._index == total)
                            {
                                console.log('last')
                                
                                if(total == 2)
                                {
                                    
                                }
                                else
                                {                                
                                    
                                    slide_item.eq(-1).attr('src',slide_item.eq(-1).attr('data-carousel-layz-src'))
                                    slide_item.eq(-2).attr('src',slide_item.eq(-2).attr('data-carousel-layz-src'))    
                                }
                                
                                
                            }
                            else
                            {
                                console.log('normal')
                                
                                slide_item.eq(that._index-2).attr('src',slide_item.eq(that._index-2).attr('data-carousel-layz-src'))
                                slide_item.eq(that._index-1).attr('src',slide_item.eq(that._index-1).attr('data-carousel-layz-src'))
                                slide_item.eq(that._index).attr('src',slide_item.eq(that._index).attr('data-carousel-layz-src'))
                                
                                console.log(slide_item.eq(that._index).attr('data-carousel-layz-src'))
                            }
                        }
                        
                        
                        
                    }
                    
                });
    
                $element.trigger('beforeSlide', [1, 1]);
                $element.trigger('afterSlide', [1, 1]);
                
                
    
                self.update();
    
            };
    
            Carousel.prototype.unbind = function()
            {
                this.$inner.off();
            }
    
            Carousel.prototype.destroy = function()
            {
                this.unbind();
                this.$element.trigger('destroy');
                this.$element.remove();
    
                // Cleanup
                this.$element = null;
                this.$inner = null;
                this.$start = null;
                this.$current = null;
            }
    
            Carousel.prototype.move = function(newIndex, opts)
            {
                var $element = this.$element, $inner = this.$inner, $items = this.$items, $start = this.$start, $current = this.$current, length = this._length, index = this._index;
    
                opts = opts ||
                {
                };
    
                // Bound Values between [1, length];
                if (newIndex < 1)
                {
                    newIndex = 1;
                }
                else if (newIndex > this._length)
                {
                    newIndex = length;
                }
    
                // Bail out early if no move is necessary.
                if (newIndex == this._index)
                {
                    //return; // Return Type?
                }
    
                // Trigger beforeSlide event
                $element.trigger('beforeSlide', [index, newIndex]);
    
                // Index must be decremented to convert between 1- and 0-based indexing.
                this.$current = $current = $items.eq(newIndex - 1);
    
                var currentOffset = $current.prop('offsetLeft') + $current.prop('clientWidth') * this._alignment, startOffset = $start.prop('offsetLeft') + $start.prop('clientWidth') * this._alignment
    
                var transitionOffset = -(currentOffset - startOffset);
    
                this._offset = transitionOffset;
                this._offsetDrag = 0;
                this._index = newIndex;
                this.update();
                // Trigger afterSlide event
                $element.trigger('afterSlide', [index, newIndex]);
                            
            };
    
            Carousel.prototype.next = function()
            {
                this.move(this._index + 1);
            };
    
            Carousel.prototype.prev = function()
            {
                this.move(this._index - 1);
            };
            
            Carousel.prototype.get_cur_index = function()
            {
                return this._index;
            };
            
            
            Carousel.prototype.auto_begin = function()
            {          
                var that = this;  
                
                if(that.options.auto)
                {
                    sit = setInterval(function()
                    {
                        //console.log(that._index)
                        
                        if(that._length == that._index)
                        {
                            that._index = 0;
                            
                            that.$element.find('.m-active').removeClass('m-active')
                        }
                        
                        that.move(that._index + 1);                               
                        
                    },that.options.auto);
                }
           
            };
            
            Carousel.prototype.stop = function()
            {
                var that = this;       
                
                clearInterval(sit)
                
                console.log('stop')
                
                if(anmating)
                {
                    return
                }
                
                anmating = true;
                
                /*
                 * 延迟处理，恢复自动滚动 
                 * hudw 2014.4.4
                 * 
                 */
                if(that.options.auto)
                {
                    setTimeout(function()
                    {
                        that.auto_begin();
                        
                        anmating = false
                    },4000)
                }                
                            
            }         
            
            Carousel.prototype.start_to = function()
            {
                var that = this;  
           
                //that.move(that.options.start_index);    
            }
    
            return Carousel;
    
        })(Mobify.$, Mobify.UI.Utils);
    
        (function($)
        {
            /**
             jQuery interface to set up a carousel
    
             @param {String} [action] Action to perform. When no action is passed, the carousel is simply initialized.
             @param {Object} [options] Options passed to the action.
             */
            $.fn.carousel = function(action, options)
            {            
                
                var initOptions = $.extend(
                {
                }, $.fn.carousel.defaults);
    
                // Handle different calling conventions
                if ( typeof action == 'object')
                {
                    initOptions = $(initOptions, action);               
                    
                    initOptions.auto = (action.auto)?action.auto : false; 
                    initOptions.start_index = (action.start_index)?action.start_index : 1;   
                    initOptions.slide_callback = action.slide_callback || function(){};
                    initOptions.layzload = action.layzload || false;
                    
                    options = null;
                    action = null;                                
                                    
                     
                }                        
                                                  
    
                this.each(function()
                {
                    var $this = $(this), carousel = this._carousel;
    
                    if (!carousel)
                    {                                       
                        carousel = new Mobify.UI.Carousel(this, initOptions);
                    }                              
    
                    if (action)
                    {
                        carousel[action](options);
    
                        if (action === 'destroy')
                        {
                            carousel = null;
                        }
                    }
    
                    this._carousel = carousel;
                    
                    this._carousel.auto_begin();
                    
                    this._carousel.start_to();
    
                                                                                                      
                })
    
                return this;
            };
    
            $.fn.carousel.defaults =
            {
            };
    
        })(Mobify.$);
    }
    
    exports.get_carousel = function()
    {
        return new_carousel() 
    }
    
    exports.get_ad_slider = function(elem,options)
    {
        this.get_carousel();
        
        var options = options || {};
        
        var data = options.data || {};
        var carousel_config = options.carousel_config || {};
        var cur_page_view = options.cur_page_view || {};

        var after_slide_callback = options.after_slide_callback || function(){};
        
        var html_arr = [];
        
        var nav_html_arr = [];
        
        var slide_img_view = Backbone.View.extend
        ({
            initialize : function(options)
            {                                                                
                var that = this;                                                
                
                that.data = this.model
                                                        
                
                that.render()
            },
            render : function()
            {
                var that = this;          
                                
                
                var template = '<div class="m-item"><table border="0" cellspacing="0" cellpadding="0" class="img-box-table w-100"><tbody><tr><td valign="middle" align="center" data-link_type="{{remark}}" data-link_adress="{{link_url}}" ><div class="loading_container"><div class="tb"><div class="icon-bg-common loading"></div></div></div><img class="target_img" src="{{img_url}}"></td></tr></tbody></table></div>'
                
                var html = Mustache.to_html(template, that.data)
                
                $(this.el).html(html) 
                                

            }
        })
        
        $(data).each(function(i,obj)
        {                                               
            
            var slide_img_view_obj = new slide_img_view
            ({
                model : obj,
                idx : i
            })  
            
            html_arr.push(slide_img_view_obj.$el.html());
            
            var active = '';
            
            if(i == 0)
            {
                active = 'm-active'
            }           
            
            var nav_str = '<a href="#" class="'+active+'" data-slide="'+(i+1)+'">'+(i+1)+'</a>'; 
            
            nav_html_arr.push(nav_str) 
        })
        
        elem.find('.m-carousel-inner').html('')
        
        elem.find('.m-carousel-controls').html('')
        
        elem.find('.m-carousel-inner').append(html_arr.join(""))  
        
        if(nav_html_arr.length>1)
        {
            elem.find('.m-carousel-controls').append(nav_html_arr.join(""))   
        }                     
        
        elem.carousel(carousel_config)

        return elem;
    }
    
    // 用于最终页的轮播图
    exports.get_slide_big_img = function(elem,options)
    {
        this.get_carousel();
        
        var options = options || {};
        
        var data = options.data || {};
        var carousel_config = options.carousel_config || {};
        var cur_page_view = options.cur_page_view || {};
        var show_header = options.show_header || false;
        var back_btn_callback = options.back_btn_callback || function(){};
        var after_slide_callback = options.after_slide_callback || function(){};
        
        var html_arr = [];
        
        var slide_img_view = Backbone.View.extend
        ({
            initialize : function(options)
            {                                                                
                var that = this;                                                
                
                that.data = this.model
                                                        
                
                that.render()
            },
            render : function()
            {
                var that = this;          
                                
                
                var template = '<div class="m-item"><table border="0" cellspacing="0" cellpadding="0" class="img-box-table w-100 h-100"><tbody><tr><td valign="middle" align="center" ><div class="loading_container"><div class="tb"><div class="icon-bg-common loading"></div></div></div><img class="target_img" data-carousel-layz-src="{{img_url}}"></td></tr></tbody></table></div>'
                
                var html = Mustache.to_html(template, that.data)
                
                $(this.el).html(html) 
                                

            }
        })
        
        var carousel_header_view = Backbone.View.extend
        ({
            initialize : function(options)
            {                                                                
                var that = this;                                                
                
                that.render()
            },
            render : function()
            {
                var that = this;          
                                
                
                var template = '<div class="top_btn_container"><div class="back_btn fl dib "><div class="back_icon icon icon-bg-common"></div></div><div class="num fr dib font-arial"><span data-cur_page="">0</span>/<span data-total_page="">0</span></div></div>'
                
                var html = Mustache.to_html(template, that.data)
                
                $(this.el).html(html) 
                
                that.hide();
                                
            },
            events : 
            {
                'tap .back_btn' : function()
                {                    
                    if(typeof back_btn_callback == 'function')
                    {                       
                        back_btn_callback.call(this)
                    }
                }
            },            
            show : function()
            {
                $(this.el).show();
            },
            hide : function()
            {
                $(this.el).hide();
            }
        })
                    
        $(data).each(function(i,obj)
        {                                               
            
            var slide_img_view_obj = new slide_img_view
            ({
                model : obj,
                idx : i
            })  
            
            html_arr.push(slide_img_view_obj.$el.html());  
        })       
        
        var carousel_header_view_obj = new carousel_header_view();
        
        cur_page_view.find('.last_big_img').prepend(carousel_header_view_obj.$el)
        
        if(show_header)
        {
            carousel_header_view_obj.show();   
        }                
        
        var slide_callback = 
        {
            slide_callback : function(cur_idx,total)
            {
                if(typeof after_slide_callback == 'function')
                {                       
                    after_slide_callback.call(this,cur_idx,total)
                }                                
                                
                carousel_header_view_obj.$el.find('[data-cur_page]').html(cur_idx)
                
                carousel_header_view_obj.$el.find('[data-total_page]').html(total)

            }
        }
        
        carousel_config = $.extend(carousel_config,slide_callback)   
                
        
        elem.find('.m-carousel-inner').append(html_arr.join(""))        
        
        elem.carousel(carousel_config)

        return elem;
    }

});
if ( typeof (process_add) == "function")
{
    process_add();
}

