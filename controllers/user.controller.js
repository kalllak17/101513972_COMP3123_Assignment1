const User = require('../models/users.model');
var bcrypt = require("bcrypt");


exports.isUserExist = async (username, email) => {
    return await checkUserExists(username, email);
}

exports.createUser = async (username, email, passwordHashed) => {


    const existing = await checkUserExists(username, email);

    if (!existing) {
        let created_at = new Date(Date.now());
        let updated_at = null;
        let newUser = await User.create({
            "username": username,
            "email": email,
            "password": passwordHashed, // This should be hashed
            "created_at": created_at,
            "updated_at": updated_at
        })

        return newUser;
    } else {
        return {'status': false, 'message': 'User already exists'};
    }

}

exports.login = async (username, email, password) => {

    let user = await checkUserExists(username, email);

    if (!user) {
        return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;

}

async function checkUserExists(username, email) {
    let user = await User.findOne(
        {
            $or: [
                {username: username},
                {email: email}
            ]
        }
    )

    return user;
}