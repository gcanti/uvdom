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
  if (!y) { return x; }
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

// toElement: VDOM -> ReactElement
function toElement(vdom, isReferenceable) {
  if (Array.isArray(vdom)) {
    if (vdom.length === 1) {
      return toElement(vdom[0]);
    }
    return vdom.map(toElement);
  } else if (typeof vdom === 'object') {
    var tag = vdom.tag;
    if (typeof tag === 'string') {
      tag = React.DOM[tag];
    }
    var attrs = clone(vdom.attrs);
    if (attrs.className) {
      attrs.className = cx(attrs.className);
    }
    if (vdom.key) {
      attrs.key = vdom.key;
    }
    if (vdom.ref) {
      attrs.ref = vdom.ref;
    }
    addEvents(attrs, vdom.events);
    var children = toElement(vdom.children);
    return isReferenceable ? function (ref) {
      return tag(mixin(attrs, ref), children);
    } : tag(attrs, children);
  }
  return vdom;
}

function toClass(vdom, config) {
  var Element = toElement(vdom);
  config = mixin({
    render: function () {
      return Element;
    }
  }, config);
  return React.createClass(config);
}

module.exports = {
  toElement: toElement,
  toClass: toClass
};