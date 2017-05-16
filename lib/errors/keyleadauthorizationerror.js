/**
 * `KeyleadAuthorizationError` error.
 *
 * KeyleadAuthorizationError represents an error in response to an
 * authorization request on Keylead.  Note that these responses don't conform
 * to the OAuth 2.0 specification.
 *
 * References:
 *   - None
 *
 * @constructor
 * @param {String} [message]
 * @param {Number} [code]
 * @api public
 */
function KeyleadAuthorizationError(message, code) {
	Error.call(this);
	Error.captureStackTrace(this, arguments.callee);
	this.name = 'KeyleadAuthorizationError';
	this.message = message;
	this.code = code;
	this.status = 500;
}

/**
 * Inherit from `Error`.
 */
KeyleadAuthorizationError.prototype.__proto__ = Error.prototype;


/**
 * Expose `KeyleadAuthorizationError`.
 */
module.exports = KeyleadAuthorizationError;
