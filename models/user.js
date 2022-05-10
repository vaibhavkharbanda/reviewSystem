const mongoose= require('mongoose');
const Review = require('./review');

const userSchema = new  mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    empCode:{ 
        type:String,
        required:true,
        unique: true
    },
    name:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false,
        require:true
    },
    myReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }],
    permission:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]

},{
    timestamps:true
});


const User=mongoose.model('User',userSchema);

module.exports = User;

