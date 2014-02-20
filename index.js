
/**
 * Module dependencies.
 */

// commented out by npm-component: var Emitter = require('tower-emitter');
// commented out by npm-component: var validator = require('tower-validator');
// commented out by npm-component: var type = require('tower-type');
// commented out by npm-component: var isArray = require('part-is-array');
var validators = require('./lib/validators');

/**
 * Expose `param`.
 */

exports = module.exports = param;

/**
 * Expose `Param`.
 */

exports.Param = Param;

/**
 * Expose `collection`.
 */

exports.collection = [];

/**
 * Expose `validator`.
 */

exports.validator = validator.ns('param');

/**
 * Get a `Param`.
 */

function param(name, type, options) {
  if (exports.collection[name])
    return exports.collection[name];

  var instance = new Param(name, type, options);
  exports.collection[name] = instance;
  exports.collection.push(instance);
  exports.emit('define', name, instance);
  return instance;
}

/**
 * Mixin `Emitter`.
 */

Emitter(exports);

/**
 * Instantiate a new `Param`.
 */

function Param(name, type, options){
  if (!type) {
    options = { type: 'string' };
  } else if (isArray(type)) {
    options = { type: 'array' };
    options.itemType = type[0] || 'string';
  } else if ('object' === typeof type) {
    options = type;
  } else {
    options || (options = {});
    options.type = type;
  }

  this.name = name;
  this.type = options.type || 'string';

  if (options.validators) this.validators = [];
  if (options.alias) this.aliases = [ options.alias ];
  else if (options.aliases) this.aliases = options.aliases;

  // XXX: lazily create validators/operators?
  // this.validators = options.validators || [];
  // this.operators = options.operators || [];
}

/**
 * Add validator to stack.
 */

Param.prototype.validator = function(key, val){
  var assert = exports.validator(key);

  (this.validators || (this.validators = []))
    .push(function validate(self, query, constraint){ // XXX: fn callback later
      if (!assert(self, constraint.right.value, val))
        query.errors.push('Invalid Constraint something...');
    });
};

/**
 * Append operator to stack.
 */

Param.prototype.operator = function(name){
  if (!this.operators) {  
    this.operators = [];

    var assert = validator('in');

    (this.validators || (this.validators = []))
      .push(function validate(self, query, constraint){
        if (!assert(self, constraint.operator, self.operators)) {
          query.errors.push('Invalid operator ' + constraint.operator);
        } else {
          // XXX: typecast
        }
      });
  }

  this.operators.push(name);
};

Param.prototype.validate = function(query, constraint, fn){
  if (!this.validators) return true;

  for (var i = 0, n = this.validators.length; i < n; i++) {
    this.validators[i](this, query, constraint);
  }

  return !(query.errors && query.errors.length);
};

Param.prototype.alias = function(key){
  (this.aliases || (this.aliases = [])).push(key);
};

// XXX: this might be too specific, trying it out for now.
Param.prototype.format = function(type, name){
  this.serializer = { type: type, name: name };
};

/**
 * Convert a value into a proper form.
 *
 * Typecasting.
 *
 * @param {Mixed} val
 */
 
Param.prototype.typecast = function(val, fn){
  // XXX: handle for whether or not it's a constraint or simple equality.
  // XXX: handle async parsing too, in tower-type (for things like streams)
  var res = type(this.type).sanitize(val);
  if (fn) fn(null, res);
  return res;
};

/**
 * Expression for param.
 */

Param.prototype.expression = function(name){
  this._expression = name;
  return this;
};

validators(exports);