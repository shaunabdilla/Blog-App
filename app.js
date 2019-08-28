const bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer");
		 express = require("express"),
	    mongoose = require("mongoose"),
	  	  moment = require("moment"),
             app = express(),
			port = 3000;

// mongoose deprecation changes here ------------------------
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// mongoose deprecation changes here ------------------------


// APP CONFIG---------------------------------------------------------------------------------------
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
// APP CONFIG -------------------------------------------------------------------------------------

// MONGOOSE/MDOEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

app.get("/", (req,res) => {
	res.redirect("/blogs");
});

// index route
app.get("/blogs", (req,res) => {
	Blog.find({}, (err, blogs) => {
		if(err) {
			   console.log ("error");
		} else {
			  res.render ("index", {blogs: blogs});
		}
	});
});

// new route
app.get("/blogs/new", (req,res) => {
	res.render("new");
})

// create route
app.post("/blogs", (req,res) => {
// 	create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, (err, newBlog) => {
		if(err){
			res.render("new");
		} else {
			// 	then redirect to index 
			res.redirect("/blogs");
		}
	});
});

// show route
app.get("/blogs/:id", (req, res) => {
	Blog.findById(req.params.id, (err, foundBlog) => {
		if (err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

// edit route
app.get("/blogs/:id/edit", (req,res) => {
	Blog.findById(req.params.id,(err, foundBlog) => {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

// update route
app.put("/blogs/:id", (req, res) => {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
		if (err) {
			res.redirect("/blogs/");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// delete route
app.delete("/blogs/:id", (req, res) => {
// 	destroy blog#
	Blog.findByIdAndRemove(req.params.id, (err) => {
		// 	redirect
		if (err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});

});

		
app.listen(port, () => {
	console.log("Listening on port "+ port + " RESTful blog app server has started");
}); 

