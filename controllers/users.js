const User = require('../models/user');
const Review = require('../models/review')
const Room = require('../models/rooms');

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register');
}

module.exports.registerUser = async (req,res)=>{
    try{
      const {username,email,password} = req.body;
      const user = new User({username , email});
      const registeredUser = await User.register(user,password);
      req.login(registeredUser,err=>{
          if(err) return next(err);
          // req.flash('sucess',"Welcome to yelpcamp");
          // res.redirect('/room');
      })
      req.flash('sucess',"Welcome to yelpcamp");
          res.redirect('/room');
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
     
  }

  module.exports.renderLoginForm = async(req,res)=>{
    res.render('users/login');
}

module.exports.loginUser = async(req,res)=>{
    req.flash("sucess","Welcome back");
    const redirectUrl = req.session.returnTo || '/room';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res)=>{
    req.logOut();
    req.flash('sucess','sucessfully logged out');
    res.redirect('/room');
}