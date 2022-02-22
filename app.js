if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}


console.log(process.env.SECRET)
console.log(process.env.API_KEY)

// const port = process.env.PORT ;
 const port = 5000;

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize')

const MongoStore = require("connect-mongo");

// process.env.DB_URL
// const dbUrl =  process.env.DB_URL;
const dbUrl = 'mongodb://localhost:27017/test';

const rooms = require('./routes/rooms');
const reviews = require('./routes/reviews')
const Users = require('./routes/user');

const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const app = express();
app.use(express.static('public'));

app.engine('ejs',ejsMate);

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

const secrets = process.env.SECRET ;
// const secrets = "good secret";

const sessionConfig = { 
    name: 'session',
    secret : secrets,
    resave:false,
    saveUninitialized:true ,
    cookie:{
        httpOnly : true,
        expires: Date.now() + 1000*60*60*24, //expires in a day
    },
    store:MongoStore.create({
        
            mongoUrl : dbUrl,
            touchAfter: 24*60*60
        
    })
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.sucess = req.flash('sucess');
    res.locals.error = req.flash('error');
    next();
})

app.use(mongoSanitize());

'mongodb://localhost:27017/Rooms'

mongoose.connect(dbUrl)
.then(()=>{
    console.log("connected")
})
.catch((err)=>{
    console.log(err);
})

app.get('/fakeuser',async (req,res)=>{

    const user = new User({email:'selvendran',username:"dffdf"});
    const newuser = await User.register(user,"donkey");

    res.send(newuser);
})
app.set('view engine','ejs');

app.use('/',Users);
app.use('/room',rooms);
app.use('/room/:id/review',reviews);

app.get('/',(req,res)=>{
    res.render('home.ejs');
})

app.all('*',(req,res,next)=>{
    res.render('errors.ejs',{error:'something went wrong'});
})

app.listen(port,()=>{
    console.log(`serving port${port}` );
})
