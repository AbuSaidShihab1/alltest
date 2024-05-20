const express=require("express");
const route=express();
const loginmodel=require("../models/loginmodel");
const studentmodel=require("../models/addstudentmodel");
const session=require("express-session");
const adminmiddleware=require("../middleware/adminmiddleware");
const request = require('request');
const resultmodel=require("../models/resultmodel");
const axios=require("axios");
const cors = require('cors');
route.use(session({secret:"1234566"}));
route.use(cors())
// search page route
route.get("/",adminmiddleware.islogout,(req,res)=>{
    try{
          res.render("home")
    }catch(err){
        console.log(err.message)
    }
});
route.get("/classes",adminmiddleware.islogout,(req,res)=>{
    try{
          res.render("classes")
    }catch(err){
        console.log(err.message)
    }
});
route.get("/teachers",adminmiddleware.islogout,(req,res)=>{
    try{
          res.render("teacher")
    }catch(err){
        console.log(err.message)
    }
});
route.get("/notice",adminmiddleware.islogout,(req,res)=>{
    try{
          res.render("notice")
    }catch(err){
        console.log(err.message)
    }
});
route.get("/contact",adminmiddleware.islogout,(req,res)=>{
    try{
          res.render("contact")
    }catch(err){
        console.log(err.message)
    }
});
route.post("/",(req,res)=>{
    try{
        res.redirect(`marksheet/${req.body.registration}?gender=${req.body.gender}&class=${req.body.class}&year=${req.body.year}`)
    }catch(err){
        console.log(err.message)
    }
});
route.get("/get_data", async function (req, res) {
    try {
      const search_query = req.query.search_query;
      let searchinfo = "";
      if (req.query.search_query) {
        searchinfo = req.query.search_query;
      }
      const allbookinfo = await studentmodel.find({
        $or: [
          { registration: { $regex: ".*" + searchinfo + ".*" } },
        ],
      });
      res.send({ allbookinfo });
    } catch (err) {
      console.log(err);
    }
  });
// marksheet page
route.get("/marksheet/:id",adminmiddleware.islogout,async(req,res)=>{
    try{
        const findstudent=await studentmodel.findOne({registration:req.params.id});
        const findresult=await resultmodel.find({registration:req.params.id});
        console.log(findresult)
        let num1=0;
        let num2=0;
        let num3=0;
        let num4=0;
        let num5=0;
        let num6=0;
        let num7=0;
        let totalnumber=0;
        let totalmark=0;
        findresult.forEach(element => {
            totalmark +=element.subject_number+0;
        num1=element.bangla_number+num1;
        num2=element.english_number+num2;
        num3=element.math_number+num3;
        num4=element.islam_number+num4;
        num5=element.social_number+num5;
        num6=element.ict_number+num6;
        num7=element.science_number+num7;
        totalnumber=element.total_number+totalnumber;
        });
        console.log(num1);
          res.render("marksheet",{findstudent,totalnumber,findresult,num1,num2,num3,num4,num5,num6,num7})
    }catch(err){
        console.log(err.message)
    }
});
// login page
route.get("/login",adminmiddleware.islogout,(req,res)=>{
    try{
          res.render("login")
    }catch(err){
        console.log(err.message)
    }
});
route.post("/login",async(req,res)=>{
    try{
          const {email,password}=req.body;
          const logininfo=await loginmodel.findOne({email:email})
          if(logininfo){
            if(logininfo.password==password){
                req.session.adminId=logininfo;
                     res.redirect("/admin");
            }else{
                res.render("login")
              }
          }else{
            res.render("login")
          }
    }catch(err){
        console.log(err.message)
    }
});

