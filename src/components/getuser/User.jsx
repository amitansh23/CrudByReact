import React, { useEffect, useState } from 'react'
import { Link  } from 'react-router-dom'
import './User.css'
import axios from 'axios'
import toast from 'react-hot-toast'






const User = () => {

  const [users , setUsers]= useState([]);

  const fetchData = async()=>{
    const res = await axios.get('http://localhost:8000/api/getall')
    setUsers(res.data)
  }
  

  useEffect(()=>{
    fetchData();
},[])

  const DELETE = async(userId)=>{
    await axios.patch(`http://localhost:8000/api/deleteuser/${userId}`)
    .then((res)=>{
      setUsers((prevUser)=> prevUser.filter((user)=> user._id !== userId))
      toast.success(res.data.msg, {positioin: 'top-center'})

    }).catch((error) =>{
      console.log(error);
    })
   


  }
  return (
    <div className='userTable'>
    <Link to={'/add'} className='addButton'>Add User</Link>
    <table border={1} cellPadding={15} cellSpacing={5}> 
        <thead>
            <tr>
                <th>S.NO.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        {
          users.map((user, index)=>(
            <tr key={index}>
                <td>{index+1}</td>
                <td>{user.fname} {user.lname}</td>
                <td>{user.email}</td>
                <td className='actionButton'>
                  <button onClick={()=>{
                    DELETE(user._id)
                  }}>DELETE</button>
                  <Link to={'/edit/'+user._id}>EDIT</Link>
                </td>
            </tr>
          ))

                  
        }
           
        </tbody>
    </table>
    
      
    </div>
  )
}

export default User
