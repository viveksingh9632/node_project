const mongoose =require('mongoose')
const roleSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    role_id:{
        type:Array,
        required:true
    },
})


module.exports=mongoose.model('Role',roleSchema)