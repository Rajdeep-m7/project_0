const express = require("express");
const http = require("http");
const bcrypt = require ('bcrypt');
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require('dotenv').config(); 
console.log(require('dotenv').config());
const student = require("./schema");
const cors=require("cors");
const { userInfo } = require("os");
console.log(student)
const app = express();
const server = http.createServer(app);
exports.server = server;
const io = new Server(server, {
    cors: { origin: "*" }
});


app.use(express.json());
app.use(cors());


app.get("/api/student-get/:dept/:className",async(req,res)=>{
    try{
        const { dept, className } = req.params;
        const studentList=await student.find({dept,className}).sort({roll:1});
        res.send(studentList)
    } catch(error){
        res.status(500).json({error:error.message})
    };
});

app.get("/api/student-all",async(req,res)=>{
    try{
        const studentAll= await student.find().sort({roll:1});
        res.send(studentAll);
    } catch (error) {
        res.status(500).json({error:error.message})
    };
})

app.post("/api/student-add",(req,res)=>{
    try{
        let {name,roll,className,dept,email,password} = req.body;
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,async(err,hash)=>{
                const studentAdd= new student({name,roll,className,dept,email,password:hash});
                await studentAdd.save();
                res.status(200).json({message : "data save"});
            });
        });
    } catch (error){
        res.status(500).json({error:error.message})
    }
});

app.patch("/api/student-update/roll/:roll",async(req,res)=>{
  try{
    let {name,dept,className}= req.body;
  const studentUpdate=await student.findOneAndUpdate({roll:req.params.roll},{name,dept,className})
  await studentUpdate.save();
}  catch (error){
    res.status(500).json({error:error.message})
}
})

app.delete("/api/student-delete/roll/:roll",async(req,res)=>{
    try{
        const studentDelete=await student.findOneAndDelete({roll:req.params.roll})
        res.status(200).json({message:"data delete"})
    } catch(error){
        res.status(500).json({error:error.message})
    }
})

app.post("/api/student-login",async(req,res)=>{
    try{
        let user= await student.findOne({email:req.body.email});
        if (!user) return res.send("something went wrong");
        bcrypt.compare(req.body.password,user.password,(err,result)=>{
            if(result) res.send(user) 
            else res.send("wrong password")
        })
    } catch(error) {
        res.status(500).json({error:error.message})
    }
})
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("update_is_in_class", async (data) => {
        try {
            const { roll, is_in_class } = data; 

            console.log(`Received update: Roll - ${roll}, is_in_class - ${is_in_class}`);

            await Student.findOneAndUpdate(
                { roll },
                { is_in_class: is_in_class } 
            );
            io.emit("is_in_class_updated", { roll, is_in_class });

        } catch (error) {
            console.error("Error updating is_in_class:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

mongoose.connect(process.env.DBURL)
.then(()=>{
    console.log("connected");
    server.listen(process.env.PORT,()=>{
        console.log("server running")
    })
})