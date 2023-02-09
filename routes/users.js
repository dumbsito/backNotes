const express = require("express");
const router = express.Router();
const passport = require ("passport");
const jwt = require ("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/database");

router.post("/register", (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
    });

    User.addUser(newUser, (err, data)=> {
        if(err){
            res.json({success: false, msg: err.message});
        }
        else {
            res.json({success: true, msg: "User registered."});
        }
    });
});

router.post("/authenticate", (req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: "User not found."});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800,
                });
                res.json({
                    succes: true,
                    token: token,
                    user: {
                        id: user._id,
                        name: user.name,
                        surname: user.surname,
                        email: user.email
                    }
                });
            }
            else {
                return res.json({success: false, msg: "Wrong password."});
            }
        });
    });
});

router.get("/profile", passport.authenticate("jwt", {session: false}), (req, res, next)=>{
    res.json({
        user: req.user
    });
});

module.exports = router;