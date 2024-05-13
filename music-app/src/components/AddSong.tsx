import { useContext, useEffect, useState, useRef } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';


const ip = 'localhost';
const port = 30000;
const flask_port = 5000 


function convertSecondstoTime(t=0) {

    const dateObj = new Date(t * 1000);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getSeconds();
  
    const timeString = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
  
    return timeString;
}



function AddSong() {
    const [show, setShow] = useState(false);
    const user = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [explicit, setExplicit] = useState(false);
  const [isNewAlbum, setIsNewAlbum] = useState(false);  
  const [album, setAlbum] = useState("");
  const [albumID, setAlbumID] = useState("");
  const [albums, setAlbums] = useState([]);
  const [date, setDate] = useState('');
  const [albumImg, setAlbumImg] = useState('');

  const navigate = useNavigate();


  async function getSongDuration() {
    // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
    try {
      const newSong = await fetch(`http://${ip}:${flask_port}/`, {
        method: 'POST',
        // mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: url
        }),
    });
      // const audioBuffer = await audioContext.decodeAudioData(await newSong.arrayBuffer());
      // const d = Math.ceil(audioBuffer.duration);
      const data = await newSong.json();
      console.log(data['Length']);

      return data['Length'];  // Optional: Return the duration for further use
    } catch (error) {
       // Or handle error differently
      return 0;   // Optional: Return a default value on error
    }
    
  }
   


    async function handleSubmit(e) {
        e.preventDefault();
        if (title === '' || url === '' || album === '') {
            alert('Please fill all fields');
            return;
        }

      const duration = await getSongDuration();
      
      

      if(!(duration>0)){
        alert('File Not Found or Supported');
        return;
      }

        const res = await fetch(`http://${ip}:${port}/addSong`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Title: title,
                URL: url,
                Explicit: explicit,
                AlbumTitle: album,
                AlbumID: albumID,
                UserID: user['UserID'],
                Duration: duration,
                ReleaseDate: date,
                ImageURL: albumImg
            }),
        });

      const data = await res.json();
      // console.log(title, url, explicit, album, user['Username'], user['UserID'], duration, albumImg, date,"Result " ,);
        if(data['success']){
            alert('Song Added Successfully');
            handleClose();
        }
}

  function handleClose() {
    setTitle('');
    setUrl('');
    setExplicit(false);
    setAlbum('');
    setDate('');
    setIsNewAlbum(false);
    getAlbums();
    document.getElementsByTagName('form')[0].reset();
    setShow(false);
  }

  const handleShow = () => setShow(true);

  async function getAlbums(){

      const albums = await fetch(`http://${ip}:${port}/albums`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  UserID: user['UserID'],
                }),
              });
        const data = await albums.json();
        // console.log(data);
        setAlbums(data);
        return;
    }

    useEffect(() => {
        const fetchData = async () => {
          
          if(!user['Login']){ 
            alert("Redirecting to login");
            navigate('/login', { replace: true });
          }
    
          try {
            const fetched_albums = await getAlbums();
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
    <>
      <Button variant="primary m-2 fixed-bottom" onClick={handleShow} style={{width:120}}>
        Add Song
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Song</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
        <form onSubmit={handleSubmit}>
              
                <div className='mb-3'>
                    <label>Title</label>
                    <input placeholder='Enter Song Title' defaultValue={''} className='form-control' onChange={e => setTitle(e.target.value.trim())}/>
                </div>
                <div className='mb-3'>
                    <label >URL</label>
                    <input type="text" defaultValue={''} placeholder='Enter Song Url' className='form-control' onChange={(e) => {
                        setUrl(e.target.value.trim());
                        
                        }}/>
                </div>
                <div className='mb-3 p-3'>
                    <Form.Check // prettier-ignore
                        type="switch"
                        id="explicit"
                        label="Explicit"
                    onChange={(e)=>{setExplicit(e.target.checked)}}/>
                </div>
                <div className='mb-3 p-3'>
                    <Form.Check // prettier-ignore
                        type="switch"
                        id="album"
                        label="New Album"
                    onChange={(e)=>{setIsNewAlbum(e.target.checked)}}/>
                </div>
                {isNewAlbum? (

                     <div className='mb-3'>
                     <label >Album Name</label>
                     <input type="text" placeholder='Album' className='form-control mt-2' onChange={(e) => {
                        for(let i=0; i<albums.length; i++){
                            if(albums[i]['Title']===e.target.value.trim()){
                                alert("Album ( "+ albums[i]['Title'] +" ) Already Exists");
                                e.target.value = album;
                                return;
                            }
                        }
                        setAlbum(e.target.value.trim());
                     }}/>
                     
                     <label className='mt-2'>Album Release Date</label>
                     <Form.Control type='date' className='mt-3' onChangeCapture={(e)=>{                      
                       setDate( new Date(e.target.value).toLocaleDateString("en-GB").replace(/\//g , '-'));
                      }}>
                     </Form.Control>

                     <label >Album Thumbnail URL</label>
                     <input type="text" placeholder='Album Thumbnail' className='form-control mt-2' onChange={(e) => {
                        setAlbumImg(e.target.value.trim());
                     }}/>

                     </div> 
                )
                     : (
                        
                     <div className='m-2 '>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Your Albums
                                
                            </Dropdown.Toggle>

                            <Dropdown.Menu key={i = i+1}>
                              {!albums || albums.length===0 || albums['error']? "":
                                                               
                                Object.keys(albums).map((album, j)=>(
                                    <Dropdown.Item key={j} onClick={(e)=>{
                                      setAlbum(e.target.text) ;
                                      // console.log('sdf', albums[j]['AlbumID']) ;
                                      setAlbumID(albums[j]['AlbumID'])}}>
                                        {albums[j]['Title']?albums[j]['Title']:''}
                                    </Dropdown.Item>
                                ))                              
                              }
                            </Dropdown.Menu>
                            </Dropdown>
                     </div>
                     )
                }
                {!album ? 
                <div className='p-2' >Album Not Selected</div>:
                <div className='p-2'>Selected Album: {album}</div>
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