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



function AddSong() {
    const [show, setShow] = useState(false);
    const user = useContext(UserContext);

  const [name, setName] = useState('');
  const [isNewPlaylist, setIsNewPlaylist] = useState(false);  
  const [playlistID, setPlaylistID] = useState(0);
  const [description, setDescription] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const song = useSelector((state) => state.song);
  // const playlist = useSelector((state) => state.playlist);

  // console.log(playlist, song);

  const navigate = useNavigate();

  const dispatch = useDispatch();


    async function handleSubmit(e) {
        e.preventDefault();
        if (name === '' || (description===''  && isNewPlaylist)) {
            alert('Please fill all fields') ;//+ {playlist);
            return;
        }

        if(!song['songid']) {
            alert('Please Play the song to be added');
            return;
        }

        // console.log(name, playlistID, user['UserID'], song['songid']);
        
        
        // return;

        const res = await fetch(`http://${ip}:${port}/addPlaylist`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                PlaylistName: name,
                Description : description,
                PlaylistID: playlistID,
                UserID: user['UserID'],
                SongID: song['songid'],
              }),
        });

      const data = await res.json();
      // console.log(name, url, explicit, playlist, user['Username'], user['UserID'], duration, albumImg, date,"Result " ,);
        if(data['success']){
            alert('Song Added Successfully');
            fetchData();
            handleClose();
        }
        else{
          if(data['error'].includes('Duplicate')){
            alert("This Song Alredy Exits is the Playlist");
          }
          // console.log(data);
        }
}

  function handleClose() {
    setName('');
    setDescription('');
    setPlaylistID(0);
    setDescription('');
    setIsNewPlaylist(false);
    fetchPlaylistsCount();
    document.getElementsByTagName('form')[0].reset();
    
    setShow(false);
  }

  const fetchData = async () => {

    try {
      const fetchedArtist = await getPlaylists();
      
      setPlaylists(fetchedArtist.rows || fetchedArtist); // Handle potential API response format variations
    } catch (err) {
      console.error(err);
      alert(error)
    } 
  };

  const sel = useRef(null);
  
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
        // setPlaylists(data);
        return data;
    }

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
        dispatch(setPlaylistData({count:0}));
      }
    };
    

    useEffect(() => {

      if(!user['Login']){ 
        alert("Redirecting to login");
        navigate('/login', { replace: true });
      }

      fetchData();
      fetchPlaylistsCount();
      }, [user]);
      
      
      // console.log("Playlists ", playlists);

      let i = 0;
  return (
    <>
      <Button variant="primary m-2 fixed-bottom" onClick={handleShow} style={{width:100 , fontSize:'12px',fontWeight:'bold'}}>
        Add Song To Playlist
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Song</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
        <form onSubmit={handleSubmit}>
              
                {/* <div className='mb-3'>
                    <label>name</label>
                    <input placeholder='Enter Playlist name' defaultValue={'ss'} className='form-control' onChange={e => setTitle(e.target.value.trim())}/>
                </div> */}
                
                {playlists['error']?'':
                
                <div className='mb-3 p-3'>
                    <Form.Check // prettier-ignore
                        type="switch"
                        id="playlist"
                        label="New playlist"
                    onChange={(e)=>{
                      
                      setIsNewPlaylist(e.target.checked)
                      setPlaylistID(0);
                      setName('');
                      setDescription('');
                      
                      }}/>
                </div>
                }


                {isNewPlaylist || playlists['error']? (

                     <div className='mb-3'>
                     <label >Playlist Name</label>
                     <input type="text" placeholder='Playlist' className='form-control mt-2' onChange={(e) => {
                        for(let i=0; i<playlists.length; i++){
                            if(playlists[i]['name']===e.target.value.trim()){
                                alert("playlist ( "+ playlists[i]['name'] +" ) Already Exists");
                                e.target.value = '';
                                return;
                              }
                            }
                        setName(e.target.value.trim());
                        setPlaylistID(0);
                     }}/>

                     <label >Playlist Description</label>
                     <input type="text" placeholder='Description' className='form-control mt-2' onChange={(e) => {
                        setDescription(e.target.value.trim());
                     }}/>

                     </div> 
                )
                     : (
                    
                          
                     <div className='m-2 '>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Your Playlists 
                            </Dropdown.Toggle>

                            <Dropdown.Menu key={i = i+1}>
                              {playlists['error']?
                              '':
                                  
                                Object.keys(playlists).map((playlist, j)=>(
                                    <Dropdown.Item  ref={sel} key={j} onClick={(e)=>{
                                      setName(e.target.text) ; 
                                      setPlaylistID(playlists[j]['playlistid'])}}>
                                        {playlists[j]['name']?
                                        playlists[j]['name']
                                        :''}
                                        
                                    </Dropdown.Item>
                                ))                              
                              }
                            </Dropdown.Menu>
                            </Dropdown>
                     </div>
                     )
                }
                {!name ? 
                <div className='p-2' >Playlist Not Selected</div>:
                <div className='p-2'>Selected Playlist: {name}</div>
                }

                <button className='btn btn-success' >Add Song</button>
            </form>
        
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddSong;