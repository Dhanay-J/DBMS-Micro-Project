import { useEffect, useState } from "react";
import SearchComponent from "./Search";
import music from "../assets/music.jpg";
import { MusicContext } from "./Songs";
import Player from "./Player";


// Context provider component

async function fetchPlaylist() {
  try {
    const response = await fetch("http://localhost:3000/songs?Query=SELECT p.playlistid, s.title, s.songid, a.artistid, a.name,s.url FROM playlists p INNER JOIN playlists_song ps ON p.playlistid = ps.playlists_id INNER JOIN songs s ON ps.song_id = s.songid inner JOIN artist a on s.artistid = a.artistid order by p.playlistid");
    if (!response.ok) {
      throw new Error(`Error fetching songs: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching songs:", error);
    // Handle error gracefully, e.g., display an error message to the user
    return [];
  }
}

function PlayLists() {
  const [playlist, setPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

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
  
  let i = 0;

  const groupedData = playlist.reduce((acc, row) => {
    const playlistId = row[0];
    acc[playlistId] = acc[playlistId] || [];
    acc[playlistId].push(row.slice(1)); // Remove playlist ID from song data
    return acc;
  }, {});

  const [url, setUrl] = useState("");

  return (
    <>
    <div className="display-1 ">
      Playlist
    </div>
    <div>
      {Object.entries(groupedData).map(([playlistId, songs]) => (
        <div key={playlistId} className="card p-2 m-2 playlist-group">
          <h2>Playlist : {playlistId}</h2>
          <ul className="list-group">
            {songs.map((song) => (
              <li key={song[1]} className="list-group-item song-title" onClick={()=>setUrl(song[4])}>{song[0]}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <MusicContext.Provider value={url}>
      <Player url={url}/>
    </MusicContext.Provider>
    </>
  )
}

export default PlayLists;