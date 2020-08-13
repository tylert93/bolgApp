let middlewareObj = {};
const Blog = require("../models/blog");

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash("error", `<div class='header'>Login required</div><p>You must be logged in to do that</p>`)
        res.redirect("/login");
    }
}

middlewareObj.checkBlogOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err || !foundBlog){
                req.flash("error", `<div class='header'>Blog not found</div><p>Please use a blog with a valid ID</p>`);
                res.redirect("error");
            } else {
                if(foundBlog.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "<div class='header'>Denial of permission</div><p>You can only tamper with blogs you have created</p>");
                    res.redirect("/blogs/" + req.params.id);
                }  
            }
        });
    } else {
        req.flash("error", "<div class='header'>Login required</div><p>You must be logged in to do that</p>")
        res.redirect("/login");
    }  
}

module.exports = middlewareObj;