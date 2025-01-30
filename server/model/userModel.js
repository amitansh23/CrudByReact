import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fname:{
        type:String,
        requires:true,
    },
    lname:{
        type:String,
        requires:true,
    },
    email:{
        type:String,
        requires:true,
    },
    password:{
        type:String,
        requires:true,
    },
    status:{
        type: Number,
        default:1,

    },
    latitude:{
        type: String,
        default:0.0,
    },
    longitude:{
        type: String,
        default:0.0,
    },

})

export default mongoose.model("User", userSchema);// Database crud mai User table bnegi usmai ye userSchema store hoga
