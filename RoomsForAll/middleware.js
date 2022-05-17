const Review = require('./models/review');
const Room = require('./models/rooms');
const {RoomSchema,reviewSchema} = require('./shemes');

const isloggedin = (req,res,next)=>{
    console.log("req user",req.user);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','you must be signed in');
        return res.redirect('/login');
    }
    next();
}


module.exports.isloggedin = isloggedin;

const isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const room = await Room.findById(id);
    if(!room.author.equals(req.user._id)){
        req.flash("error","you dont have permission");
        return res.redirect(`/room/${id}`);
    }
    next();
}

module.exports.isAuthor = isAuthor;

const isReviewAuthor = async(req,res,next)=>{
    const {id,reviewid} = req.params;
    const review = await Review.findById(reviewid);
    if(!review.author.equals(req.user._id)){
        req.flash("error","you dont have permission");
        return res.redirect(`/room/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = isReviewAuthor;

const validateRoom = (req,res,next)=>{
    
    console.log(req.body);
    const {error} = RoomSchema.validate(req.body);
    if(error){ 
        const msg = error.details.map(el=> el.message);
        req.session.returnTo = req.originalUrl;
        return res.render('errors.ejs',{error:msg});
    }
    else{
        next();
    }
}
 
module.exports.validateRoom = validateRoom;

const validateReview = (req,res,next)=>{
    const {id} = req.params;
    const {rating} = req.body.review;
     if(rating == "0"){
        req.flash('error','Rating must be atleast 1 star');
        
       return res.redirect(`/room/${id}`);
     }

    console.log(req.body);
    const  {error} = reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        const msg = error.details.map(el=> el.message);
        res.render('errors.ejs',{error:msg});

    }
    else{
        next();
    }
}

module.exports.validateReview = validateReview;