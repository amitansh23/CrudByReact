
import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import {setUser } from '../middleware/token.js';

export const create = async(req,res)=>{
    try {
        const {fname , lname , email , password} = req.body;
        // const userData= new User(req.body);
        if(!email){
            return res.status(404).json({msg:"User not Create"});
        }
        const saltRound = 10;
        const hashpassword = await bcrypt.hash(password , saltRound)
        const savedData= await User.create({fname, lname, email, password : hashpassword});
        
        return res.status(200).json({msg:"Successfull",savedData});
    }
        catch (error) {  
         res.status(404).json(error);
        
    }
}

export const registration = async(req,res)=>{
    try {
        const {fname , lname , email , password, latitude, longitude} = req.body;
        // const userData= new User(req.body);
        if(!email){
            return res.status(404).json({msg:"User not Create"});
        }
        const saltRound = 10;
        const hashpassword = await bcrypt.hash(password , saltRound)

        // if (!latitude || !longitude) {
        //     return res.status(400).json({ message: "Location data is required" });
        //   }
        

        const savedData= await User.create({fname, lname, email, password : hashpassword , latitude, longitude});
        
        return res.status(200).json({msg:"Successfull",savedData});
    }
        catch (error) {  
         res.status(404).json(error);
        
    }
}

export const getall = async(req,res)=>{
    try {
        const userData= await User.find({status: 1});
        if(!userData){
            return res.status(404).json({msg:"User not found"});
        }
        res.status(200).json(userData);
        
    } catch (error) {
        res.status(404).json(error);   
    }
}

export const tauth = async(req , res , next)=>{
    try {
        if(req.headers){
            console.log(req.headers)
        }
        
    } catch (error) {

        
    }
}

export const getbyname = async(req,res)=>{
    try {
        
        const fname= req.params.fname;
        const userData= await User.find({ fname: fname }); 
        if(!userData){
            return res.status(404).json({msg:"User not exisr"})

        }
        res.status(200).json(userData);
        
        
    } catch (error) {
        console.log(error);
        res.status(404).json(error);
    }
}

export const getbyid = async(req,res)=>{
    try {
        const id= req.params.id;
        const userData = await User.findById(id);
        if(!userData){
            return res.status(404).json({msg:"User not found"});

        }
        res.status(200).json(userData);
        
    } catch (error) {
        res.status(404).json(error);
        
    }
}


export const update = async(req,res)=>{
    try {
        const id= req.params.id;
        const userData= await User.findById(id);
        if(!userData){
            return res.status(404).json({msg:"User not found"});
        }
        const updateData = await User.findByIdAndUpdate(id,req.body,{new:true});
        res.status(200).json({msg:"User Updated",updateData});
        
        
    } catch (error) {
        res.status(404).json({msg:"user not found"});
        
    }
}

export const deleteuser = async(req,res)=>{
    try {
        const id= req.params.id;
        const userData= await User.findById(id);
        if(!userData){
            return res.status(400).json({msg:"User not found"});

        }
        await User.findByIdAndDelete(id);
        res.status(200).json({msg:"User deleted"});
       
        
    } catch (error) {
        res.status(404).json({msg:"User not found"});
        
    }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract email and password from request body
    

    // Find the user in the database by email
    const user = await User.findOne({ email });
    if (!user) {
      // If no user is found, send an appropriate response
      return res.status(404).json({ success: false, msg: "Invalid Login" });
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Comparison error:", err);
        return res.status(500).json({ success: false, msg: "Server error" });
      }

      if (isMatch) {
        const token = setUser(user);
        
        // Password matches
        return res.status(200).json({ success: true, msg: "Login Successful", user, token });


      } else {
        // Password does not match
        return res.status(401).json({ success: false, msg: "Incorrect password" });
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    // Handle any other errors
    res.status(500).json({ success: false, msg: "Something went wrong" });
  
}


};

export const softdelete = async(req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id,{
            status: 0,
        }, {new : true});
        res.status(200).json({success : true,
            msg : "User Remove successfully",user
        })
        
        
    } catch (error) {
        res.status(200).json({msg:"Soft delete not perform"});
        
    }
}

export const restore = async(req,res)=>{
    try {
        const userData= await User.find({status : 0});
        if(!userData){
            return res.status(404).json({msg:"User not found"});
        }
        res.status(200).json(userData);
        
    } catch (error) {
        res.status(404).json(error);   
    }
}

export const backup = async(req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id,{
            status: 1,
        }, {new : true});
        res.status(200).json({success : true,
            msg : "User Restore successfully",user
        })
        
        
    } catch (error) {
        res.status(200).json({msg:"Soft delete not perform"});
        
    }
}


export const store_location = async(req,res)=>{
    try {
        const {latitude, longitude}  = req.body;
        if(!latitude || !longitude){
            return res.status(400).json({ message: "Location data is required" });
        }
        console.log("User Location:", latitude, longitude);
        const userLocation = { latitude, longitude };

        res.status(200).json({ message: "Location stored successfully", userLocation });

    } catch (error) {
        res.status(404).json(error);
        
    }
} 
