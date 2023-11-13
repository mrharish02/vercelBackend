import React, { useState } from 'react'
import './signup.css'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const [name,setName] = useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const navigate = useNavigate()
  async function userRegister(event){
    event.preventDefault()

    if (!email && !password &&!name) {
      console.log('Name email and password cannot be empty.');
      window.alert("Name email and password cannot be empty!!!!!!!!");
      return;
    }
    else if(!email || !password || !name){
      console.log('No fields should be empty.');
      window.alert("No fields should be empty!!!!!!!!");
      return;
    }

    const response = await fetch('http://localhost:3001/register',{
      
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    const data = await response.json()
    if (data.status === 'usercreated') {
        window.alert('Account created successfully!!!!')
        navigate('/')
      }
      else if(data.status === 'emailpresentalready'){
        window.alert('Email is registered!!!!')
        return
      }
    console.log(data)
  }
  

  return (
    <>
        <div className="container">
            <form className='form' onSubmit={userRegister} >
                <div className="content"><span>Name</span><input type="text" name='name' placeholder='Enter your name' onChange={(e)=>setName(e.target.value)}/></div>
                <div className="content"><span>Email</span><input type="email" name='email' placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)}/></div>
                <div className="content"><span>Password</span><input type="password" name='password' onChange={(e)=>setPassword(e.target.value)}/></div>
                <div className="content"><button className="signinbutton">Sign Up</button></div>
                <div className="content"><span>Already user, <Link className='link' to='/'>Sign In</Link></span></div>
            </form>
            
        </div>
    </>
  )
}

export default Signup