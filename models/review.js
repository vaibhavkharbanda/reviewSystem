const mongoose=require('mongoose');


const reviewSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    reviewBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },


},{
    timestamps:true
});



const Review = mongoose.model('Review',reviewSchema);
module.exports = Review;