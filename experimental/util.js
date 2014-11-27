'use strict';

function mixin(x, y) {
  if (!y) { return x; }
  for (var k in y) {
    if (y.hasOwnProperty(k)) { x[k] = y[k]; }
  }
  return x;
}

// transforms a hash of classes to a string
function cx(classNames) {
  return Object.keys(classNames).filter(function(className) {
    return classNames[className];
  }).join(' ');
}

// memoize a function f: X -> Y
function memoize(f) {
  var arg, ret;
  return function memoization(x) {
    if (x === arg) { return ret; }
    return ret = f(arg = x);
  };
}

module.exports = {
  mixin: mixin,
  cx: cx,
  memoize: memoize
};