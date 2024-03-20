const mongoose =require('mongoose')
const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    image:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        require:true,
        default:Date.now,
    }
})


module.exports=mongoose.model('User',userSchema)