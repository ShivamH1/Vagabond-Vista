const Review = require("../models/review"); //using review model
const Listing = require("../models/listing"); //using listing model

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id); //get the listing
    let newReview = new Review(req.body.review); //retrieve the review from form
    newReview.author = req.user._id; //authorization

    listing.reviews.push(newReview); //push it in the listing schema under review section (db relation)
    await newReview.save(); 
    await listing.save();
    console.log("Review saved");
    // res.send("new review send");
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing.id}`);
};

module.exports.destroyReview = async(req,res) => {
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}}); //updating review array in listing
    await Review.findByIdAndDelete(reviewId); // removing review from Review model
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};