const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync"); //wrapAsync error handling
const User = require("../models/user"); 
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controller/user");

router.route("/signup")
    .get(userController.renderSignupPage)
    .post(wrapAsync(userController.signup))

router.route("/login")
    .get(userController.renderLoginPage)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { 
            failureRedirect : "/login", 
            failureFlash: true 
        }), 
        userController.login
    )

router.get("/logout", userController.logout);

module.exports = router;