var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Blog = require("../models/blog");

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect("/login");
    }
}

// INDEX
router.get("/blogs", function(req, res){
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err)
        } else {
            res.render("blogs/index", {blogs:allBlogs});
        }
    });
});

// NEW
router.get("/blogs/new", middleware.isLoggedIn, function(req, res){
    res.render("blogs/new");
})

// CREATE
router.post("/blogs", middleware.isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, createdBlog){
        if(err){
            req.flash("error", "<div class='header'>Blog not created</div><p>Please try again</p>");
            res.redirect("error");
        } else {
            createdBlog.author.id = req.user._id;
            createdBlog.author.username = req.user.username;
            createdBlog.save();
            req.flash("success", "<div class='header'>Blog created</div><p>Your blog has been added to the database</p>");
            res.redirect("/blogs");
        }
    });
});

// SHOW
router.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            req.flash("error", "<div class='header'>Blog not found</div><p>Please use a blog with a valid ID</p>");
            res.redirect("error");
        } else {
            res.render("blogs/show", {blog:foundBlog});
        }
    })
})

// EDIT
router.get("/blogs/:id/edit", middleware.checkBlogOwnership, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            req.flash("error", "<div class='header'>Blog not found</div><p>Please use a blog with a valid ID</p>");
            res.redirect("error");
        } else {
            res.render("blogs/edit", {blog:foundBlog});
        }
    });
});

// UPDATE
router.put("/blogs/:id", middleware.checkBlogOwnership, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            req.flash("error", "<div class='header'>Blog not found</div><p>Please use a blog with a valid ID</p>");
            res.redirect("error");
        } else {
            req.flash("success", "<div class='header'>Blog updated</div><p>Your blogs has been updated with your changes</p>")
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE
router.delete("/blogs/:id", middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(err, deletedBlog){
        if(err){
            req.flash("error", "<div class='header'>Blog not delete</div><p>Please try again</p>");
            res.redirect("error");
        } else {
            req.flash("success", "<div class='header'>Blog delete</div><p>Your blog has been removed from the database</p>");
            res.redirect("/blogs");
        }
    });
});

module.exports = router;