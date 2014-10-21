'use strict';

var React = require('react');

//
// helpers
//

// transforms an hash of classes to a string
function cx(classNames) {
  return Object.keys(classNames).filter(function(className) {
    return classNames[className];
  }).join(' ');
}

function toEvent(e) {
  return 'on' + e.substring(0, 1).toUpperCase() + e.substring(1);
}

function addEvents(attrs, events) {
  if (!events) { return; }
  for (var name in events) {
    if (events.hasOwnProperty(name)) {
      attrs[toEvent(name)] = events[name];
    }
  }
}

function mixin(x, y) {
  for (var k in y) {
    if (y.hasOwnProperty(k)) { x[k] = y[k]; }
  }
  return x;
}

// useful to preserve the original hash
function clone(x) {
  if (!x) { return {}; }
  return mixin({}, x);
}

//
// toReactElement
//

// toReactElement: VDOM -> ReactElement
function toReactElement(vdom) {
  if (Array.isArray(vdom)) {
    if (vdom.length === 1) {
      return toReactElement(vdom[0]);
    }
    return vdom.map(toReactElement);
  } else if (typeof vdom === 'object') {
    var tag = vdom.tag;
    if (typeof tag === 'string') {
      tag = React.DOM[tag];
    }
    var attrs = clone(vdom.attrs);
    if (attrs.className) {
      attrs.className = cx(attrs.className);
    }
    if (vdom.ref) {
      attrs.ref = vdom.ref;
    }
    if (vdom.key) {
      attrs.key = vdom.key;
    }
    addEvents(attrs, vdom.events);
    var children = toReactElement(vdom.children);
    // use `apply` to avoid React warnings
    return React.createElement.apply(React, [tag, attrs].concat(children));
  }
  return vdom;
}

module.exports = toReactElement;