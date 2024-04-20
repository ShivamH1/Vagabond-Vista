const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync"); //wrapAsync error handling
const Listing = require("../models/listing"); //using listing model
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js"); //middleware to check if user is logged in and owner

const listingController = require("../controller/listing.js"); //controller for listing

//cloud setup 
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, 
        upload.single('listing[image]'), //multer
        validateListing,
        wrapAsync(listingController.createListing)
    );

//new route
router.get("/new",
    isLoggedIn, 
    listingController.renderNewForm
); 

router.route("/:id")
    .get(wrapAsync(listingController.showList)) 
    .put(isLoggedIn, 
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    ) 
    .delete(isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.deleteListing)
    ) 

//edit route
router.get("/:id/edit",
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.editListing)
); 

module.exports = router;



//index route
// router.get("/",wrapAsync(listingController.index));

//show route
// router.get("/:id", wrapAsync(listingController.showList));

//create route
// router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//update route
// router.put("/:id",isLoggedIn, isOwner,validateListing, wrapAsync(listingController.updateListing));

//delete route
// router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));