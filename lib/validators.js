
/**
 * Module dependencies.
 */

// commented out by npm-component: var validator = require('tower-validator');

/**
 * Expose `validators`.
 */

module.exports = validators;

/**
 * Define default validators.
 */

function validators(param) {
  // XXX: todo
  param.validator('present', function(self, obj){
    return null != obj;
  });

	function define(key) {
    param.validator(key, function(self, obj, val){
      return validator(key)(obj, val);
    });
  }

  define('eq');
  define('neq');
  define('in');
  define('nin');
  define('contains');
  define('gte');
  define('gt');
  define('lt');
  define('lte');
  define('match');
}