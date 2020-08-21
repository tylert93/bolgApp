const express = require("express"),
      app = express(),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override"),
      expressSanitizer = require("express-sanitizer"),
      passport = require("passport"),
      localStrategy = require("passport-local"),
      expressSession = require("express-session"),
      dotenv = require('dotenv'),
      flash = require("connect-flash"),
      blogsRoutes = require("./routes/blogs"),
      indexRoutes = require("./routes/index"),
      Blog = require("./models/blog"),
      User = require("./models/user");

dotenv.config();      
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer()),
app.use(flash());

mongoose.connect(process.env.DATABASE_URL, { 
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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(blogsRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("server is running ...");
});