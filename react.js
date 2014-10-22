'use strict';

var React = require('react');

//
// helpers
//

function mixin(x, y) {
  if (!y) { return x; }
  for (var k in y) {
    if (y.hasOwnProperty(k)) { x[k] = y[k]; }
  }
  return x;
}

function clone(x) {
  if (!x) { return {}; }
  return mixin({}, x);
}

// transforms an hash of classes to a string
function cx(classNames) {
  return Object.keys(classNames).filter(function(className) {
    return classNames[className];
  }).join(' ');
}

// transforms a generic event name to a React event name
// click -> onClick
// blur -> onBlur
function toReactEventName(name) {
  return 'on' + name.substring(0, 1).toUpperCase() + name.substring(1);
}

// side effect: mixin the events hash with the attrs hash
function mixinEvents(events, attrs) {
  if (!events) { return; }
  for (var name in events) {
    if (events.hasOwnProperty(name)) {
      attrs[toReactEventName(name)] = events[name];
    }
  }
}

//
// toReactElement
//

// toElement: VDOM -> ReactElement
function toElement(vdom) {
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
    mixinEvents(vdom.events, attrs);
    var children = toElement(vdom.children);
    return tag.apply(null, [attrs].concat(children));
  }
  return vdom;
}

// toClass: VDOM -> ReactClass
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