// admin page
route.get("/admin",adminmiddleware.isadmin,(req,res)=>{
    try{
          res.render("../views/admin/adminpage")
    }catch(err){
        console.log(err.message)
    }
});
// add student
route.get("/add-student",adminmiddleware.isadmin,(req,res)=>{
    try{
          res.render("../views/admin/addstudent")
    }catch(err){
        console.log(err.message)
    }
});
route.post("/add-student",(req,res)=>{
    try{
        const {name,father_name,registration,student_photo,gender,class_name,number,area}=req.body;
        const student_info_save=new studentmodel({
            name,father_name,registration,student_photo,gender,class_name,area,number
        });
        if(student_info_save){
            res.render("../views/admin/addstudent",{message:"Student Have Added Successfully!"});
            student_info_save.save();
        }else{
            res.render("../views/admin/addstudent",{message:"Something went wrong"});
        }
          
    }catch(err){
        console.log(err.message)
    }
});
// update student info 
route.get("/admin/student-info-update/:id",adminmiddleware.isadmin,async(req,res)=>{
    try{
        const matchdata=await studentmodel.findOne({_id:req.params.id});
        console.log()
          res.render("../views/admin/updatestudentinfo",{matchdata})
    }catch(err){
        console.log(err.message)
    }
});
route.post("/admin/student-info-update/:id",adminmiddleware.isadmin,async(req,res)=>{
    try{
        const matchdata=await studentmodel.findOne({_id:req.params.id});

        const matchdata1=await studentmodel.findByIdAndUpdate({_id:req.params.id},{$set:{name:req.body.name,father_name:req.body.father_name,registration:req.body.registration,student_photo:req.body.student_photo,gender:req.body.gender,class_name:req.body.class_name}});
          res.render("../views/admin/updatestudentinfo",{matchdata,message_name:matchdata1.name,message:"updated successfully"})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/student-info-delete/:id",adminmiddleware.isadmin,async(req,res)=>{
    try{
        const matchdata=await studentmodel.findByIdAndDelete({_id:req.params.id});
          res.redirect("back")
    }catch(err){
        console.log(err.message)
    }
});
route.get("/result-add",adminmiddleware.isadmin,(req,res)=>{
    try{
          res.render("../views/admin/resultadd")
    }catch(err){
        console.log(err.message)
    }
});
route.post("/result-add",async(req,res)=>{
    try{
        const {name,registration,gender,class_name,subject_name,subject_number,exam_number,date}=req.body;
        const resultinfo=new resultmodel({
            name,registration,gender,class_name,subject_name,subject_number,exam_number,date
        });
        const matchdata2=await studentmodel.find({registration:registration});
        if(resultinfo){
              async function sendWhatsAppMessage(data) {
                  const url = 'https://wa.positiveapi.com/api/send_media_file';
              
                  try {
                      const response = await axios.post(url, data, {
                          headers: {
                              'Content-Type': 'application/json'
                          }
                      });
                      return response.data;
                  } catch (error) {
                      if (error.response) {
                          // The request was made and the server responded with a status code
                          // that falls out of the range of 2xx
                          console.error("Response Error:", error.response.data);
                          return error.response.data;
                      } else if (error.request) {
                          // The request was made but no response was received
                          console.error("Request Error:", error.request);
                          return error.request;
                      } else {
                          // Something happened in setting up the request that triggered an Error
                          console.error("Error:", error.message);
                          return error.message;
                      }
                  }
              }
              
              // Example usage
              const messageData = {
                  number:matchdata2.number , // replace with the desired phone number
                  type: 'text',
                  message: `আপনার সন্তানের পড়াশোনার মনোযোগ বৃদ্ধির জন্য আমরা ${date} ষাণ্মাসিক  মূল্যায়ন পরীক্ষার আয়োজন করি | আজ পরীক্ষার ফলাফল দেয়া  হয়েছে | আপনার সন্তানের প্রাপ্ত নম্বর ${subject_number} পরীক্ষার নম্বর ${exam_number}|আপনার সন্তানের প্রতি আপনাকে আরো দায়িত্ববান হওয়ার জন্য বিনীত অনুরোধ জানাচ্ছি |
                  -অল কেয়ার একাডেমী`,
                  instance_id: '6613AF256BFE2',
                  access_token: '6613ab53a28ec'
              };
              
              sendWhatsAppMessage(messageData)
                  .then(result => {
                      console.log("Message Sent Result:", result);
                  })
                  .catch(error => {
                      console.error("Error:", error);
                  });
               resultinfo.save();
               res.render("../views/admin/resultadd",{message:"Result Added successfully"})
        }else{
            res.render("../views/admin/resultadd",{message:"Result Did Not Add!"})
        }
        const matchdata=await resultmodel.find({registration:req.body.registration});
        //  matchdata.forEach(async( element) => {
        //     if(element.date==req.body.date){
        //            if(subject_name=="bangla"){
        //             console.log(element._id)
        //               await matchdata.findByIdAndUpdate({_id:element._id},{$set:{bangla_number:req.body.exam_number}})
        //            }
        //     }else{
        //         resultinfo.save();
        //   res.render("../views/admin/resultadd",{message:"Result Added successfully"})
        //     }
        //  });
        // const finddata=await resultmodel.find({_id:matchdata._id});
        // console.log(finddata.date);
        // if(finddata.date===req.body.date){
        //    if(subject_name=="bangla"){
        //     console.log("matchdata._id")
        //     //  await matchdata.findOneAndUpdate({_id:matchdata._id},{$set:{bangla_number:req.body.subject_number}})
        //    }
        // }else if(matchdata.date != req.body.date){
        //   resultinfo.save();
        //   res.render("../views/admin/resultadd",{message:"Result Added successfully"})
        // }
       
              
    }catch(err){
        console.log(err.message)
    }
});
route.get("/students-result",adminmiddleware.isadmin,(req,res)=>{
    try{
          res.render("../views/admin/resultpage")
    }catch(err){
        console.log(err.message)
    }
});
route.get("/delete-student-result/:id",adminmiddleware.isadmin,async(req,res)=>{
    try{
         const matchresult=await resultmodel.findByIdAndDelete({_id:req.params.id})
          res.redirect("back");
          console.log(req.params.id)
    }catch(err){
        console.log(err.message)
    }
});
route.get("/message",adminmiddleware.isadmin,(req,res)=>{
    try{
          res.render("../views/admin/messagepage")
    }catch(err){
        console.log(err.message)
    }
});
// explore student
route.get("/admin/explore-student",adminmiddleware.isadmin,(req,res)=>{
    try{
          res.render("../views/admin/exlporestudent")
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-certificate",adminmiddleware.isadmin,(req,res)=>{
    try{
          res.render("../views/admin/stdresult")
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-number",adminmiddleware.isadmin,(req,res)=>{
    try{
          res.render("../views/admin/stdnumber")
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-info",adminmiddleware.isadmin,(req,res)=>{
    try{
          res.render("../views/admin/studentinfo")
    }catch(err){
        console.log(err.message)
    }
});
// all classes
route.get("/admin/class-three",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"3",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
    });
          res.render("../views/studentpages/classthree",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-four",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"4",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classfour",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-five",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"5",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classfive",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-six-boys",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"6",gender:"male",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classsixb",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-six-girls",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"6",gender:"female",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classsixg",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-seven-boys",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"7",gender:"male",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classsevenb",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-seven-girls",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"7",gender:"female",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classsevenb",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-eight-boys",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"8",gender:"male",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classeightb",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-eight-girls",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"8",gender:"female",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classeightg",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-nine-boys",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"9",gender:"male",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classnineb",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-nine-girls",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"9",gender:"female",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classnineg",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-ten-boys",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"10",gender:"male",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classtenb",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/admin/class-ten-girls",adminmiddleware.isadmin,async(req,res)=>{
    try{ 
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const threedata=await studentmodel.find({class_name:"10",gender:"female",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]});
          res.render("../views/studentpages/classteng",{threedata})
    }catch(err){
        console.log(err.message)
    }
});
// result pages
route.get("/admin/student-result/marks/:id",adminmiddleware.isadmin,async(req,res)=>{
    try{
        const resultfind=await resultmodel.find({registration:req.params.id});
        const resultfind1=await resultmodel.findOne({registration:req.params.id});
        const resultname=await studentmodel.findOne({registration:req.params.id});
        const studentimage=await studentmodel.findOne({registration:req.params.id});
        resultfind.forEach(async element => {
            var matchnum=0;
            var mat= element.bangla_number + element.english_number+element.math_number+matchnum;
            const matchdata=await resultmodel.findByIdAndUpdate({_id:element._id},{$set:{total_number:mat}})
        });
        let allnumber = 0;
        resultfind.forEach(eachamount => {
            allnumber += eachamount.total_number;
        });
        console.log(allnumber)
          res.render("../views/admin/stdresult",{allnumber,resultfind,resultname,studentimage})
    }catch(err){
        console.log(err.message)
    }
});
// -----------------------------practice------------------------
route.get("/admin/practice/marks/:id",adminmiddleware.isadmin,async(req,res)=>{
    try{
        const resultfind=await resultmodel.find({registration:req.params.id});
        const resultfind1=await resultmodel.findOne({registration:req.params.id});
        const resultname=await studentmodel.findOne({registration:req.params.id});
        const studentimage=await studentmodel.findOne({registration:req.params.id});
        resultfind.forEach(async element => {
            var matchnum=0;
            var mat= element.bangla_number + element.english_number+element.math_number+matchnum;
            const matchdata=await resultmodel.findByIdAndUpdate({_id:element._id},{$set:{total_number:mat}})
        });
        let allnumber = 0;
        let total_add=0;
        resultfind.forEach(eachamount => {
            allnumber += eachamount.subject_number;
            total_add +=eachamount.exam_number;
        });
        console.log(allnumber)
          res.render("../views/admin/practice",{allnumber,total_add,resultfind,resultname,studentimage})
    }catch(err){
        console.log(err.message)
    }
});
// -----------------------practice----------------------------

route.get("/student-result-class-three",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"3",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resultthree",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-four",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"4",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resultfour",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-five",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"5",});
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        console.log(resultdata)
          res.render("../views/resultpages/resultfive",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-six-boys",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"6",gender:"male",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resultsixb",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-six-girls",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"6",gender:"female",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resultsixg",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-seven-boys",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"7",gender:"male",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resultsevenb",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-seven-girls",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"7",gender:"female",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resultseveng",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-eight-boys",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"8",gender:"male",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resulteightb",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-eight-girls",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"8",gender:"female",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resulteightg",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-nine-boys",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"9",gender:"male",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resultnineb",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-nine-girls",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"9",gender:"female",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resultnineg",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-ten-girls",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"10",gender:"female",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resultteng",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/student-result-class-ten-boys",adminmiddleware.isadmin,async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search
        };
        const resultdata=await studentmodel.find({class_name:"10",gender:"male",
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            {registration:{$regex:'.*'+search+'.*',$options:'i'}},
            {father_name:{$regex:'.*'+search+'.*',$options:'i'}},
        ]
        });
        console.log(resultdata)
          res.render("../views/resultpages/resulttenb",{resultdata})
    }catch(err){
        console.log(err.message)
    }
});
route.get("/logout",adminmiddleware.isadmin,async(req,res)=>{
    try{
        req.session.destroy();
          res.redirect("/login")
    }catch(err){
        console.log(err.message)
    }
});
// /update-result/
route.post("/update-result/:id",adminmiddleware.isadmin,async(req,res)=>{
    try{
        const {bangla_number,english_number,math_number,science_number,social_number,ict_number,bangla_exam,english_exam,math_exam,science_exam,social_exam,ict_exam}=req.body;
        const resultupdate=await resultmodel.findByIdAndUpdate({_id:req.params.id},{$set:{bangla_number,english_number,math_number,science_number,ict_number,social_number,bangla_exam,english_exam,math_exam,science_exam,social_exam,ict_exam}});
          res.redirect("back")
    }catch(err){
        console.log(err.message)
    }
});
route.post("/delete-student-result/:id",adminmiddleware.isadmin,async(req,res)=>{
    try{
        const resultupdate=await resultmodel.findByIdAndDelete({_id:req.params.id});
          res.redirect("back")
    }catch(err){
        console.log(err.message)
    }
});
// messages send
route.get("/student-message",adminmiddleware.isadmin,async(req,res)=>{
    try{
          
          res.render("../views/admin/studentmessage")
    }catch(err){
        console.log(err.message)
    }
});
route.get("/classes-message",adminmiddleware.isadmin,async(req,res)=>{
    try{
          
          res.render("../views/admin/classesmessage")
    }catch(err){
        console.log(err.message)
    }
});
route.get("/teachers-message",adminmiddleware.isadmin,async(req,res)=>{
    try{
          
          res.render("../views/admin/teachermessage")
    }catch(err){
        console.log(err.message)
    }
});
// ---------------classes-message---------------

