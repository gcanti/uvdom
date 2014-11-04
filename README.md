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
  events: Nil | {
    click: function () {}
    ...
  },
  children: Nil | string | UVDOM
}
```

**Note**. `tag` is a string since the browser actually allows any name, and Web Components will use this fact for people to write custom names. `className` is a dictionary `string -> boolean` since it's easy to patch and to manage (like React `cx(className)`).

# Issues with the DOM

DOM is statefull:

- Input focus and selection
- Scroll position
- iframe

Solution: Reuse Nodes

# General issues

- server side rendering
- attach events in the client when rendering is server side
- render + event attach in the client
- state transaction and event detach
