const mongoose= require ("mongoose");

const routineSchema= new mongoose.Schema({
    dept:{
        type:String,
        require:true
    },
    className:{
        type: String,
        require:true
    },
    day:{
        type:String,
        require:true
    },
    subjects:[{
        name: { type: String, required: true }, // Subject name
        startTime: { type: String, required: true }, // e.g., "10:00 AM"
        endTime: { type: String, required: true } // e.g., "11:00 AM"
    }
]
});

const routine= mongoose.model("RoutineSchema",routineSchema);
module.exports=routine;