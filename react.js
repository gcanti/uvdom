'use strict';

var React = require('react');
var cx = require('react/lib/cx');

//
// helpers
//

// transforms an event name to a React event name
// click -> onClick
// blur -> onBlur
function camelizeEvent(name) {
  return 'on' + name.substring(0, 1).toUpperCase() + name.substring(1);
}

function mixin(x, y) {
  if (!y) { return x; }
  for (var k in y) {
    if (y.hasOwnProperty(k)) {
      x[k] = y[k];
    }
  }
  return x;
}

// compile: x -> ReactElement
function compile(x) {
  if (Array.isArray(x)) {
    return x.length === 1 ? compile(x[0]) : x.map(compile);
  }
  if (typeof x === 'object') {
    // attrs
    var attrs = mixin({}, x.attrs);
    if (attrs.className) { attrs.className = cx(attrs.className); }
    if (x.key) { attrs.key = x.key; }
    if (x.ref) { attrs.ref = x.ref; }
    // events
    if (x.events) {
      for (var name in x.events) {
        attrs[camelizeEvent(name)] = x.events[name];
      }
    }
    // children
    var children = compile(x.children);
    // build ReactElement
    return React.createElement.apply(null, [x.tag, attrs].concat(children))
  }
  return x;
}

module.exports = {
  compile: compile
};