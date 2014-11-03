# Formal Type Definitions

```js
type UVDOM = Node | Array<Node> // a tree or a forest

type Nil = null | undefined

type Node = {
  tag: string
  attrs: Nil | {
    style:      Nil | object<string, any>,
    className:  Nil | object<string, boolean>,
    xmlns:      Nil | string, // namespaces
    ...
  },
  children: Nil | string | UVDOM
}
```

**Note**. `tag` is a string since the browser actually allows any name, and Web Components will use this fact for people to write custom names. `className` is a dictionary `string -> boolean` since it's easy to patch and to manage (like React `cx(className)`).

# Views

Let `JSON` be the set of all the JSON data structures and `VDOM` a virtual DOM implementation, then we call a *view* a [pure](http://en.wikipedia.org/wiki/Pure_function) function such that `view: JSON -> VDOM`, that is a function accepting a JSON state and returning a virtual DOM.

**Definition**. A `VDOM`-*view system* is a pair `(VDOM, View)` where `VDOM` is a virtual DOM implementation
and `View` is the set of all the related views. Let's call *universal view system* the `UVDOM`-view system.

```js
// a simple view, outputs a bolded link
function anchorView(state) {
  return {
    tag: 'a',
    attrs: {href: state.url},
    children: {
      tag: 'b',
      children: state.text
    }
  };
}
```
