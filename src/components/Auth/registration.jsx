import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import './add.css'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'


const RegisterPage = () => {

   
    

    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
        address:"",
        phone: "",
        role: "user"
      });
    
      const [errors, setErrors] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
      });
      


      const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Validation Logic
        let error = "";
        if (name === "fname" || name === "lname") {
          if (/\s/.test(value)) {
            error = "Space is not allowed";
          } else if (/\d/.test(value)) {
            error = "Numbers are not allowed";
          }
        }
    
        if (name === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = "Invalid email format";
          }
        }
    
        if (name === "password") {
          // Password must be at least 8 characters, include a number and a special character
          const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          if (!passwordRegex.test(value)) {
            error =
              "Password must be at least 8 characters long and include a number and a special character";
          }
        }

        if (name === "phone") {
          const phoneRegex = /^[0-9]{10}$/;
          if (!phoneRegex.test(value)) {
            error = "Phone number must be 10 digits";
          }
        }

        if (name === "address" && value.trim() === "") {
          error = "Address cannot be empty";
        }



    
        // Update state and errors
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: error }));
      };
    
    
    
    

      


  
    const navigate = useNavigate();

   


    const submitForm = async(e) =>{
        e.preventDefault();
        

         await axios.post("http://localhost:8000/api/registration", formData)
        .then(res=>{
            toast.success(res.data.msg, 
                {position: "top-center", autoClose: 2000}
             )
             navigate('/');
        }).catch(err=>{
            console.log(err);
        })
    }




  return (
    <div className='addUser'>
    <Link to={'/'} > Back</Link>
    <h3>REGISTRATION PAGE</h3>
    <form className='addUserForm' onSubmit={submitForm}>
        <div className='inputGroup'>
            <label htmlFor='fname'>First Name</label>
            <input type='text' onChange={handleChange} id='fname' name='fname' placeholder='Enter your first name' autoComplete='off'/>
            {errors.fname && <p style={{ color: "red" }}>{errors.fname}</p>}
            
        </div>

        <div className='inputGroup'>
            <label htmlFor='lname'>Last Name</label>
            <input type='text'  onChange={handleChange} id='lname' name='lname' placeholder='Enter your last name' autoComplete='off'/>
            {errors.lname && <p style={{ color: "red" }}>{errors.lname}</p>}
            
        </div>
        <div className='inputGroup'>
            <label htmlFor='email'>Email</label>
            <input type='email' onChange={handleChange}  id='email' name='email' placeholder='Enter your Email' autoComplete='off'/>
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div className='inputGroup'>
            <label htmlFor='password'>Password</label>
            <input type='password' onChange={handleChange} id='password' name='password' placeholder='Enter your Password' autoComplete='off'/>
            {errors.password && (
            <p style={{ color: "red" }}>{errors.password}</p>)}
          
        </div>


        <div className="inputGroup">
          <label htmlFor="address">Address</label>
          <input type="text" onChange={handleChange} id="address" name="address" placeholder="Enter your Address" autoComplete="off" />
          {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
        </div>

        <div className="inputGroup">
          <label htmlFor="phone">Phone Number</label>
          <input type="text" onChange={handleChange} id="phone" name="phone" placeholder="Enter your Phone Number" autoComplete="off" />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
        </div>



        <div className='inputGroup'>
        <button
          type="submit"
          disabled={
            Object.values(errors).some((error) => error !== "") ||
            Object.values(formData).some((value) => value === "")
          }
        >
          Register
        </button>
        </div>

    </form>
      
    </div>
  )
}

export default RegisterPage


