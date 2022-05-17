const express = require('express');
const catchAsync = require('../utils/catchAsync');
const {validateReview,isloggedin,isReviewAuthor} = require('../middleware')
const router = express.Router({mergeParams:true});
router.use(express.urlencoded({extended : true}));
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

const reviews = require('../controllers/reviews');

router.post('/',validateReview,isloggedin,catchAsync(reviews.addReview));

router.delete('/:reviewid',isloggedin,isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports = router;