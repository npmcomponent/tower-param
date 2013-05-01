
/**
 * Module dependencies.
 */

var operator = require('tower-operator');

/**
 * Expose `mixin`.
 */

exports = module.exports = mixin;

/**
 * Mixin `validate`.
 */

function mixin(statics) {
  statics.validate = exports.validate;
}

exports.validate = function(key, val){
  var ok = operator(key);
  var operators = ['eq'];
  // tower/constraint-validator
  var context = this.context || this;
  (context.validators || (context.validators = []))
    .push(function(ctx, constraint, fn){
      // contains(constraint.operator, operators)
      if (!ok(constraint.right.value, val)) {
        ctx.errors.push('Invalid ' + constraint.left.path);
      }
    });
  return this;
}