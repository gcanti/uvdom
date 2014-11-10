'use strict';

var util = require('./util');
var cx = util.cx;

//
// helpers
//

// attr: string x any -> string
function attr(name, value) {
  // handle selected="false"
  if (value === false || value == null) { return ''; }
  return ' ' + escapeHTML(name) + '="' + escapeHTML(value) + '"';
}

// style: object<string, any> -> string
function style(styles) {
  return Object.keys(styles).map(function (name) {
    return name + ': ' + style[name];
  }).join(';');
}

var ESCAPE_LOOKUP = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  "\"": "&quot;",
  "'": "&#x27;"
};

var ESCAPE_REGEX = /[&><"']/g;

function escaper(match) {
  return ESCAPE_LOOKUP[match];
}

function escapeHTML(text) {
  return text.replace(ESCAPE_REGEX, escaper);
}

//
// building blocks
//

var ATTR_NAME = 'data-id'; // in React the value id 'data-reactid'

// addHookId: UVDOM -> UVDOM
function addHookId(x, id) {
  if (Array.isArray(x)) {
    return x.map(function (y, i) {
      return addHookId(y, (id || '') + '.' + i);
    });
  }
  if (typeof x === 'object') {
    id = id || '.0';
    x.attrs = x.attrs || {};
    x.attrs[ATTR_NAME] = id;
    if (Array.isArray(x.children)) {
      x.children = addHookId(x.children, id);
    } else if (typeof x.children === 'object') {
      x.children = addHookId(x.children, id + '.0');
    }
  }
  return x;
}

// toHTML: UVDOM -> string
function toHTML(x) {
  if (Array.isArray(x)) {
    return x.map(toHTML).join('');
  }
  if (typeof x === 'object') {
    var html = '<' + x.tag;
    var name;
    // attrs
    if (x.attrs) {
      for (var name in x.attrs) {
        if (name === 'className') {
          html += attr('class', cx(x.attrs[name]));
        } else {
          html += attr(name, name === 'style' ? style(x.attrs[name]) : x.attrs[name]);
        }
      }
    }
    // children
    if (x.children != null) {
      html += '>';
      html += toHTML(x.children);
      html += '</' + x.tag + '>';
    } else {
      html += '/>';
    }
    return html;
  }
  return escapeHTML(x);
}

// toHooks: UVDOM -> Hooks
function toHooks(x, hooks) {
  hooks = hooks || {};
  if (Array.isArray(x)) {
    x.forEach(function (item) {
      toHooks(item, hooks);
    });
  }
  if (typeof x === 'object') {
    var id;
    if (x.events && x.attrs && (id = x.attrs[ATTR_NAME])) {
      for (var name in x.events) {
        if (x.events.hasOwnProperty(name)) {
          hooks[id] = {name: name, handler: x.events[name]};
        }        
      }
    }
    toHooks(x.children, hooks);
  }
  return hooks;
}

// attach: Hooks x Node -> IO DOM
function attach(hooks, node) {
  for (var id in hooks) {
    if (hooks.hasOwnProperty(id)) {
      var eventName = hooks[id].name;
      var eventHandler = hooks[id].handler;
      $(node).on(eventName, '[' + ATTR_NAME + '="' + id + '"]', eventHandler);
    }
  }
}

// detach: Node -> IO DOM
function detach(node) {
  var hooks = node.hooks;
  for (var id in hooks) {
    if (hooks.hasOwnProperty(id)) {
      var eventName = hooks[id].name;
      $(node).off(eventName);
    }
  }
  node.hooks = null;
}

//
// API
//

// server side rendering (React.renderToString)
function renderToString(uvdom) {
  uvdom = addHookId(uvdom);         // add hook identifiers
  return toHTML(uvdom);             // render HTML
}

// client side mounting (React.render)
function render(uvdom, node) {
  uvdom = addHookId(uvdom);         // add hook identifiers
  var hooks = toHooks(uvdom);       // retrieve hooks
  if (!node.innerHTML.trim()) {     // handle server side rendering
    node.innerHTML = toHTML(uvdom); // render HTML
  }
  attach(hooks, node);              // attach events to node
  node.hooks = hooks;               // store hooks for unmounting
}

// client side unmounting (React.unmountComponentAtNode)
function unmountAtNode(node) {
  detach(node);
  node.innerHTML = '';
}

module.exports = {
  renderToString: renderToString,
  render: render,
  unmountAtNode: unmountAtNode,
  addHookId: addHookId
};