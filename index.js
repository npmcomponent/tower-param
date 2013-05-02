
/**
 * Module dependencies.
 */

var Emitter = require('tower-emitter')
  , validator = require('tower-validator').ns('param');

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

exports.validator = validator;

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
 * Instantiate a new `Param`.
 */

function Param(name, type, options){
  if (!type) {
    options = { type: 'string' };
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
  var assert = operator(key);

  (this.validators || (this.validators = []))
    .push(function validate(query, constraint){ // XXX: fn callback later
      if (!assert(constraint.right.value, val))
        query.errors.push('Invalid Constraint something...');
    });
}

/**
 * Append operator to stack.
 */

Param.prototype.operator = function(name){
  if (!this.operators) {  
    this.operators = [];

    var assert = operator('in')
      , self = this;

    (this.validators || (this.validators = []))
      .push(function validate(query, constraint){
        if (!assert(constraint.operator, self.operators)) {
          query.errors.push('Invalid operator ' + constraint.operator);
        }
      });
  }

  this.operators.push(name);
}

Param.prototype.validate = function(query, constraint, fn){
  if (!this.validators) return;

  for (var i = 0, n = this.validators.length; i < n; i++) {
    this.validators[i](query, constraint);
  }
}

Param.prototype.alias = function(key){
  (this.aliases || (this.aliases = [])).push(key);
}

// XXX: this might be too specific, trying it out for now.
Param.prototype.format = function(type, name){
  this.serializer = { type: type, name: name };
}