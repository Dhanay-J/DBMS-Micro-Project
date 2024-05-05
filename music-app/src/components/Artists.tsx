
import { useContext, useEffect, useState } from "react";
import SearchComponent from "./Search";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import AddSong from "./AddSong";
import 'bootstrap/dist/css/bootstrap.min.css';
import DeleteSong from "./DeleteSong";
import { useDispatch } from 'react-redux';
import { setURL } from './reducer';


// Context provider component
const ip = 'localhost';
const port = 30000;

async function fetchArtist() {
  try {
    const songs = await fetch(`http://${ip}:${port}/songs?Query=select distinct s.title,a.name, s.url,s.songid, a.artistid , al.Title as albumt from songs s join artist a on a.ArtistID = s.ArtistID join albums al on s.AlbumID = al.AlbumID  order by a.ArtistID`);
    if (!songs.ok) {
      throw new Error(`Error fetching songs: ${songs.statusText}`);
    }
    const data = await songs.json();
    return data;
    
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

function Artists() {
  const [artist, setArtist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useContext(UserContext);
  const dispatch = useDispatch();


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
        const fetchedArtist = await fetchArtist();
        setArtist(fetchedArtist.rows || fetchedArtist); // Handle potential API response format variations
      } catch (err) {
        console.error(err);
        setError(err.message);
        alert(error)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const groupedData = artist.reduce((acc, row) => {
    const artistId = row['artistid'];
    acc[artistId] = acc[artistId] || { artist: Object.assign({}, row, Object.keys(row).slice(4, 6)), songs: [] };
    acc[artistId].songs.push(Object.assign({}, row, Object.keys(row).slice(1, 4))); // Song data (albumId, songId, title)
    return acc;
  }, []);

  let i=0;
  let j=0;

  const isArtist = user['UserType']==='artist' ? true : false;
  // groupedData.forEach((s)=>{console.log(s)});
  
  return (
    <>
    <div className="display-1 ">
      Artists
    </div>
    <div>
      {Object.entries(groupedData).map(([artistId, { artist, songs }]) => (
        <div key={i++} className="card mb-3">
          <div className="card-header">{`Artist : ${artist['name']}`}</div>
          <ul className="list-group list-group-flush">
            {songs.map((song) => (
              <li key={j++} className="list-group-item m-2 title" onClick={()=>{
                dispatch(setURL({url:song['url'], position:0}))
              }}>
                Song - {song['title']}
                <h6>Album : {song['albumt']}</h6>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {
      isArtist?
        <div>
          <AddSong/>
          <DeleteSong/>
        </div>
      
      :''
      }

    </div>
      
    </>
  );
}

export default Artists;