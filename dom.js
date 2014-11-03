'use strict';

var util = require('./util');
var mixin = util.mixin;
var cx = util.cx;

// toVDOM: vnode -> DOM
function toVDOM(vnode) {
  if (Array.isArray(vnode)) {
    return vnode.map(toVDOM); 
  } else if (typeof vnode === 'object') {
    
    var node = document.createElement(vnode.tag);
    
    // attrs
    if (vnode.attrs) {
      for (var attr in vnode.attrs) {
        if (attr === 'className') {
          node[attr] = cx(vnode.attrs[attr]);
        } else if (attr === 'style') {
          mixin(node.style, vnode.attrs[attr]);
        } else {
          node.setAttribute(attr, vnode.attrs[attr]);
        }
      }
    }
    
    // events
    if (vnode.events != null) {
      for (var name in vnode.events) {
        node.addEventListener(name, vnode.events[name], false);
      }
    }
    
    // children
    if (vnode.children != null) {
      var children = toVDOM(vnode.children);
      if (Array.isArray(children)) {
        for (var i = 0, len = children.length ; i < len ; i++ ) {
          node.appendChild(children[i]);
        }
      } else {
        node.appendChild(children);
      }
    }

    return node;
  }
  return document.createTextNode(vnode);
}

module.exports = {
  toVDOM: toVDOM
};