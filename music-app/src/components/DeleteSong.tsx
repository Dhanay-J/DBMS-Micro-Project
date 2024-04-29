import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { UserContext } from './UserContext';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const ip = 'localhost';
const port = 30000;



function DeleteSong() {
  const [show, setShow] = useState(false);
  const user = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  
  const [song, setSong] = useState("");
  const [songId, setSongID] = useState(0);
  const [songs, setSongs] = useState([]);

  const [isAlbum, setIsAlbum] = useState(false);
  const [album, setAlbum] = useState("");
  const [albumId, setAlbumID] = useState(0);
  const [albums, setAlbums] = useState([]);

  const navigate = useNavigate();


    async function handleSubmit(e) {
        e.preventDefault();

        if(isAlbum){
          // console.log(album, albumId);
          if(!albumId){
            alert('Please Select an Album');
            return;
          }
           const res = await fetch(`http://${ip}:${port}/deleteAlbum`, {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  UserID: user['UserID'],
                  AlbumID: albumId
                  
              }),
          });
          const data = await res.json();
            if(data['success']){
                alert('Album Removed Successfully');
                handleClose(); // Close Modal After Song Removal
            }else{
                alert('Album Removal Failed');
            }

        }else{
          // console.log(song, songId);
          if(!songId){
            alert('Please Select a Song');
            return;
          }
           const res = await fetch(`http://${ip}:${port}/deleteSong`, {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  UserID: user['UserID'],
                  SongID: songId
              }),
          });
          const data = await res.json();
          console.log("Data ", data);

            if(data['success']){
                alert('Song Removed Successfully');
                handleClose(); // Close Modal After Song Removal
            }else{
                alert('Song Removal Failed');
            }
        }

}

  function handleClose() {
    setTitle('');
    setUrl('');
    setSongID(0);
    setSong("");
    setIsAlbum(false);
    setAlbumID(0);
    setAlbum("");
    document.getElementsByTagName('form')[0].reset();
    setShow(false);
  }

  const handleShow = () => setShow(true);

  async function fetchSongs() {
    try {


      const response = await fetch(`http://${ip}:${port}/songs?Query=select s.title ,s.songid, s.ArtistID from songs s where s.ArtistID in (SELECT a.ArtistID FROM music.artistuser a where a.UserID=${user['UserID']})`);
      if (!response.ok) {
        throw new Error(`Error fetching songs: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching songs:", error);
      // Handle error gracefully, e.g., display an error message to the user
      return [];
    }
  }

  async function fetchAlbums() {
    try {


      const response = await fetch(`http://${ip}:${port}/songs?Query=SELECT Title , AlbumID, ArtistID FROM music.albums al where al.ArtistID in (SELECT a.ArtistID FROM music.artistuser a where a.UserID=${user['UserID']})`);
      if (!response.ok) {
        throw new Error(`Error fetching songs: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching songs:", error);
      // Handle error gracefully, e.g., display an error message to the user
      return [];
    }
  }

    useEffect(() => {
        const fetchData = async () => {
    
          if(!user['Login']){ 
            alert("Redirecting to login");
            navigate('/login', { replace: true });
          }
    
          try {
            const fetched_songs = await fetchSongs();
            if(fetched_songs){
                setSongs(Array.isArray(fetched_songs.rows) ? fetched_songs.rows : fetched_songs);
            }

            const fetched_albums = await fetchAlbums();
            
            if(fetched_albums){
                setAlbums(Array.isArray(fetched_albums.rows) ? fetched_albums.rows : fetched_albums);
            }
            // setAlbums(fetched_albums.rows || fetched_albums); // Handle potential API response format variations
          } catch (err) {
            // Cannot Fetch Albums
            console.log(err);
        }
        };
    
        fetchData();
      }, [user, album, song]);
      let i = 0;
  return (
    < >

      <div className='fixed-bottom m-2'>

      <Button variant="danger" onClick={handleShow} style={{width:120, position:'absolute', bottom:'0', right:'0' }}>
        Delete Song
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Song</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
        <form onSubmit={handleSubmit}>
                     <div className='m-2 '>
                        <div className='mb-3 p-3'>
                          <Form.Check // prettier-ignore
                              type="switch"
                              id="isalbum"
                              label="Delete Album"
                              onChange={(e)=>{
                              setIsAlbum(e.target.checked);
                          }}/>

                      </div>


                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                {isAlbum ? 'Your Albums': 'Your Songs'}
                            </Dropdown.Toggle>
                            
                            {isAlbum ?(
                              <div>
                                <Dropdown.Menu key={i = i+1}>
                                    
                                    {albums.map((album_, j)=>(
                                        
                                        <Dropdown.Item key={j} onClick={(e)=>{
                                          
                                          setAlbum(album_['Title']);
                                          setAlbumID(albums[j]['AlbumID'])
                                          
                                        }}
                                        >{album_['Title']}</Dropdown.Item>
                                    ))
                                    }                                
                                </Dropdown.Menu>
                              </div>
                            ):(
                              <div>
                                <Dropdown.Menu key={i = i+1}>
                                    
                                    {songs.map((song_, j)=>(
                                        
                                        <Dropdown.Item key={j} onClick={(e)=>{
                                          
                                          setSong(song_['title']);
                                          setSongID(songs[j]['songid'])
                                          
                                        }}
                                        >{song_['title']}</Dropdown.Item>
                                    ))
                                    }                                
                                </Dropdown.Menu>
                              </div>
                              )}
                            </Dropdown>

                     </div>
                <button className='btn btn-danger' >Delete {isAlbum ? 'Album' : 'Song'}</button>
            </form>


            {isAlbum ? 
                (!album ?
                    <div className='p-2' >Album Not Selected</div>
                    :
                  <div className='p-2'>Selected Album: {album}</div>
                )
                :
                (!song ?
                <div className='p-2' >Song Not Selected</div>
                :
                <div className='p-2'>Selected Song: {song}</div>
                )
              }

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  );
}

export default DeleteSong;