const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const {isloggedin,isAuthor,validateRoom} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const {storage} = require('../cloudinary'); 
const upload = multer({storage});

router.use(express.urlencoded({extended : true}));
router.use(methodOverride('_method'));

const rooms = require('../controllers/rooms');  

router.route('/')
      .get(catchAsync(rooms.index))
      .post(isloggedin,upload.array('image'),validateRoom,catchAsync(rooms.addNewRoom));
      


router.get('/new',isloggedin,rooms.renderNewForm);

router.route('/:id')
      .get(isloggedin, catchAsync(rooms.showRoom))
      .put(isloggedin,isAuthor,upload.array("image"),catchAsync(rooms.updateRoom));

router.get('/:id/edit',isloggedin,isAuthor,catchAsync(rooms.renderEditForm));


router.delete('/:id/delete',isloggedin,isAuthor,catchAsync(rooms.deleteRoom));

module.exports = router;