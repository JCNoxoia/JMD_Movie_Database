const passport = reqauire('passport'),
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
            await users.findOne({Username: username})
            .then((user) => {
                if (!user) {
                    console.log('incorrect username');
                    return callback(null, false, {
                        message: 'Incorrect username or password.'
                    });
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

