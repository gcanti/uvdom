# UVDOM Formal Type Definitions

    type Nil = null | undefined

    type Tag = enum 'div', 'strong', 'em', etc..

    type Child = string | Node

    type Event = enum 'click', 'change', etc...

    type Node = {
      tag:        Tag
      attrs:      Nil | object,
      children:   Nil | Child | Array<Child>,

      // extensions
      events:     Nil | Dictionary<Event, Nil | function>,
      key:        Nil | string | number,
      ref:        Nil | string | number
    }

    type attrs.style = Nil | object

    type attrs.className = Nil | Dictionary<string, boolean>

    type VDOM = Node | Array<Node>

