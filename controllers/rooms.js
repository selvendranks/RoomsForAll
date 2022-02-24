const Room = require('../models/rooms');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
//const {cordin} = require("../public/javascript/dragableMap");

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken})

module.exports.index = async(req,res)=>{
    const rooms = await Room.find({});
    res.render('rooms/index.ejs',{rooms});
 }

 module.exports.renderNewForm = (req,res)=>{
    res.render('rooms/new.ejs');
}

module.exports.addNewRoom = async (req,res)=>{
     
    const {latitude,longitude,vacancy} = req.body.Room;
    const markedCordinates = [parseFloat(longitude),parseFloat(latitude)];

    const geodata = await geocoder.forwardGeocode({
        query: req.body.Room.location,
        limit:1
    }).send()

    const room = new Room(req.body.Room);
    room.geometry = geodata.body.features[0].geometry;
    if(latitude!=='0'&&longitude!=='0'){
    room.geometry.coordinates = markedCordinates;
    }
    room.image =  req.files.map(f=>({ url:f.path , filename:f.filename }))
    room.author = req.user._id;
    

    if(vacancy=="available"){
        room.vacancy = vacancy;
    }
    else{
        room.vacancy = "unavailable";
    }

    await room.save()
    console.log(room);
    req.flash('sucess','Sucessfully added new room');
    res.redirect(`/room/${room._id}`);
}

module.exports.showRoom =async (req,res)=>{
    

    const {id} = req.params;
    const room = await Room.findById(id).populate({
        path :'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!room){
        console.log('nulled');
        req.flash('error','Cannot find room');
        res.redirect('/room');
    }
    else{
    res.render('rooms/show.ejs',{room});
    }
}

module.exports.updateRoom = async (req,res)=>{

    // res.send(req.body);

    const {latitude,longitude,vacancy} = req.body.Room;
    const markedCordinates = [parseFloat(longitude),parseFloat(latitude)];
    const {id} = req.params;
    console.log(req.body.deleteImages);
    const room = await Room.findByIdAndUpdate(id,req.body.Room,{runValidators:false,new:true});
    const imgs =   req.files.map(f=>({ url:f.path , filename:f.filename }));
    room.image.push(...imgs);
    
    room.geometry.coordinates = markedCordinates;
    
    room.geometry

    if(req.body.deleteImages){

        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await room.updateOne({$pull:{image:{filename:{$in : req.body.deleteImages}}}})
        
    }

    if(vacancy=="available"){
        room.vacancy = vacancy;
    }
    else{
        room.vacancy = "unavailable";
    }

    await room.save();
    req.flash('sucess','Sucessfully updated the room')
    res.redirect(`/room/${room._id}`);
}

module.exports.renderEditForm  = async (req,res)=>{
    const {id} = req.params;
    const room = await Room.findById(id);
    if(!room){
        console.log('nulled');
        req.flash('error','Cannot find room');
        res.redirect('/room');
    }
    else{
    res.render('rooms/edit.ejs',{room})
    }
}

module.exports.deleteRoom = async (req,res)=>{
    const {id} = req.params;
    await Room.findByIdAndDelete(id);
    req.flash('sucess','Sucessfully deleted the room')
    res.redirect(`/room`);
}