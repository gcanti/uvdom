# Formal Type Definitions

    type Nil = null | undefined

    type Node = string | Tag | Component

    type Child = Nil | Node

    type Children = Child | Array<Child>

    type TagName = enum 'div', 'strong', 'em', etc..

    type EventName = enum 'click', 'change', etc...

    type Events = Dictionary<EventName, function>

    type Tag = {
      tag:      TagName,
      attrs:    Nil | object,
      children: Children,
      events:   Nil | Events,
      key:      Nil | string | number,
      ref:      Nil | string | number
    }

    type attrs.style = Nil | object

    type attrs.className = Nil | Dictionary<string, boolean>

    type Component = {
      ctor:     function,
      config:   object,
      children: Children,
      events:   Nil | Events,
      key:      Nil | string | number,
      ref:      Nil | string | number,
      state:    Nil | object,
      methods:  Dictionary<string, function>
    }

    ctor: (config, children, events, key, ref, state) -> VDOM

    type VDOM = Node | Array<Node>

