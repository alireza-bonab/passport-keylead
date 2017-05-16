# passport-keylead

[Passport](http://passportjs.org/) strategy for authenticating with [Keylead](http://pfm.abplus.ir/)
using the OAuth 2.0 API.

This module lets you authenticate using Keylead in your Node.js applications.
By plugging into Passport, Keylead authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-keylead

## Usage

#### Configure Strategy

The Keylead authentication strategy authenticates users using a ABPlus
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying an app ID, app secret, callback URL.

    passport.use(new KeyleadStrategy({
        clientID: KEYLEAD_APP_ID,
        clientSecret: KEYLEAD_APP_SECRET,
        scope: "adanalas:user:get",
        callbackURL: "http://localhost:3000/auth/keylead/callback"
      },
      function(accessToken, profile, done) {
        User.findOrCreate({ keyleadId: profile.nationalId }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'keylead'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/keylead',
      passport.authenticate('keylead'));

    app.get('/auth/keylead/callback',
      passport.authenticate('keylead', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/sunnystatue/passport-keylead/tree/master/examples/login).

## Tests

    $ npm install
    $ npm test

## Credits

  - [Alireza Alidoust](https://github.com/sunnystatue)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Alireza Alidoust
