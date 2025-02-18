import mongoose from "mongoose";
import { DateTime } from 'luxon';

const Schema = mongoose.Schema;

const userProfile = new Schema({
    filename:{
        type: String,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'users'

    },
    uploadedAt: {
        type: String
    },

})

    userProfile.pre("save", function setDatetime(next){
        this.uploadedAt = DateTime.now().toUTC().toISO()
        next()
   
})

export default mongoose.model("userProfile", userProfile);