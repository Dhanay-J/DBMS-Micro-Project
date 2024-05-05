import { useContext, useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPlaylistData } from './reducer';



const ip = 'localhost';
const port = 30000;



function DeletePlaylist() {
  const [show, setShow] = useState(false);
  const user = useContext(UserContext);
  const [name, setName] = useState('');
  const [playlistID, setPlaylistID] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [isPlaylist, setIsPlaylist] = useState(false);

  const dispatch = useDispatch();

  const song = useSelector((state) => state.song)
  const playlist = useSelector((state) => state.playlist)
//   setSongID(song['songid']);

  const navigate = useNavigate();


    async function handleSubmit(e) {
        e.preventDefault();
        if (playlistID === 0 || (song['songid'] === 0 && !isPlaylist)) {
            alert('Please select available fields') ;//+ {playlist);
            return;
        }
        if(!song['songid'] && !isPlaylist){
            alert('Please select a song to delete');
            return;
        }
       


        // console.log(isPlaylist, playlistID, user['UserID'], song['songid']);

        // return;

        const res = await fetch(`http://${ip}:${port}/removePlaylist`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isPlaylist: isPlaylist,
                UserID:user['UserID'],
                PlaylistID: playlistID,
                SongID: song['songid'],
              }),
        });

      const data = await res.json();
      // console.log(name, url, explicit, playlist, user['Username'], user['UserID'], duration, albumImg, date,"Result " ,);
        if(data['success']){
            if(!isPlaylist)
            alert('Removed song Successfully from ' + name);
            else
            alert('Removed Playlist Successfully');
            handleClose();
        }

}

  function handleClose() {
    setName('');
    setPlaylistID(0);
    setIsPlaylist(false);
    try{
      document.getElementsByTagName('form')[0].reset();
      fetchPlaylistsCount();
    }catch(e){''}
    setShow(false);
  }

 
  const fetchData = async () => {
  
    if(!user['Login']){ 
      alert("Redirecting to login");
      navigate('/login', { replace: true });
    }

    try {
      const fetchedArtist = await getPlaylists();
      setPlaylists(fetchedArtist.rows || fetchedArtist); // Handle potential API response format variations
      
      // if(playlists['error']){
      //   handleClose();
      // }
    } catch (err) {
      console.error(err);
      alert(error)
    } 
  };

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

  
  const handleShow = () => {
    setShow(true);
    fetchData();
  }

  async function getPlaylists(){

      const playlists = await fetch(`http://${ip}:${port}/playlists`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  UserID: user['UserID'],
                }),
              });

        const data = await playlists.json();
        // console.log("Datatttt ", data);
        setPlaylists(data);
        return data;
    }    

    useEffect(() => {
      fetchData();
      fetchPlaylistsCount();
      }, [user]);
      

      let i = 0;

  return (
    < >
      {playlist['playlists']===0 ? '': 
      
      <div>
      <div className='fixed-bottom m-2'>

      <Button variant="danger" onClick={handleShow} style={{width:100 , fontSize:'12px',fontWeight:'bold', position:'absolute', bottom:'0', right:'0' }}>
        Delete Song From Playlist
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
                              setIsPlaylist(e.target.checked);
                              if(!e.target.checked){
                                    (0);
                              }
                          }}/>

                      </div>


                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Your Playlists
                            </Dropdown.Toggle>
                                
                            <Dropdown.Menu key={i = i+1}>
                                
                                {playlists['error'] ? '':
                                
                                
                                playlists.map((playlist_, j)=>{
                                        
                                        return(
                                        <Dropdown.Item key={j} onClick={(e)=>{
                                        
                                        setName(playlist_['name']);
                                        setPlaylistID(playlists[j]['playlistid'])
                                        
                                        }}
                                        >{playlist_['name']}</Dropdown.Item>
                                        )
                                }
                            )
                                }                                
                                

                            </Dropdown.Menu>
                            
                            {isPlaylist ?(
                              <div>
                              </div>
                            ):(
                              <div>
                                {!(song['songid']===0) ?
                                
                                <div>
                                    Selected Song: {song['title']}
                                </div>
                                :
                                    <div>Play the song to be removed</div>
                                }
                              </div>
                              )}
                            </Dropdown>
                            {playlistID===0?
                            <div>
                                <div>
                                    No Playlist Selected
                                </div>
                            </div>:
                            <div>
                                <div>
                                    Playlist : {name}
                                </div>
                            </div>    
                        }

                     </div>
                <button className='btn btn-danger' >Delete {isPlaylist ? 'Playlist' : 'Song'}</button>
            </form>
            

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      </div> }
    </>
  );
}

export default DeletePlaylist;