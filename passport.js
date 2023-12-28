const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    models = require('./models.js'),
    passportJWT = require('passport-jwt');

    let users = models.user,
        JWTStrategy = passportJWT.Strategy,
        extractJWT = passportJWT.ExtractJwt;

passport.use(
    new localStrategy(
        {
            usernameField: 'Username',
            passwordField: 'Password'
        },
        async (username, password, callback) => {
            console.log(`${username} ${password}`);
            await users.findOne({username: username})
            .then((user) => {
                if (!user) {
                    console.log('incorrect username');
                    return callback(null, false, {
                        message: 'Incorrect username or password.'
                    });
                }
                if (!user.validatePassword(password)) {
                    console.log('incorrect password');
                    return callback(null, false, {message: 'Incorrect password.'});
                }
                console.log('finished');
                return callback(null, user);
            })
            .catch((err) => {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
            })
        }
    )
);

passport.use(new JWTStrategy({
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'y77$p77$'
}, async (jwtPayload, callback) => {
    return await users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((err) => {
        return callback(err)
    });
}));