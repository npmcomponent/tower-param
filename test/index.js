var validator = 'undefined' == typeof window
  ? require('..')
  : require('tower-param-validator'); // how to do this better?

var assert = require('assert');

describe('param validator', function(){
  it('should test', function(){
    assert.equal(1 + 1, 2);
  });
});