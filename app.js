import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import expressSanitizer from 'express-sanitizer';
import passport from 'passport';
import localStrategy from 'passport-local';
import expressSession from 'express-session';
import dotenv from 'dotenv';
import flash from 'connect-flash';
import blogsRoutes from './routes/blogs';
import indexRoutes from './routes/index';
import {Blog} from './models/blog';
import {User} from './models/user';

const app = express();

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