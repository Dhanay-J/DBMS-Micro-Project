
import { useEffect, useState } from "react";
import SearchComponent from "./Search";
import { MusicContext } from "./Songs";
import Player from "./Player";


// Context provider component

async function fetchArtist() {
  try {
    const response = await fetch("http://localhost:3000/songs?Query=SELECT a.artistid, al.albumid, s.url, s.title, a.name, al.title ,s.songid FROM artist a inner JOIN albums al ON a.artistid = al.artistid join songs s on s.albumid = al.albumid  order by a.artistid , al.albumid");
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

function Artists() {
  const [artist, setArtist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

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
  console.log(artist);

  const groupedData = artist.reduce((acc, row) => {
    const artistId = row[0];
    acc[artistId] = acc[artistId] || { artist: row.slice(4, 6), songs: [] };
    acc[artistId].songs.push(row.slice(1, 4)); // Song data (albumId, songId, title)
    return acc;
  }, []);

  let i=0;
  let j=0;
  return (
    <>
    <div className="display-1 ">
      Artists
    </div>
    <div>
      {Object.entries(groupedData).map(([artistId, { artist, songs }]) => (
        <div key={i++} className="card mb-3">
          <div className="card-header">{`Artist: ${artist[0]}`}</div>
          <ul className="list-group list-group-flush">
            {songs.map((song) => (
              <li key={j++} className="list-group-item m-2" onClick={()=>{setUrl(song[1])}}>
                {song[2]} - Album : {artist[1]}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
      <MusicContext.Provider value={url}>
        <Player url={url}/>
      </MusicContext.Provider>
    </>
  );
}

export default Artists;