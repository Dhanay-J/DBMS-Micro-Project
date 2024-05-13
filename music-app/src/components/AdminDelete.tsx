import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { UserContext } from './UserContext';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setURL } from './reducer';


const ip = 'localhost';
const port = 30000;



function AdminDelete() {
  const [show, setShow] = useState(false);
  const user = useContext(UserContext);
  // const song = useSelector((state) => state.song);
 
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  
  const [songId, setSongID] = useState(0);
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState('');

  const [isAlbum, setIsAlbum] = useState(false);
  const [album, setAlbum] = useState("");
  const [albumId, setAlbumID] = useState(0);
  const [albums, setAlbums] = useState([]);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // dispatch(setURL(song));

    async function handleSubmit(e) {
        e.preventDefault();

        if(isAlbum){
          // console.log(album, albumId);
          if(!albumId){
            alert('Please Select an Album');
            return;
          }
           const res = await fetch(`http://${ip}:${port}/delete`, {
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
           const res = await fetch(`http://${ip}:${port}/delete`, {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  
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

        fetchSongs();
        fetchAlbums();

}

  function handleClose() {
    setTitle('');
    setUrl('');
    setSong('');
    setSongID(0);
    setIsAlbum(false);
    setAlbumID(0);
    setAlbum("");
    document.getElementsByTagName('form')[0].reset();
    setShow(false);
  }

  const handleShow = () => setShow(true);

  async function fetchSongs() {
    try {


      const response = await fetch(`http://${ip}:${port}/songs?Query=select * from music.songs`);
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

      }, [user]);
      let i = 0;
  return (
    < >

      <div className='' >

<div >
    <div className="container table-responsive-xl" >

    <table className='table table-primary' >
      <thead>
        <tr>
          <th>SongID</th>
          <th>Title</th>
          <th>ArtistID</th>
          <th>AlbumID</th>
          <th>Duration(seconds)</th>
          <th>Explicit</th>
          <th>URL</th>                                            </tr>

      </thead>
      {songs.map((song_, j)=>(
      <tbody>
        <tr>
          <td>{song_['SongID']}</td>
          <td>{song_['Title']}</td>
          <td>{song_['ArtistID']}</td>
          <td>{song_['AlbumID']}</td>
          <td>{song_['Duration']}</td>
          <td>{song_['Explicit']}</td>
          <td>{song_['URL']}</td>
        </tr>
      </tbody>
    ))}

    </table>

    </div>
</div>
      <Button className='p-2 m-2' variant="danger" onClick={handleShow} style={{width:120, position:'absolute', bottom:'0', right:'0' }} onMouseEnter={()=>{fetchSongs()}}>
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
                              <div >
                                <Dropdown.Menu key={i = i+1}>
                                    
                                    {songs.map((song_, j)=>(
                                        
                                        <Dropdown.Item key={j} onClick={(e)=>{
                                          
                                          setSong(song_['Title']);
                                          setSongID(songs[j]['SongID'])
                                          
                                        }}
                                        >{song_['Title']}
                                        
                                        </Dropdown.Item>
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

export default AdminDelete;