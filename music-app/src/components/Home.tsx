import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

function Home() {

    const user = useContext(UserContext);
  
    const navigate = useNavigate();

    useEffect(() => {
    if(!user['Login']){ 
        alert("Redirecting to login");
        navigate('/login', { replace: true });
    }
    }, []);

  return (
    <div className="display-2">Home Page of {user['Username']}</div>
  )
}

export default Home
