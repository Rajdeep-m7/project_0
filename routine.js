const express= require("express");
const routine=require("./routineSchema");
require("dotenv").config();
console.log(require('dotenv').config());
const mongoose=require("mongoose");
const mongodb=require("mongodb");
const cors=require("cors");
const http = require("http");

const app=express();
app.use(express.json());
app.use(cors());

app.get("/api/routine/:dept/:className/:day",async(req,res)=>{
    try{
        let{dept,className,day}=req.params;
        const routineShow = await routine.find({dept,className,day}).sort({startTime:1})
        res.send(routineShow);
    } catch (error){
        res.status(500).json({error:error.message})
    }
});

app.post("/api/routine-add",async(req,res)=>{
    try{
        const routineAdd= new routine(req.body);
        await routineAdd.save();
        res.status(201).json({Message:"new routine save"});
    } catch(error){
        res.status(500).json({error:error.message});
    }
});

app.delete("/api/routine-del/:dept/:className/:day",async(req,res)=>{
    try{
        const {dept,sem,section,day} = req.params;
        const routineDel= await routine.findOneAndDelete({dept,className,day});
        res.status(200).json({message:"data delete"})
    } catch(error){
        res.status(500).json({error:error.message})
    }
});

mongoose.connect(process.env.DBURL)
.then(()=>{
    console.log("connected");
    app.listen(process.env.PORT,()=>{
        console.log("server running")
    })
})
