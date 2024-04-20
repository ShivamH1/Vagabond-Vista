const express = require("express");
const router = express.Router({mergeParams : true}); //mergeParams enables taking parameters from parent file -> app.js
const wrapAsync = require("../util/wrapAsync"); //wrapAsync error handling
const Review = require("../models/review"); //using review model
const Listing = require("../models/listing"); //using listing model
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware"); //isLoggedIn & isReviewAuthor for authorization

const reviewController = require("../controller/review"); //controller for review

//Review
//post route for review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete route for review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;