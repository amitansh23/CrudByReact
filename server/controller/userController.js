import User from "../model/userModel.js";


export const create = async(req,res)=>{
    try {
        const userData= new User(req.body);
        if(!userData){
            return res.status(404).json({msg:"User not found"});
        }
        const savedData= await userData.save();
        res.status(200).json(savedData);
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

export const getone = async(req,res)=>{
    try {
        // console.log("nbbhqbh");
        const fname= req.params.fname;
        // console.log(fname);
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

