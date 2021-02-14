var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");
//campground
router.get("/",function(req,res){
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	})
	
// res.render("campgrounds",{campgrounds,campgrounds});
});
router.post("/",middleware.isLoggedIn,function(req,res){
	
	var name= req.body.name;
	var image= req.body.image;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCampground={name:name,image:image,description:description,author:author};
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err)
		}
		else{
			res.redirect("/campgrounds");
		}
	});
	
});
//display information about a particular campground
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/newGround");
})


router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampgrounds){
	if(err){
		console.log(err);
	}	
	else{
		res.render("campgrounds/show",{campground:foundCampgrounds});
	}
});
	
});

//Edit Campgrounds Route

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
 Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
		
});


//Update Campgrounds Route

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
//console.log(req.params.id);
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
//Destroy CampgroundRoute

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findOneAndDelete(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
});



module.exports=router;