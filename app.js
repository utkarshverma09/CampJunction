var express=require("express");
var app=express();

var bodyParser=require("body-parser");
const mongoose = require('mongoose');
var passport=require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seed");

var commentRoutes=	  require("./routes/comments"),
	campgroundRoutes= require("./routes/campground"),
	indexRoutes=	  require("./routes/index");


mongoose.connect('mongodb://localhost:27017/yelp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
mongoose.set('useFindAndModify', false);


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
//mongoose.set('useFindAndModify', true);

//seedDB();//seed the datbase
//Passport configuration
app.use(require("express-session")({
	secret:"Once again rusty is chubby",
	resave:false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});
//routes
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
	console.log("YelpCamp server is ON!");
});