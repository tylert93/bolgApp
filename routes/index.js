var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"); 

// LANDING
router.get("/", function(req, res){
    res.redirect("/blogs");
});

// REGISTER
router.get("/register", function(req, res){
    res.render("register");
})

router.post("/register", function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", "<div class='header'>Registration failed</div><p>" + err.message + "</p>");
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("error", "<div class='header'>Registration successful</div><p>" + req.user.username + "</p>")
            res.redirect("/blogs");
        });
    });
});

// LOGIN
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/login_success",
        failureRedirect:"/login",
        failureFlash:true
    }), function(req, res){
});

router.get("/login_success", function(req, res){
    req.flash("success", "<div class='header'>Successfully logged in</div><p>Welcome back "  + req.user.username + "</p>");
    res.redirect("/blogs");
});

// LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "<div class='header'>Successfully logged out</div>"),
    res.redirect("/blogs")
});

// ERROR
router.get("*", function(req, res){
    res.render("error");
});

module.exports = router;