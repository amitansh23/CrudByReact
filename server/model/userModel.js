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
    }
})

export default mongoose.model("User", userSchema);// Database crud mai User table bnegi usmai ye userSchema store hoga
