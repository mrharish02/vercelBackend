import React, {useState } from 'react'
import './login.css'
import { Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const navigate = useNavigate()
  // async function userLogin(event) {
  //   event.preventDefault();
  //   if (!email && !password) {
  //     console.log('Email and password cannot be empty.');
  //     window.alert("Email and password cannot be empty!!!!!!!!");
  //     return;
  //   }
  //   else if(!email){
  //     console.log('Email cannot be empty.');
  //     window.alert("Email cannot be empty!!!!!!!!");
  //     return;
  //   }
  //   else if(!password){
  //     console.log('Password cannot be empty.');
  //     window.alert("Password cannot be empty!!!!!!!!");
  //     return;
  //   }

  //   try {
  //     const response = await fetch('http://localhost:3001/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email,
  //         password,
  //       }),
  //       credentials: 'include',
  //     });

  //     console.log('login request sent');
  //     const data = await response.json();
  //     console.log(data);

  //     if (data.status === 'success') {
  //       // window.location.hre = '/home'
  //       navigate('/home')
  //     }
  //     else if(data.status ==='invalid'){
  //       window.alert('Wrong password!!!!')
  //     }
  //     else if(data.status === 'nouser'){
  //       window.alert('Credentials not found!!!!!')
  //     }
  //   } catch (error) {
  //     console.error('API Request Error:', error);
  //   }
  // }

  async function userLogin(event) {
    event.preventDefault();

    if (!email && !password) {
      window.alert('Email and password cannot be empty!');
      return;
    } else if (!email) {
      window.alert('Email cannot be empty!');
      return;
    } else if (!password) {
      window.alert('Password cannot be empty!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/', {
        email,
        password,
      }, {
        withCredentials: true, // Include credentials (cookies) with the request
      });

      console.log('login request sent');
      const data = response.data;
      console.log(data);

      if (data.status === 'success') {
        navigate('/home');
      } else if (data.status === 'invalid') {
        window.alert('Wrong password!');
      } else if (data.status === 'nouser') {
        window.alert('Credentials not found!');
      }
    } catch (error) {
      console.error('API Request Error:', error);
    }
  }

  return (
    <>
        <div className="container">
                <form className='form' onSubmit={userLogin} >
                <div className="content"><span>Email</span><input value={email} onChange={(e)=>setEmail(e.target.value)} type='email' placeholder='Enter your email'/></div>
                <div className="content"><span>Password</span><input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' /></div>
                <div className="content"><button className="loginbutton">Log In</button></div>
                <div className="content"><span>New user, <Link className='link' to='/signup'>Sign Up</Link></span></div>
                </form>
            
        </div>
    </>
  )
}

export default Login