import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import AdminDelete from "./AdminDelete";

function Admin() {

    const user = useContext(UserContext);
    const isAdmin = user['UserType'].trim()==='admin' ? true : false;

    const navigate = useNavigate();

    useEffect(() => {
    if(!user['Login']){ 
        alert("Redirecting to login");
        navigate('/login', { replace: true });
    }
    }, []);

  return (
    <div>
      <div className="display-2">Admin Page {user['Username']}</div>
      {
      isAdmin?
        <div>
          <AdminDelete/>
        </div>
      
      :''
      }
    </div>
  )
}

export default Admin
