Work in progress...

# Formal Type Definitions

    type Nil = null | undefined

    type Child = string | Node

    type Node = {
      tag:        enum 'div', 'strong', 'em', etc..,
      attrs:      Nil | object,
      className:  Nil | string | Array<string> | Dictionary<boolean>,
      events:     Nil | Dictionary<function>,
      key:        Nil | string | number,
      children:   Nil | Child | Array<Child>
    }

