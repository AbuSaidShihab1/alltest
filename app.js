const express=require("express");
const app=express();
const route=require("./routes/route")
const bodyparser=require("body-parser");
const dbconnect=require("./database/dbconnect")

dbconnect();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(route);
app.listen(4000,function(){
    console.log("Run Port 4000")
})
