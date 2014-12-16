"use strict";

var React = require('react');
var test = require('tape');
var compile = require('../react').compile;

function html(x) {
  return React.renderToStaticMarkup(compile(x));
}

test('compile uvdom', function (tape) {
  tape.plan(15);
  // tag
  tape.deepEqual(html({tag: 'div'}), '<div></div>');
  // attrs
  tape.deepEqual(html({tag: 'div', attrs: null}), '<div></div>');
  tape.deepEqual(html({tag: 'div', attrs: {}}), '<div></div>');
  tape.deepEqual(html({tag: 'div', attrs: {id: 'myid'}}), '<div id="myid"></div>');
  // style
  tape.deepEqual(html({tag: 'div', attrs: {style: {textAlign: 'center'}}}), '<div style="text-align:center;"></div>');
  // class
  tape.deepEqual(html({tag: 'div', attrs: {className: {'myclass': true}}}), '<div class="myclass"></div>');
  tape.deepEqual(html({tag: 'div', attrs: {className: {'myclass1': true, 'myclass2': true}}}), '<div class="myclass1 myclass2"></div>');
  tape.deepEqual(html({tag: 'div', attrs: {className: {'myclass': false}}}), '<div></div>');
  // children
  tape.deepEqual(html({tag: 'div', children: 'a'}), '<div>a</div>');
  tape.deepEqual(html({tag: 'div', children: ['a']}), '<div>a</div>');
  tape.deepEqual(html({tag: 'div', children: ['a', 'b']}), '<div>ab</div>');
  tape.deepEqual(html({tag: 'div', children: ['a', ' ', 'b']}), '<div>a b</div>');
  tape.deepEqual(html({tag: 'div', children: ['a', ['b', 'c']]}), '<div>abc</div>');
  tape.deepEqual(html({tag: 'div', children: [
    {tag: 'div', children: 'a'},
    {tag: 'div', children: 'b'}
  ]}), '<div><div>a</div><div>b</div></div>');
  tape.deepEqual(html({tag: 'div', children: [[
    {tag: 'div', children: 'a', key: 0},
    {tag: 'div', children: 'b', key: 1}
  ]]}), '<div><div>a</div><div>b</div></div>');
});

if (typeof window !== 'undefined') {

  test('events', function (tape) {
    tape.plan(1);
    var node = document.createElement('div');
    document.body.appendChild(node);
    var el = compile({
      tag: 'div',
      children: [
        {
          tag: 'span',
          attrs: {id: 'counter'}
        },
        {
          tag: 'button',
          attrs: {id: 'mybutton'},
          events: {
            click: function () {
              document.getElementById('counter').innerText = '1';
            }
          },
          children: 'Click me'
        }
      ]
    });
    React.render(el, node);
    document.getElementById('mybutton').click();
    tape.deepEqual(document.getElementById('counter').innerText, '1');
  });

}