/**
 * `KeyleadTokenError` error.
 *
 * KeyleadTokenError represents an error received from a Keylead's token
 * endpoint.  Note that these responses don't conform to the OAuth 2.0
 * specification.
 *
 * References:
 *   - http://obg.in-bank.ir/apibank/public/reference_manual
 *
 * @constructor
 * @param {String} [message]
 * @param {String} [type]
 * @param {Number} [code]
 * @param {Number} [subcode]
 * @api public
 */
function KeyleadTokenError(message, type, code, subcode) {
	Error.call(this);
	Error.captureStackTrace(this, arguments.callee);
	this.name = 'KeyleadTokenError';
	this.message = message;
	this.type = type;
	this.code = code;
	this.subcode = subcode;
	this.status = 500;
}

/**
 * Inherit from `Error`.
 */
KeyleadTokenError.prototype.__proto__ = Error.prototype;


/**
 * Expose `KeyleadTokenError`.
 */
module.exports = KeyleadTokenError;
