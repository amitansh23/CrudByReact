import React, { useEffect, useState } from 'react'
import { Link  } from 'react-router-dom'
import './User.css'
import axios from 'axios'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'


const User = () => {

  
  const [user, setUser] = useState(null);
  const [users , setUsers]= useState([]);
  const [search, setSearch] = useState('');

  const [count, setCount] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchData = async(limit, query)=>{
    const token = localStorage.getItem('token');
    
    // const res = await axios.get('http://localhost:8000/api/getall',{ headers : {
    //   'auth': token}})
    // setUsers(res.data)

    const res = await axios.get(`http://localhost:8000/api/getlimiteddata?count=${limit}&search=${query}`,{ headers : {
      'auth': token}})
    setUsers(res?.data?.userData);
    setTotal(res?.data?.total);
    
  }

  const handlenext=()=>{
    setCount(count+5)  
  }

  const handleSearch = (e) =>{
    const query = e.target.value.toLowerCase();
    setSearch(query);
    fetchData(5 , query);
  };

  
  

  useEffect(()=>{
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));

    }
    fetchData(count, search);
},[count, search])

  const DELETE = async(userId)=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed){
        perdelete(userId) 
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
      
    });

   
  }

  const perdelete = async(userId)=>{
    await axios.patch(`http://localhost:8000/api/deleteuser/${userId}`)
    .then((res)=>{
      setUsers((prevUser)=> prevUser.filter((user)=> user._id !== userId))
      toast.success(res.data.msg, {positioin: 'top-center'})
      setTotal((prevTotal)=> prevTotal - 1);


      // fetchData(count, search);

    }).catch((error) =>{
      console.log(error);
    })
  }

  const SOFTDELETE = async(userId)=>{
    await axios.put(`http://localhost:8000/api/softdelete/${userId}`)
    .then((res)=>{
      setUsers((prevUser)=> prevUser.filter((user)=> user._id !== userId))
      toast.success(res.data.msg, {position: 'top-center'})
    })
  }
  
  return (
   
    <div className='userTable'>
    <p><strong>Total Items:</strong> {total}</p>    
    <h2>{user ? `${user.fname} ${user.lname}` : ""}</h2>
    <Link to={'/add'} className='addButton'>Add User</Link>
    <Link to={'/restore'}  className='addButton'>RESTORE</Link>
    
            <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={handleSearch}
            />

    

    <table border={1} cellPadding={15} cellSpacing={8}> 
        <thead>
            <tr>
                <th>S.NO.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
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
                <td>{user.role === 1 ? 'Admin' : user.role === 0 ? 'SuperAdmin' : 'User'}</td>
                <td className='actionButton'>
                  <button onClick={()=>{
                    DELETE(user._id)
                  }}>DELETE</button>


                  <button onClick={()=>{
                    SOFTDELETE(user._id)
                  }}> REMOVE </button>




                  <Link to={'/edit/'+user._id}>EDIT</Link>
                  
                  
                </td>
            </tr>
          ))

                  
        }
           
        </tbody>
    </table>
    <button className='addButton'  onClick={handlenext}>Next</button>
      
    </div>
  )
}

export default User
