const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Setup options for Jwt Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create Jwt Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    
    User.findById(payload.sub, function(err, user){
        if(err) return done(err, false);

        if(user){
            done(null, user);
        }else{
            done(null, false);
        }

    })
});

// Tell passport to use this strategy
passport.use(jwtLogin);