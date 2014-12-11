This library defines a universal representation for a virtual DOM which can be later compiled into several targets like React.js v0.12.1.

# UVDOM Formal Type Definition

```js
type UVDOM = Node | Array<Node> // a tree or a forest

type Node = HostNode | UNode

type UNode = {
  tag: string
  attrs: Nil | {
    style:      Nil | object<string, any>,
    className:  Nil | object<string, boolean>,
    xmlns:      Nil | string, // namespaces
    ...
  },
  events: Nil | {
    click: function
    ...
  },
  children: Nil | string | UVDOM,
  ref: Nil | string | number,
  key: Nil | string | number
}

type Nil = null | undefined
```

**Note**. `tag` is a string since the browser actually allows any name, and Web Components will use this fact for people to write custom names.

**Note**. `className` is a dictionary `string -> boolean` since it's easy to patch and manage (kind of React's `cx(className)`).

**Note**. In `attrs.style` the css rules are expressed with the JavaScript syntax: e.g. `{textAlign: 'center'}`.

# Example: compiling to React.js

```js
var compile = require('uvdom/react').compile;

var uvdom = {
  tag: 'button',
  attrs: {
    className: {
      'btn': true,
      'btn-primary': true
    }
  },
  events: {
    click: function () {
      console.log('click');
    }
  },
  children: 'Click me'
};

var element = compile(uvdom);
var node = document.getElementById('app');
console.log(React.render(element, node));
```
