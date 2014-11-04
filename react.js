'use strict';

var React = require('react');
var util = require('./util');
var mixin = util.mixin;
var cx = util.cx;

//
// helpers
//

// transforms a generic event name to a React event name
// click -> onClick
// blur -> onBlur
function camelizeEvent(name) {
  return 'on' + name.substring(0, 1).toUpperCase() + name.substring(1);
}

// toElement: vnode -> ReactElement
function toElement(vnode) {
  
  if (Array.isArray(vnode)) {
    return vnode.length === 1 ? toElement(vnode[0]) : vnode.map(toElement);
  }

  if (typeof vnode === 'object') {
    
    var tag = vnode.tag;
    if (typeof tag === 'string') { tag = React.DOM[tag]; }

    // attrs
    var attrs = mixin({}, vnode.attrs);
    if (attrs.className) { attrs.className = cx(attrs.className); }
    if (vnode.key) { attrs.key = vnode.key; }
    if (vnode.ref) { attrs.ref = vnode.ref; }
    
    // events
    if (vnode.events) {
      for (var name in vnode.events) {
        attrs[camelizeEvent(name)] = vnode.events[name];
      }
    }

    // children
    var children = toElement(vnode.children);

    return tag.apply(null, [attrs].concat(children));
  }

  return vnode;
}

module.exports = {
  toElement: toElement
};