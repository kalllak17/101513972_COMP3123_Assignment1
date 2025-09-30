var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.controller');
var bcrypt = require("bcrypt");
var passport = require('passport');

router.post('/user/signup', async function (req, res, next) {
    const {username, email, password} = req.body;

    const passwordHashed = await bcrypt.hashSync(password, 10);

    const newUser = await userController.createUser(username, email, passwordHashed);

    if (newUser?.status === false) {
        return res.status(409).json(newUser) //409 = Conflict
    }

    return res
        .status(201) // 201 = Created
        .json({
            "message": "User created successfully.",
            "user_id": `${newUser._id}`
        })

});


router.post('/user/login', async function (req, res, next) {
    const {username, email, password} = req.body;

    const user = await userController.login(username, email, password);

    if (!user) return res
        .status(401)
        .json({message: "Invalid credentials"});

    return res
        .status(200)
        .json({
            "message": "Login successful.",
            "user_id": `${user._id}`
        });


});


module.exports = router;
