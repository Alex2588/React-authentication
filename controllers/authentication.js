const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function generateToken(user){
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

exports.signin = (req, res, next) => {
    res.send({token: generateToken(req.user)});
};

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return res.status(422).send({error: 'You must provide email and password'});
    }

    User.findOne({email}, (error, existingUser) => {

        if(error) return next(error);

        if(existingUser){
            return res.status(422).send({error: 'Email is in use'});
        }

        const user = new User({
            email,
            password
        });

        user.save(err => {
            if(err) return next(err);

            res.json({ token: generateToken(user) });
        });
    });
}