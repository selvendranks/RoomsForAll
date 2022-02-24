const mongoose = require('mongoose');
const Shema = mongoose.Schema;
const Review = require('./review');

const opts = {toJSON:{virtuals:true}};
const roomsSchema = new Shema({
    title:{
        type:String,
        require:true
    },
    price:{
      type:  String,
      require:true
    },
    description:{
       type: String,
       require:true
    },
    location:{
        type:String,
        require:true
    },
    vacancy:{
      type:String,
      require: true
    },
    image:[{
        url:String,
        filename:String
    }],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    author :{
         type:mongoose.Schema.Types.ObjectId,
         ref: 'User'
    },
    reviews:[{type:Shema.Types.ObjectId,ref : 'Review'}]
  

},opts);

roomsSchema.virtual('properties.popMarkup').get(function(){
    return `<a style="text-decoration: none; "  href="/room/${this._id}">${this.title}</a>`
})

roomsSchema.post('findOneAndDelete',async (room)=>{
    if(room){
        await Review.deleteMany({id:{$in:room.reviews}})
    }
})

const room= mongoose.model("Rooms",roomsSchema);
module.exports = room;