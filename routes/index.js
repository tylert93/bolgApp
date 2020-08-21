const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user"); 

// LANDING
router.get("/", (req, res) => {
    res.redirect("/blogs");
});

// REGISTER
router.get("/register", (req, res) => {
    res.render("register");
})

router.post("/register", (req, res) => {
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash("error", "<div class='header'>Registration failed</div><p>" + err.message + "</p>");
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "<div class='header'>Registration successful</div><p>" + req.user.username + "</p>")
            res.redirect("/blogs");
        });
    });
});

// LOGIN
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/login_success",
        failureRedirect:"/login",
        failureFlash:true
    }), (req, res) => {
});

router.get("/login_success", (req, res) => {
    req.flash("success", "<div class='header'>Successfully logged in</div><p>Welcome back "  + req.user.username + "</p>");
    res.redirect("/blogs");
});

// LOGOUT
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "<div class='header'>Successfully logged out</div>"),
    res.redirect("/blogs")
});

// ERROR
router.get("*", (req, res) => {
    res.render("error");
});

module.exports = router;