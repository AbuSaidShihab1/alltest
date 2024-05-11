const mongoose=require("mongoose");


const login_schema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
const loginmodel=new mongoose.model("login_schema",login_schema);
module.exports=loginmodel;