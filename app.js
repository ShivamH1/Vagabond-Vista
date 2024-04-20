if(process.env.NODE_ENV != "production"){ //use .env file in development phase not in production phase
    require("dotenv").config();
}

const express = require("express"); // to use express
const app = express();
const mongoose = require("mongoose"); //to use mongoose
const path = require("path"); //to use ejs
const methodOverride = require("method-override"); //to use PUT, DELETE
const ejsMate = require("ejs-mate"); //templates forlayout
const ExpressError = require("./util/ExpressError"); //Custom ExpressError class
const { stat } = require("fs"); //file system-related functionality
const{listingSchema, reviewSchema} = require("./schema"); //validation for server side for listing and review
const { valid } = require("joi"); //adding joi moodule
const { wrap } = require("module"); //wrap the content of module

//requiring the routes
//requiring the route or express router of listings
const listingRouter = require("./routes/listing");
//requiring the route or express router of review
const reviewRouter = require("./routes/review");
//requiring the route for user login and signup
const userRouter = require("./routes/user");

const session = require("express-session"); //to use session in page
const MongoStore = require('connect-mongo');//mongo store

const flash = require("connect-flash"); //flash message
//for authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

//Not required anymore as they are used in express router 
// const wrapAsync = require("./util/wrapAsync"); //wrapAsync error handling
// const Listing = require("./models/listing"); //using listing model
// const Review = require("./models/review"); //using review model

const dbURL = process.env.ATLASDB_URL; //atlas connect

//nosql mongo connectivity
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err)
    });

async function main(){
    // await mongoose.connect("mongodb://127.0.0.1:27017/VegabondVista");
    
    //connecting atlas
    await mongoose.connect(dbURL);
};

// Set up views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended:true})); //for parsing the data obtained through req object

app.use(methodOverride("_method")); //to use method-override

app.engine('ejs',ejsMate); //template for layout
app.use(express.static(path.join(__dirname,"/public"))); //using public folder for styling (static files)

//mongo session store
const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

//creating session options inorder to use the session declaring as variable
const sessionOptions  = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};

store.on("error", () => {
    console.log("ERROR IN MONGO SESSSION STORE");
});

//root route
// app.get("/",(req,res) => {
//     res.send("Hi, I am root");
// });

app.use(session(sessionOptions)); //using session now
app.use(flash()); //declare before route - flash

//authentication using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate every user through localstrat and model using .authenticate method

passport.serializeUser(User.serializeUser()); //serialize user into session, storing users info in session
passport.deserializeUser(User.deserializeUser()); //deserialize user from session, removing from session

//implementing express flash
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; 
    next();
});

//creating demo user
// app.get("/demo", async (req, res) => {
//     let fakeUser = new User({
//         email : "user@gmail.com",
//         username : "sae-student",
//     });
//     let registereduser = await User.register(fakeUser, "helloworld");
//     res.send(registereduser);
// });

//validation for listingschema(middleware) pass as parameter
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//validation for reviewschema(middleware) pass as parameter
const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//using express router for listing
app.use("/listings",listingRouter);

//using express router for review
app.use("/listings/:id/reviews", reviewRouter);

//using express router for user login and signup
app.use("/",userRouter);

//declaring middleware to handle error & using Custom Error
app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next) => {
    let {status=500,message="Some Error Occured!"} = err;
    // res.send("Something went wrong");
    // res.status(status).send(message);
    res.status(status).render("listings/error.ejs",{err});
});

//starting server
app.listen(8080,() => {
    console.log("Starting server in port 8080");
});

//testing listing model
// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the Beach",
//         price : 2100,
//         location : "Calangute, Goa",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// });