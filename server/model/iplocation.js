import mongoose from "mongoose";

const ipLocationSchema = new mongoose.Schema({
    ipAddress: String,
    country: String,
    city: String,
    latitude: Number,
    longitude: Number,
    device: String,
    location: String,
    
    date: { type: Date, default: Date.now }
  });
  
 export default mongoose.model('IpLocation', ipLocationSchema);