const mongoose=require("mongoose");


const dbconnect=()=>{
    try{
         mongoose.connect("mongodb+srv://shihabmoni15:tmjzAHi2BFireGLD@cluster0.ts348g7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
         console.log("Databse Connected")
    }catch(err){
        console.log(err.message)
    }
};
module.exports=dbconnect;