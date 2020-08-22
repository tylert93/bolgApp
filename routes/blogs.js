import express from 'express';
import {isLoggedIn, checkBlogOwnership} from '../middleware/index';
import {Blog} from '../models/blog';

const blogRoutes = express.Router();      

// INDEX
blogRoutes.get("/blogs", (req, res) => {
    Blog.find({}, (err, allBlogs) => {
        if(err){
            console.log(err)
        } else {
            res.render("blogs/index", {blogs:allBlogs});
        }
    });
});

// NEW
blogRoutes.get("/blogs/new", isLoggedIn, (req, res) => {
    res.render("blogs/new");
})

// CREATE
blogRoutes.post("/blogs", isLoggedIn, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, createdBlog) => {
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
blogRoutes.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            req.flash("error", "<div class='header'>Blog not found</div><p>Please use a blog with a valid ID</p>");
            res.redirect("error");
        } else {
            res.render("blogs/show", {blog:foundBlog});
        }
    })
})

// EDIT
blogRoutes.get("/blogs/:id/edit", checkBlogOwnership, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            req.flash("error", "<div class='header'>Blog not found</div><p>Please use a blog with a valid ID</p>");
            res.redirect("error");
        } else {
            res.render("blogs/edit", {blog:foundBlog});
        }
    });
});

// UPDATE
blogRoutes.put("/blogs/:id", checkBlogOwnership, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
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
blogRoutes.delete("/blogs/:id", checkBlogOwnership, (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err, deletedBlog) => {
        if(err){
            req.flash("error", "<div class='header'>Blog not delete</div><p>Please try again</p>");
            res.redirect("error");
        } else {
            req.flash("success", "<div class='header'>Blog delete</div><p>Your blog has been removed from the database</p>");
            res.redirect("/blogs");
        }
    });
});

export default blogRoutes;