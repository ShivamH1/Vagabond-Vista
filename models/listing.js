const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        url : String,
        filename : String,
        // type : String,
        // default : "https://unsplash.com/photos/coconut-palm-trees-in-hotel-lobby-_dS27XGgRyQ", //when image undefined then default will be used
        // set : (v) => v === "" ? "https://unsplash.com/photos/coconut-palm-trees-in-hotel-lobby-_dS27XGgRyQ" : v, //virtual schema, this is used when url link is empty
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    // category : {
    //     type : String,
    //     enum : ["mountains","arctic","farms","desert"]
    // }
});

//Handling - Delete Listing to remove reviews if listing deleted (Middleware)
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;