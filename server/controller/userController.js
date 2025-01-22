import User from "../model/userModel.js";


export const create = async(req,res)=>{
    try {
        const userData= new User(req.body);
        if(!userData){
            return res.status(404).json({msg:"User not found"});
        }
        const savedData= await userData.save();
        
        return res.status(200).json({msg:"User Create Successfully",savedData});
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
  


  
