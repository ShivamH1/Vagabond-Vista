const Listing = require("../models/listing"); //using listing model

module.exports.index = async (req,res) => { //replacing router with router
    const allListing = await Listing.find({});
    res.render("listings/index",{ allListing }); //index.ejs
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new");
};

module.exports.showList = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"},}).populate("owner"); //to find listing and populate the reviews
    if(!listing){
        req.flash("error","Listing you requested does not exist!"); // failure flash msg
        res.redirect("/listings");
    }
    res.render("listings/show",{ listing }); 
    console.log(listing);
};

module.exports.createListing = async (req,res,next) => {
    // let {title,description,image,price,location,country} = req.body; //to avoid this create var key listing[var] here listing is obj
    // let listing = req.body.listing; //Instead of this you can simplify it
    // console.log(listing);
    // if(!req.body.listing){//to handle error when you don't give valid data to create a listing
    //     throw new ExpressError(400,"Send Validate Data for listing"); 
    // }
    // if(!newListing.title){ //to validate schema you can do this for all but it is not correct way
    //     throw new ExpressError(400,"Title missing!"); 
    // }

    //Instead use joi
    // listingSchema.validate(req.body);
    // console.log(res);
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created!"); //using flash message
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!"); // failure flash msg
        res.redirect("/listings");
    }
    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace("/upload","/upload/w_250"); //breaking or reducing image quality in edit form, loads faster
    res.render("listings/edit.ejs", { listing, originalImageURL });
};

module.exports.updateListing = async (req,res) =>{ //using validation schema (validateListing)
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing}); //deconstructing

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }    

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};