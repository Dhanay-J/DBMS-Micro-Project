import React, { useContext, useState } from 'react'
import { UserContext } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { clearURL } from './reducer';
import { useDispatch } from 'react-redux';

const ip = 'localhost';
const port = 30000;

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    dispatch(clearURL({}))

    const user = useContext(UserContext);


    async function handleSubmit(e) {
        e.preventDefault();

        try{
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
        })
    
        // console.log(" Response is : "+res.json());
        const data = await res.json();
        
        if(data['success']==true){
            user['Login'] = true;
            user['UserType'] = data['user']['UserType'];
            user['Username'] = data['user']['Username'];
            user['UserID'] = data['user']['UserID'];
            user['Email'] = data['user']['Email'];
            navigate('/', { replace: true });
        }
        else{
            alert("Invalid Email or Password");
        }
        }catch(e){
          alert("Server Error : Please try again later"); 
        }
        // console.log(email, password);
    // console.log(user);  
  }

  return (
    <div>

      <div className="container h-100 d-flex justify-content-center align-items-center">
        <div className="card shadow-sm border-0 p-4 bg-white rounded">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="text" className="form-control" id="email" placeholder="Enter Email" onChange={e => setEmail(e.target.value)} required/>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Enter Password" onChange={e => setPassword(e.target.value)} required/>
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
        <div className="mt-3 text-center">
          <a href="/register" className="btn btn-link">Register</a>
        </div>
      </div>
    </div>

  )
}

export default Login;