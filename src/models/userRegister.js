const mongoose = require("mongoose")

const userRegisterSchema = new mongoose.Schema({
    userName:{
        type: String,
        require:true,
        min :3,
        max:100
    },
    email: {
        type:String,
        require : true,
        unique : true,
        min:5,
        max:100
    },
    password : {
        type:String,
        require: true,
        min:5,
        max:50
    },
    profileImage: {
        type: String,
        default: 'https://example.com/default-profile-image.jpg',  
    },
    isAdmin:{
        type: Number,
        default:0
    },
    isVerify :{
        type:Boolean,
        default :false
    },
    otp:{
        type: String,
        required: true
    },
    otptime:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})


const User = mongoose.model("User", userRegisterSchema);
module.exports = User;