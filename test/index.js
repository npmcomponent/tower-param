
if ('undefined' === typeof window) {
  var param = require('..');
  var assert = require('assert');
} else {
  var param = require('tower-param');
  var assert = require('timoxley-assert');
}

var Param = param.Param;

describe('Param', function(){
  it('should define', function(){
    var param = new Param('title', 'string');
    
    assert('title' === param.name);
    assert('string' === param.type);
  });

  it('should lazily instantiate validators', function(){
    var param = new Param('title', 'string');
    assert(undefined === param.validators);

    param.validator('lte', 200);
    assert(1 === param.validators.length);
  });

  it('should lazily instantiate aliases', function(){
    var param = new Param('title', 'string');    
    assert(undefined === param.aliases);

    param.alias('t');
    assert(1 === param.aliases.length);
    assert('t' === param.aliases[0]);
  });

  it('should default to `string` type', function(){
    var param = new Param('title');

    assert('string' === param.type);
  });

  it('should handle param overloading', function(){
    function one(param) {
      assert('title' === param.name);
      assert('string' === param.type);
      assert(undefined === param.validators);
    }

    one(new Param('title'));
    one(new Param('title', 'string'));
    one(new Param('title', { type: 'string' }));

    function two(param) {
      assert('title' === param.name);
      assert('string' === param.type);
      assert(0 === param.validators.length);
    }

    two(new Param('title', 'string', { validators: [] }));
    two(new Param('title', { type: 'string', validators: [] }));
    two(new Param('title', { validators: [] }));
    // XXX: doesn't handle this, waiting to see if it should.
    // two(new Param({ name: 'title', validators: [] }));
  });

  it('should validate', function(){
    var param = new Param('status', 'string');
    param.validator('in', [ 'pending', 'ready' ]);

    var query = { errors: [] };
    // XXX: this is why separating out into small modules is useful.
    // it makes mocking much easier, as I can use just this `constraint`
    // object, which gets passed as an argument.
    var constraint = { right: { value: 'a' } };
    param.validate(query, constraint);
    assert(1 === query.errors.length);

    var query = { errors: [] };
    var constraint = { right: { value: 'pending' } };
    param.validate(query, constraint);
    assert(0 === query.errors.length);
  });

  it('should typecast', function(){
    var param = new Param('tags', 'array');
    assert.deepEqual([ 'x' ], param.typecast('x'));
    assert.deepEqual([ 'x', 'y' ], param.typecast([ 'x', 'y' ]));
    assert.deepEqual([ 'x', 'y' ], param.typecast('x,y'));
  });
});