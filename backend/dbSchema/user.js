const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
     
    username :{
        type: String,
        required: true,
        lowercase:true,
        unique:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname :{
        type:String
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    email:{
        type:String,
        required:true
    },


});

const User = mongoose.model("User",userSchema);

module.exports = User;