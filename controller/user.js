const User = require("../models/user");

module.exports.renderSignupPage = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email,username});
        const registereduser = await User.register(newUser,password);
        console.log(registereduser);
        req.login(registereduser,(err) => {
           if(err){
            return next(err);
           } 
           req.flash("success", "Welcome to Vagabond Vista!");
           res.redirect("/listings");
        })
    } catch(err) {
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginPage = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to Vagabond Vista!  You are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings"; //checks 
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","you are logged out now!");
        res.redirect("/listings");
    });
};