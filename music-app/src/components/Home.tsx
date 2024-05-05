import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import AddSong from "./AddSong";
import DeleteSong from "./DeleteSong";

function Home() {

    const user = useContext(UserContext);
    const isArtist = user['UserType']==='artist' ? true : false;

    const navigate = useNavigate();

    useEffect(() => {
    if(!user['Login']){ 
        alert("Redirecting to login");
        navigate('/login', { replace: true });
    }
    }, []);

  return (
    <div>
      <div className="display-2">Home Page of {user['Username']}</div>
      {
      isArtist?
        <div>
          <AddSong/>
          <DeleteSong/>
        </div>
      
      :''
      }
    </div>
  )
}

export default Home
