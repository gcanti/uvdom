'use strict';

function mixin(x, y) {
  if (!y) { return x; }
  for (var k in y) {
    if (y.hasOwnProperty(k)) { x[k] = y[k]; }
  }
  return x;
}

// transforms an hash of classes to a string
function cx(classNames) {
  return Object.keys(classNames).filter(function(className) {
    return classNames[className];
  }).join(' ');
}

function concatChildren(children, x) {
  if (x == null) { return children; }
  if (children == null) { return x; };
  return [].concat(children, x);
}

function childrenToArray(children) {
  if (children == null) { return []; };
  return [].concat(children);
}

var commands = {
  '$tag': function (vnode, tag) {
    vnode.tag = tag;
  },
  '$attrs': function (vnode, attrs) {
    vnode.attrs = attrs;
  },
  '$mergeAttrs': function (vnode, attrs) {
    vnode.attrs = mixin(vnode.attrs || {}, attrs);
  },
  '$children': function (vnode, children) {
    vnode.children = children;
  },
  '$concatChildren': function (vnode, children) {
    vnode.children = concatChildren(vnode.children, children);
  },
  '$unshiftChildren': function (vnode, children) {
    vnode.children = concatChildren(children, vnode.children);
  },
  '$spliceChildren': function (vnode, splices) {
    
  }
};

module.exports = {
  mixin: mixin,
  cx: cx
};