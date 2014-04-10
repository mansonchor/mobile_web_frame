/**
 * The text plugin to load a module as text content
 */
define(['base/plugin-base'], function(require) {

  var plugin = require('base/plugin-base')
  var util = plugin.util


  plugin.add({
    name: 'text',

    ext: ['.tpl', '.htm', '.html'],

    fetch: function(url, callback) {
      util.xhr(url, function(data) {
        var str = jsEscape(data)
        util.globalEval('define([], "' + str + '")')
        callback()
      })
    }
  })


  function jsEscape(s) {
    return s.replace(/(["\\])/g, '\\$1')
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n")
        .replace(/\t/g, "\\t")
        .replace(/\f/g, "\\f")
  }

});
