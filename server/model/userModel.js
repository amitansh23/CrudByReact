import mongoose from "mongoose";
import { type } from "os";
import { string } from "zod";
import { DateTime } from 'luxon';

const userSchema = new mongoose.Schema({
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
    address:{
        type: String,
        requires: true,
    },
    phone:{
        type: String,
        requires: true
    },
    role:{
        type: Number,
        requires : true,
        default: 2
    },
    Created_at: {
        type: String
    },
    Updated_at: {
        type: String
    }
    


})

userSchema.pre("save", function setDatetime(next){
    this.Created_at = DateTime.now().toUTC().toISO()
    this.Updated_at = DateTime.now().toUTC().toISO()
    next()
    
})

export default mongoose.model("User", userSchema);// Database crud mai User table bnegi usmai ye userSchema store hoga
