import SearchComponent from "./Search.tsx";
import { useState, useEffect } from "react";
import music from "../assets/music.jpg";

let data = {"rows":[]};
let songs = [];



async function fetchSongs() {
  try {
    const response = await fetch("http://localhost:3000/songs?Query=select a.name , al.title as album, s.url, s.title from artist a join songs s on a.artistid = s.artistid join albums al on s.albumid=al.albumid");
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

function gotoArtist(e){
  const artist = e.target.textContent;
  

}

function gotoAlbum(e){
  console.log(e.target.textContent)
}

function Songs() {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchedSongs = await fetchSongs();
        setSongs(fetchedSongs);
      } catch (err) {
        console.error(err);
        // setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(songs);
  return (
    <>
      <div className="p-2">Songs</div>
      {isLoading && <div>Loading songs...</div>}
      {error && <div>Error: {error}</div>}
      
      { (
        <div data-bs-spy="scroll" data-bs-target="#list-example" data-bs-offset={0} className="container" tabIndex={0}>
          {songs.map((song) => (
          <div className="card m-2 row" style={{alignItems:"center"}}>
              
              <div className="p-2">
                <div className="lead h5 px-3">{song[3]}</div>

                <div className="container">
                    <div className="px-0">
                      <img src={music} className="rounded" alt="" style={{height:120, width:100}}/>
                    </div>

                      <div className="card m-2" onClick={gotoArtist}>
                      <div className="text-secondary h5 px-4 artist">{song[0]}</div>
                      </div>                      
                      
                      <div className="card m-2 " onClick={gotoAlbum}>
                        <div className="h6 px-4 album">{song[1]}</div> 
                      </div>

                </div>
              </div>

            </div>
          ))}
        </div>
      )}
      <SearchComponent fact={"Search Songs"} />
    </>
  );
}

export default Songs;
