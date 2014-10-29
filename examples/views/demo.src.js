var React = require('react');
var m = require('mithril');
var createElement = require('vdom/create-element');
var VirtualNode = require('vtree/vnode');
var VirtualText = require('vtree/vtext');

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

function compose(f, g) {
  return function (x) {
    return f(g(x));
  };
}

//
// React
//

function toReact(uvdom) {
  if (Array.isArray(uvdom)) {
    if (uvdom.length === 1) {
      return toReact(uvdom[0]);
    }
    return uvdom.map(toReact);
  } else if (typeof uvdom === 'object') {
    var element = {
      type: uvdom.tag
    };
    var props = element.props = clone(uvdom.attrs);
    if (props.className) {
      props.className = cx(props.className);
    }
    props.children = toReact(uvdom.children);
    element._isReactElement = true; // hack
    return element;
  }
  return uvdom;
}

//
// Mithril
//

function toMithril(uvdom) {
  if (Array.isArray(uvdom)) {
    if (uvdom.length === 1) {
      return toMithril(uvdom[0]);
    }
    return uvdom.map(toMithril);
  } else if (typeof uvdom === 'object') {
    var element = {
      tag: uvdom.tag
    };
    var attrs = element.attrs = clone(uvdom.attrs);
    if (attrs.className) {
      attrs.className = cx(attrs.className);
    }
    element.children = toMithril(uvdom.children);
    return element;
  }
  return uvdom;
}

//
// Mercury
//

function toMercury(uvdom) {
  if (Array.isArray(uvdom)) {
    return uvdom.map(toMercury);
  } else if (typeof uvdom === 'object') {
    var attrs = clone(uvdom.attrs);
    if (attrs.className) {
      attrs.className = cx(attrs.className);
    }
    var children = typeof uvdom.children === 'string' ? new VirtualText(uvdom.children) : toMercury(uvdom.children);
    return new VirtualNode(uvdom.tag, attrs, [].concat(children));
  }
  return uvdom;
}

// button: object -> string -> VDOM (a view without styling, the output of my library)
function button(style) {
  return function (caption) {
    return {
      tag: 'button',
      attrs: {className: style},
      children: caption
    };
  };
}

// boostrap: string -> object (Bootstrap 3 style)
function bootstrap(type) {
  var style = {btn: true};
  style['btn-' + type] = true;
  return style;
}

// boostrap: string -> object (Pure css style)
function pure(type) {
  var style = {'pure-button': true};
  style['pure-button-' + type] = true;
  return style;
}

// bootstrapButton: string -> string -> VDOM
var bootstrapButton = compose(button, bootstrap);
// pureButton: string -> string -> VDOM
var pureButton = compose(button, pure);

var TYPE = 'primary';
var CAPTION = 'Primary button';
var bsButton = bootstrapButton(TYPE)(CAPTION);
var prButton = pureButton(TYPE)(CAPTION);

// React
React.render(toReact(bsButton), document.getElementById('bootstrap-react'));
React.render(toReact(prButton), document.getElementById('pure-react'));

// Mithril
m.render(document.getElementById('bootstrap-mithril'), toMithril(bsButton));
m.render(document.getElementById('pure-mithril'), toMithril(prButton));

// Mithril
document.getElementById('bootstrap-mercury').appendChild(createElement(toMercury(bsButton)));
document.getElementById('pure-mercury').appendChild(createElement(toMercury(prButton)));
