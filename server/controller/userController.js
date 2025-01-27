// import { response } from "express";
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

export const getall = async(req,res)=>{
    try {
        const userData= await User.find();
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
            return res.status(404).json({msg:"user not exisr"})

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
            return res.status(404).json({msg:"user not found"});
        }
        const updateData = await User.findByIdAndUpdate(id,req.body,{new:true});
        res.status(200).json(updateData);
        
        
    } catch (error) {
        res.status(404).json({msg:"user not found"});
        
    }
}

export const deleteuser = async(req,res)=>{
    try {
        const id= req.params.id;
        const userData= await User.findById(id);
        if(!userData){
            return res.status(400).json({msg:"user not found"});

        }
        await User.findByIdAndDelete(id);
        res.status(200).json({msg:"user deleted"});

        
    } catch (error) {
        res.status(404).json({msg:"user not found"});
        
    }
}

// export const login =  async(req,res)=>{
//     try {
//         const {email, password}= req.body;
//         console.log(req.body);
//         const user = await User.findOne({email : email});
//             if(user){
//                 bcrypt.compare(password, String(User.password), function(err, res) {
//                     if(err) {
//                         console.log('Comparison error: ', err);
//                     }
//                     // res.json(user);
//                     if(res){
//                    return res.status(200).json({msg:"Login Successful", user});
//                     //  console.log(user, 'ss');
//                     }
//                 })
                
//             } 
            
//                 }catch(error){
//                     console.error(error);
//                     res.status(400).json({success: false, msg:"Invalid credentials"});
//                 }}
            
            

            
                


export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract email and password from request body
    

    // Find the user in the database by email
    const user = await User.findOne({ email });
    if (!user) {
      // If no user is found, send an appropriate response
      return res.status(404).json({ success: false, msg: "User does not exist" });
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
