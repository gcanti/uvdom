'use strict';

var util = require('./util');
var mixin = util.mixin;
var cx = util.cx;

// toDOM: vnode -> DOM
function toDOM(vnode) {

  if (Array.isArray(vnode)) { 
    return vnode.map(toVDOM);
  } 

  if (typeof vnode === 'object') {
    
    var name;
    var node = document.createElement(vnode.tag);
    
    // attrs
    if (vnode.attrs) {
      for (name in vnode.attrs) {
        if (name === 'className') {
          node[name] = cx(vnode.attrs[name]);
        } else if (name === 'style') {
          mixin(node.style, vnode.attrs[name]);
        } else {
          node.setAttribute(name, vnode.attrs[name]);
        }
      }
    }
    
    // events
    if (vnode.events != null) {
      for (name in vnode.events) {
        node.addEventListener(name, vnode.events[name], false);
      }
    }
    
    // children
    if (vnode.children != null) {
      var children = toDOM(vnode.children);
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
  toDOM: toDOM
};