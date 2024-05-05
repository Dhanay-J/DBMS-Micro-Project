import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { clearURL } from './reducer';
import { useDispatch } from 'react-redux';
import { Form } from 'react-bootstrap';

const ip = 'localhost';
const port = 30000;

function Login() {
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState(''); // [false, true, false
    const [password, setPassword] = useState('');
    const [artist , setArtist] = useState(false); // [false, true, false
    const [userTier, setUserTier] = useState('Free'); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    const navigate = useNavigate();
    const dispatch = useDispatch();

    dispatch(clearURL({}))

    const user = useContext(UserContext);
  

    useEffect(() => {
    if(user['Login']){ 
        alert("Redirecting to Home");
        navigate('/', { replace: true });
    }
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(username,email, password, artist, userTier);

       
      const res = await fetch(`http://${ip}:${port}/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        artist: artist,
        userTier: userTier,

      }),
    }
  )

    // console.log(" Response is : "+res.json());
    const data = await res.json();

    if(data['success']==true){
        alert("Registration Successful");
        navigate('/login', { replace: true });
    }
    else{
        alert("Registration Failed");
    }
    // console.log(user);  
  }

  return (

    <div className='d-flex vh-100 justify-content-center align-items-center ' style={{zIndex:'5'}}>
        <div className='p-3 bg-white border border-dark rounded'>
            <form onSubmit={handleSubmit}>

                <div className='mb-3'>
                    <label >User Name</label>
                    <input type="text" placeholder='Enter User Name' className='form-control' onChange={e => setUserName(e.target.value)}/>
                </div>
                
                <div className='mb-3'>
                    <label >Email</label>
                    <input type="email" placeholder='Enter Email' className='form-control' onChange={e => setEmail(e.target.value)}/>
                </div>

                <div className='mb-3'>
                    <label >Password</label>
                    <input type="password" placeholder='Enter Password' className='form-control' onChange={e => setPassword(e.target.value)}/>
                </div>

                <Form.Check // prettier-ignore
                        type="switch"
                        id="userType"
                        label="Artist"
                    onChange={(e)=>{setArtist(e.target.checked)}}/>
                <Form.Check // prettier-ignore
                        type="switch"
                        id="userTier"
                        label="Priemium Subscriber"
                    onChange={(e)=>{
                        {e.target.checked ? setUserTier('Premium') : setUserTier('Free')}
                        // setUserTier()
                        
                        }}/>

                <button className='btn btn-success m-2'>Register</button>
            </form>
        </div>
    </div>
  )
}

export default Login;