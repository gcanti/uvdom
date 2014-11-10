"use strict";

var assert = require('assert');
var html = require('../html');

//
// setup
//

var ok = function (x) { assert.strictEqual(true, x); };
var eq = assert.deepEqual;

describe('html', function () {

  describe('addHookId', function () {

    var addHookId = html.addHookId;

    it('should add an id to a node', function () {
      var uvdom = {tag: 'div'};
      uvdom = addHookId(uvdom);
      eq(uvdom, {tag: 'div', attrs: {'data-id': '.0'}});
    });

    it('should add an id to a forest', function () {
      var uvdom = [{tag: 'div'}, {tag: 'a'}];
      uvdom = addHookId(uvdom);
      eq(uvdom, [
        {tag: 'div', attrs: {'data-id': '.0'}},
        {tag: 'a', attrs: {'data-id': '.1'}}
      ]);
    });

    it('should add an id to a nested node', function () {
      var uvdom = {tag: 'div', children: {tag: 'a'}};
      uvdom = addHookId(uvdom);
      eq(uvdom, {
        tag: 'div', 
        attrs: {'data-id': '.0'}, 
        children: {tag: 'a', attrs: {'data-id': '.0.0'}}
      });
    });

    it('should add an id to a nested forest', function () {
      var uvdom = {tag: 'div', children: [{tag: 'a'}, {tag: 'b'}]};
      uvdom = addHookId(uvdom);
      eq(uvdom, {
        tag: 'div', 
        attrs: {'data-id': '.0'}, 
        children: [
          {tag: 'a', attrs: {'data-id': '.0.0'}},
          {tag: 'b', attrs: {'data-id': '.0.1'}}
        ]
      });
    });
  });

});

