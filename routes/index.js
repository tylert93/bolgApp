import express from 'express';
import passport from 'passport';
import {User} from '../models/user'; 

const indexRoutes = express.Router();      

// LANDING
indexRoutes.get("/", (req, res) => {
    res.redirect("/blogs");
});

// REGISTER
indexRoutes.get("/register", (req, res) => {
    res.render("register");
})

indexRoutes.post("/register", (req, res) => {
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
indexRoutes.get("/login", (req, res) => {
    res.render("login");
});

indexRoutes.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/login_success",
        failureRedirect:"/login",
        failureFlash:true
    }), (req, res) => {
});

indexRoutes.get("/login_success", (req, res) => {
    req.flash("success", "<div class='header'>Successfully logged in</div><p>Welcome back "  + req.user.username + "</p>");
    res.redirect("/blogs");
});

// LOGOUT
indexRoutes.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "<div class='header'>Successfully logged out</div>"),
    res.redirect("/blogs")
});

// ERROR
indexRoutes.get("*", (req, res) => {
    res.render("error");
});

export default indexRoutes;