import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const ip = 'localhost';
const port = 30000;



function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const user = useContext(UserContext);

  

    async function handleSubmit(e) {
        e.preventDefault();
        // console.log(email, password);
      const res = await fetch(`http://${ip}:${port}/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }
  )

    // console.log(" Response is : "+res.json());
    const data = await res.json();
    

    if(data['success']==true){
       user['Login'] = true;
        user['UserType'] = data['user']['UserType'];
        user['Username'] = data['user']['Username'];
        user['Email'] = data['user']['Email'];
        navigate('/', { replace: true });
    }
    else{
        alert("Invalid Email or Password");
    }
    // console.log(user);  
  }

  return (

    <div className='d-flex vh-100 justify-content-center align-items-center '>
        <div className='p-3 bg-white border border-dark rounded'>
            <form onSubmit={handleSubmit}>

                <div className='mb-3'>
                    <label >Email</label>
                    <input type="email" placeholder='Enter Email' className='form-control' onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className='mb-3'>
                    <label >Password</label>
                    <input type="password" placeholder='Enter Password' className='form-control' onChange={e => setPassword(e.target.value)}/>
                </div>

                <button className='btn btn-success'>Login</button>
            </form>
        </div>
    </div>
  )
}

export default Login;