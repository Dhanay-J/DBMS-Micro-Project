import { useContext, useEffect, useState } from "react";
import SearchComponent from "./Search";
import music from "../assets/music.jpg";
import { MusicContext } from "./Songs";
import Player from "./Player";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

const ip = 'localhost';
const port = 30000;


// Context provider component

async function fetchPlaylist() {
  try {
    const response = await fetch(`http://${ip}:${port}/songs?Query=SELECT p.playlistid, s.title, s.songid, a.artistid, a.name,s.url FROM playlist p INNER JOIN playsong ps ON p.playlistid = ps.playlists_id INNER JOIN songs s ON ps.song_id = s.songid inner JOIN artist a on s.artistid = a.artistid order by p.playlistid`);
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

function PlayLists() {
  const [playlists, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      if(!user['Login']){ 
        alert("Redirecting to login");
        navigate('/login', { replace: true });
      }

      try {
        const fetchedPlaylist = await fetchPlaylist();
        setPlaylist(fetchedPlaylist.rows || fetchedPlaylist); // Handle potential API response format variations
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  // const [url, setUrl] = useState("");
  
  let i = 0, j=0;


  const groupedData = playlists.reduce((acc, row) => {
    const playlistId = row['playlistid'];
    acc[playlistId] = acc[playlistId] || [];
    acc[playlistId].push(Object.assign({}, row, Object.keys(row).slice(0, 2))); // Remove playlist ID from song data
    return acc;
  }, {});
  

  const [url, setUrl] = useState("");
  
  // console.log(user);
  return (
    <>
    <div className="display-1 ">
      Playlist
    </div>
    <div>
      {Object.entries(groupedData).map(([playlistId, songs]) => (
        <div className="card p-2 m-2 playlist-group" key={playlistId}>
          <h2>Playlist : {playlistId}</h2>
          <ul className="list-group">
            {songs.map((song) => (
              <li className="list-group-item song-title" key={`${song['url']}_${playlistId}`} onClick={()=>
                setUrl(song['url'])
              }>
                {song['title']}
              
              </li>
              
            ))}
          </ul>
        </div>
      ))}
      <div>

      <button className='btn btn-success fixed-bottom m-2 ' style={{width:40}} onClick={()=>{
        alert("Add playlist");
      }}>+</button>
      </div>
    </div>
    <MusicContext.Provider value={url}>
      <Player url={url}/>
    </MusicContext.Provider>
    </>
  )
}

export default PlayLists;