const Review = require('../models/review')
const Room = require('../models/rooms');

module.exports.addReview = async(req,res)=>{
  
    const {id} = req.params;
    //console.log(id);
    const room = await Room.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    room.reviews.push(review);
    await review.save();
    await room.save();
    req.flash('sucess','Sucessfully added your review');
    res.redirect(`/room/${room.id}`);

}

module.exports.deleteReview = async (req,res)=>{
    const {id,reviewid} = req.params;
   // await Room.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});  //deletes the object in array of reviews which has reviewid
    await Review.findByIdAndDelete(reviewid);
    req.flash('sucess','Sucessfully deleted the review')
    res.redirect(`/room/${id}`);
}
