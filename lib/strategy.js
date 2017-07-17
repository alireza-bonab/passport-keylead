/**
 * Module dependencies.
 */
var uri = require('url'),
    util = require('util'),
    OAuth2Strategy = require('passport-oauth2'),
    InternalOAuthError = require('passport-oauth2').InternalOAuthError,
    KeyleadAuthorizationError = require('./errors/keyleadauthorizationerror'),
    KeyleadTokenError = require('./errors/keyleadtokenerror');


/**
 * `Strategy` constructor.
 *
 * The Keylead authentication strategy authenticates requests by delegating to
 * Keylead using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Keylead application's App ID
 *   - `clientSecret`  your Keylead application's App Secret
 *   - `callbackURL`   URL to which Keylead will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new KeyleadStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/keylead/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://api.finnotech.ir/dev/v1/oauth2/authorize';
    options.tokenURL = options.tokenURL || 'https://api.finnotech.ir/dev/v1/oauth2/token';
    options.scope = options.scope || 'kilid:statement:get';
    options.scopeSeparator = options.scopeSeparator || ',';
    options.callbackURL = options.callbackURL || '';

    var authString = new Buffer(options.clientID+':'+options.clientSecret);
    options.customHeaders = {
        "Authorization": "Basic " + authString.toString('base64')
    };
    function customVerify (accessToken, refreshToken, params, profile, done) {
        console.log(1);
        var depositNumbers = [];
        for (var i = 0 ; i <accessToken.deposits.length ; i++ ) {
            var deposit = accessToken.deposits[i];
            for (var j = 0; j < deposit.resources.length; j++)
                depositNumbers.push(deposit.resources[j]);
        }
        profile.scope = accessToken.scopes.toString();
        profile.scopes = accessToken.scopes;
        profile.depositNumbers  = depositNumbers;
        profile.refreshToken  = accessToken.refreshToken;
        profile.customerId  = accessToken.userId;
        profile.accessToken  = accessToken.value;
        profile.expierTime = accessToken.lifeTime;
        profile.provider = 'keylead';
        profile.bankId = 'AYANDEH';
        verify(accessToken.value, profile, done);
    };

    OAuth2Strategy.call(this, options, customVerify);
    this.name = 'keylead';
    this._clientSecret = options.clientSecret;

}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Authenticate request by delegating to Keylead using OAuth 2.0.
 *
 * @param {Object} req
 * @param {Object} options
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
    // Keylead doesn't conform to the OAuth 2.0 specification, with respect to
    // redirecting with error codes.
    //
    //   FIX: https://github.com/jaredhanson/passport-oauth/issues/16
    console.log(2);
    if (req.query && req.query.error_code && !req.query.error) {
        return this.error(new KeyleadAuthorizationError(req.query.error_message, parseInt(req.query.error_code, 10)));
    }

    OAuth2Strategy.prototype.authenticate.call(this, req, options);
};


/**
 * Parse error response from Keylead OAuth 2.0 token endpoint.
 *
 * @param {String} body
 * @param {Number} status
 * @return {Error}
 * @api protected
 */
Strategy.prototype.parseErrorResponse = function(body, status) {
    console.log(3);
    var json = JSON.parse(body);
    if (json.error && typeof json.error == 'object') {
        return new KeyleadTokenError(json.error.message, json.error.type, json.error.code, json.error.error_subcode);
    }

    return OAuth2Strategy.prototype.parseErrorResponse.call(this, body, status);
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
