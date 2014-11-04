'use strict';

var util = require('./util');
var mixin = util.mixin;
var cx = util.cx;

function attr(name, value) {
  // handle selected="false"
  if (value === false || value == null) { return ''; }
  return ' ' + escapeHTML(name) + '="' + escapeHTML(value) + '"';
}

function style(styles) {
  return Object.keys(styles).map(function (name) {
    return name + ': ' + style[name];
  }).join(';');
}

var ESCAPE_LOOKUP = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  "\"": "&quot;",
  "'": "&#x27;"
};

var ESCAPE_REGEX = /[&><"']/g;

function escaper(match) {
  return ESCAPE_LOOKUP[match];
}

function escapeHTML(text) {
  return text.replace(ESCAPE_REGEX, escaper);
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

function uuidOf(hash) {
  var ret;
  while (hash.hasOwnProperty(ret = uuid())) {}
  return ret;
}

// toHTML: (vnode, [events]) -> HTML
function toHTML(vnode, events) {
  
  if (Array.isArray(vnode)) {
    return vnode.map(function (x) {
      return toHTML(x, events);
    }).join('');
  }

  if (typeof vnode === 'object') {
    var html = '<' + vnode.tag;
    
    // attrs
    if (vnode.attrs) {
      for (name in vnode.attrs) {
        if (name === 'className') {
          html += attr('class', cx(vnode.attrs[name]));
        } else {
          html += attr(name, name === 'style' ? style(vnode.attrs[name]) : vnode.attrs[name]);
        }
      }
    }    

    // events
    if (vnode.events != null && events) {
      var id = vnode.attrs ? vnode.attrs.id : null;
      for (name in vnode.events) {
        if (!id) { 
          id = uuidOf(events); 
          html += attr('id', id);
        }
        events[id] = {name: name, handler: vnode.events[name]};
      }
    }

    // children
    if (vnode.children != null) {
      html += '>';
      html += toHTML(vnode.children, events);
      html += '</' + vnode.tag + '>';
    } else {
      html += '/>';
    }

    return html;
  }

  return escapeHTML(vnode);
}

module.exports = {
  toHTML: toHTML
};