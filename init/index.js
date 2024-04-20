const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing");

const dbURL = process.env.ATLASDB_URL; //atlas connect

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err)
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/VegabondVista");
    // await mongoose.connect(dbURL);
}

const initDB = async() =>{
    // await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
        ...obj, //shalow mapping each obj to owner
        owner : "661d701ebcb67046347a7c76",
    }));
    await Listing.insertMany(initdata.data,{ 
        // Specify a longer timeout in milliseconds
        writeConcern: { wtimeout: 30000 } // 30 seconds timeout
    });
    console.log("data was initialized");
}

initDB();