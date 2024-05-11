const mongoose=require("mongoose");

const addstudent_schema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    father_name:{
        type:String,
        required:true,
        trim:true

    },
    registration:{
        type:String,
        required:true,
        trim:true

    },
    number:{
        type:String,
        required:true,
        trim:true
    },
    area:{
        type:String,
        required:true,
        trim:true
    },
    student_photo:{
        type:String,
        required:true,
        trim:true
    },
    gender:{
        type:String,
        required:true,
        trim:true
    },
    class_name:{
        type:String,
        required:true,
        trim:true
    }
});
module.exports=new mongoose.model("student_info",addstudent_schema)