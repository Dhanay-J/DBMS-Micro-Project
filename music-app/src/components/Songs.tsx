import SearchComponent from "./Search.tsx";
import { useState, useEffect , useContext} from "react";
import music from "../assets/music.jpg";
import { UserContext } from "./UserContext.tsx";
import { useNavigate } from "react-router-dom";
import { setURL, setPlaylistData } from './reducer';
import { useDispatch, useSelector } from 'react-redux';
import AddPlaylist from './AddPlaylist';
import DeletePlaylist from "./DeletePlaylist.tsx";



// eslint-disable-next-line react-hooks/rules-of-hooks


// let data = {"rows":[]};
// let songs = [];
const ip = 'localhost';
const port = 30000;

async function fetchSongs() {
  try {
    const response = await fetch(`http://${ip}:${port}/songs?Query=select a.name , al.title as album, s.url, s.title ,s.duration,s.songid, s.likes, s.dislikes from artist a join songs s on a.artistid = s.artistid join albums al on s.albumid=al.albumid`);
    if (!response.ok) {
      throw new Error(`Error fetching songs: ${response.statusText}`);
    }
    const data = await response.json();




    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching songs:", error);
    // Handle error gracefully, e.g., display an error message to the user
    return [];
  }
}








function convertSecondstoTime(t=0) {

  const dateObj = new Date(t * 1000);
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getSeconds();
  const timeString = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');

  return timeString;
}





function Songs() {


  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const user = useContext(UserContext);


  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const {song} = useSelector((state)=> state.song)

  const fetchPlaylistsCount = async () => {

    try {
      // console.log("YYYYY",user['UserID']);
      const response = await fetch(`http://${ip}:${port}/numberofplaylists`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          UserID: user['UserID'],
        }), // body data type must match "Content-Type" header
      });
      const data = await response.json();
      // console.log(data.count);
      dispatch(setPlaylistData(data));

    } catch (error) {
      console.error("Error fetching songs:", error);
      // Handle error gracefully, e.g., display an error message to the user
      return [];
    }
  };

  async function setLike(song) {

    try {
      const response = await fetch(`http://${ip}:${port}/like`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          songid: song['songid'],
          userid: user['UserID']
        }), // body data type must match "Content-Type" header
      });
      const data = await response.json();
      document.getElementById(`likes_${song['songid']}`).innerHTML = "Likes : " + data['likes'];
      // console.log(data['likes']);
      // return response.json(); 
    } catch (error) {
      console.error("Error fetching songs:", error);
      // Handle error gracefully, e.g., display an error message to the user
      return 0;
    }
  }

  
async function setDislike(song) {

  try {
    const response = await fetch(`http://${ip}:${port}/dislike`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        songid: song['songid'],
        userid: user['UserID']
      }), // body data type must match "Content-Type" header
    });
    const data = await response.json();
    document.getElementById(`dislikes_${song['songid']}`).innerHTML = "Dislikes : " + data['dislikes'];
    // console.log(data['likes']);
    // return response.json(); 
  } catch (error) {
    console.error("Error fetching songs:", error);
    // Handle error gracefully, e.g., display an error message to the user
    return 0;
  }
}


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      if(!user['Login']){ 
        alert("Redirecting to login");
        navigate('/login', { replace: true });
      }

      try {
        const fetchedSongs = await fetchSongs();
        setSongs(fetchedSongs.rows || fetchedSongs); // Handle potential API response format variations
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchPlaylistsCount();
  }, []);

  

  // const [url, setUrl] = useState('');

  // songs.forEach((s)=>{console.log(s)});

  return (
    <>
      <div className="p-2">
      <div className="display-1 ">
      Songs
    </div>
  {isLoading && <div>Loading songs...</div>}
  {error && <div>Error: {error}</div>}

  {songs.length > 0 && (
    <div data-bs-spy="scroll" data-bs-target="#song-list" data-bs-offset={0} className="container" tabIndex={0}>
      {songs.map((song) => (

        // console.log(song);
        // {};

        <div className="card m-2 row" key={song['songid']}>
          <h3 className="card-title mt-2" onClick={() => {
            dispatch(setURL(song))
          }}>
            {song['title']}
          </h3> {/* Use h3 for song title */}
          <div className="row vol-ctr d-flex justify-content-around">
            <div className="col ml ms-2">
                  <img src={music} alt="" style={{ height: 120, width: 100 }} className="rounded float-start"  onClick={() => {
                    ''
                  }}/>
            </div>
            <div className="col-sm-7 mb-5">
              <div className="card song-info">
                <div className="card-body">
                  <h5 className="card-title artist-name" onClick={() => {}}>
                    {song['name']}
                  </h5>
                  <h5 className="card-text album-name" onClick={() => {}}>
                    {song['album']}
                  </h5>
                  

                  <h5 className="card-text">
                    Duration: {convertSecondstoTime(song['duration'])}
                  </h5>

                  <div className="row vol-ctr d-flex justify-content-around">
                    
                    <div className="col ml ms-2 like m-4">
                      <h5 id={"likes_"+song['songid']}> Likes : {song['likes']}</h5>
                      <button type="button" className="btn btn-primary" onClick={()=>{
                        setLike(song);

                      }}>Like</button> 
                    </div>

                    <div className="col ml ms-2 dislike m-4" >
                      <h5 id={"dislikes_"+song['songid']}>Dislikes : {song['dislikes']}</h5>
                      <button type="button" className="btn btn-primary" onClick={()=>{
                        setDislike(song);
                      }}>Dislike</button>
                    </div>

                    < AddPlaylist/>
                    <DeletePlaylist/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}


    </div>
  )}
  {/* <SearchComponent fact={"Search Songs"} /> */}
  
  </div>
    
    </>
  );
}

export default Songs;