route.get("/classes-message/:id",adminmiddleware.isadmin,async(req,res)=>{
    try{
          console.log(req.params.id)
          const matchdata=await studentmodel.find({class_name:req.params.id});
          
          res.render("../views/admin/classesmessagebox")
    }catch(err){
        console.log(err.message)
    }
});

route.post("/classes-message/:id",adminmiddleware.isadmin,async(req,res)=>{
    try{
          const matchdata=await studentmodel.find({class_name:req.params.id});
          async function sendWhatsAppMessage(data) {
            const url = 'https://wa.positiveapi.com/api/send_media_file';
        
            try {
                const response = await axios.post(url, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return response.data;
            } catch (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error("Response Error:", error.response.data);
                    return error.response.data;
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error("Request Error:", error.request);
                    return error.request;
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Error:", error.message);
                    return error.message;
                }
            }
        }
        
        // Example usage
        const messageData = {
            number:matchdata.number, // replace with the desired phone number
            type: 'text',
            message:req.body.message,
            instance_id: '6613AF256BFE2',
            access_token: '6613ab53a28ec'
        };
        
        sendWhatsAppMessage(messageData)
            .then(result => {
                console.log("Message Sent Result:", result);
            })
            .catch(error => {
                console.error("Error:", error);
            });
          res.render("../views/admin/classesmessagebox")
    }catch(err){
        console.log(err.message)
    }
});
// --------------------classes message---------------
route.post("/student-message",adminmiddleware.isadmin,async(req,res)=>{
    try{
          const studentmessage=await studentmodel.find();
          studentmessage.forEach(element => {
            async function sendWhatsAppMessage(data) {
                const url = 'https://wa.positiveapi.com/api/send_media_file';
            
                try {
                    const response = await axios.post(url, data, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    return response.data;
                } catch (error) {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.error("Response Error:", error.response.data);
                        return error.response.data;
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.error("Request Error:", error.request);
                        return error.request;
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.error("Error:", error.message);
                        return error.message;
                    }
                }
            }
            
            // Example usage
            const messageData = {
                number:element.number, // replace with the desired phone number
                type: 'text',
                message: 'Hello.',
                instance_id: '6613AF256BFE2',
                access_token: '6613ab53a28ec'
            };
            
            sendWhatsAppMessage(messageData)
                .then(result => {
                    console.log("Message Sent Result:", result);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
          });
    }catch(err){
        console.log(err)
    }
});
module.exports=route;