
import { useContext, useEffect, useState } from "react";
import SearchComponent from "./Search";
import { MusicContext } from "./Songs";
import Player from "./Player";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";


// Context provider component
const ip = 'localhost';
const port = 30000;

async function fetchArtist() {
  try {
    // const album_title = await fetch("http://localhost:3000/songs?Query=select a.name,al.title from ALBUMS al join ARTIST a on a.ARTISTID = al.ARTISTID;");
    const songs = await fetch(`http://${ip}:${port}/songs?Query=select s.title,a.name,s.url, a.artistid , al.Title as albumt from songs s join artist a on s.ARTISTID = a.ARTISTID join albums al on al.ArtistID = a.ArtistID order by a.ARTISTID`);
    // if (!album_title.ok) {
    //   throw new Error(`Error fetching songs: ${album_title.statusText}`);
    // }
    if (!songs.ok) {
      throw new Error(`Error fetching songs: ${songs.statusText}`);
    }
    const data1 = await songs.json();
    // console.log(data1);
    return data1;
    // const data2 = await album_title.json();
    // console.log(data2);
    // return data2;
  } catch (error) {
    console.error("Error fetching songs:", error);
    // Handle error gracefully, e.g., display an error message to the user
    return [];
  }
}

function Artists() {
  const [artist, setArtist] = useState([]);
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
        const fetchedArtist = await fetchArtist();
        setArtist(fetchedArtist.rows || fetchedArtist); // Handle potential API response format variations
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
  
  const [url, setUrl] = useState("");
  // console.log(artist);

  const groupedData = artist.reduce((acc, row) => {
    const artistId = row['artistid'];
    acc[artistId] = acc[artistId] || { artist: Object.assign({}, row, Object.keys(row).slice(4, 6)), songs: [] };
    acc[artistId].songs.push(Object.assign({}, row, Object.keys(row).slice(1, 4))); // Song data (albumId, songId, title)
    return acc;
  }, []);

  let i=0;
  let j=0;

  let isArtist = user['UserType']==='artist' ? true : false;
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
              <li key={j++} className="list-group-item m-2 title" onClick={()=>{setUrl(song['url'])}}>
                Song - {song['title']}
                <h6>Album : {artist['albumt']}</h6>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {
      isArtist?
      <div>

      <button className='btn btn-primary fixed-bottom m-2 ' style={{width:40}} onClick={
        ()=>{
          alert("Add Song");
        }
      
      }>+</button>
      </div>
      :''
      }

    </div>
      <MusicContext.Provider value={url}>
        <Player url={url}/>
      </MusicContext.Provider>
    </>
  );
}

export default Artists;