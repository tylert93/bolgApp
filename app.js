var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    expressSession = require("express-session"),
    blogsRoutes = require("./routes/blogs"),
    indexRoutes = require("./routes/index"),
    flash = require("connect-flash"),
    Blog = require("./models/blog"),
    User = require("./models/user");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer()),
app.use(flash());

mongoose.connect("mongodb://localhost/blog_app_2", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify:false 
});

// PASSPORT CONFIGURATION
app.use(expressSession({
    secret:"purple",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    console.log(req.user);
    next();
});

app.use(blogsRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running ...");
});