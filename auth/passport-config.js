const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { isUserExist } = require('../controllers/user.controller');

function initialize(passport) {
    passport.use(new LocalStrategy(async (username, email, password, done) => {
        const user = await isUserExist(username, email);

        if (!user) return done(null, false, { status: false, message: 'Invalid username/email or password.' });

        // console.log("function initialize - "+ user.password_hash, password);

        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? done(null, user) : done(null, false, { message: 'Incorrect password' });
    }));

}

module.exports = initialize;