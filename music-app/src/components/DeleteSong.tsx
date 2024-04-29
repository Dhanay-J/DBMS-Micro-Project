import { useContext, useEffect, useState, useRef } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import { UserContext } from './UserContext';


const ip = 'localhost';
const port = 30000;



function convertSecondstoTime(t=0) {

    const dateObj = new Date(t * 1000);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getSeconds();
  
    const timeString = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
  
    return timeString;
}



function DeleteSong() {
    const [show, setShow] = useState(false);
    const user = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [explicit, setExplicit] = useState(false);
  const [isNewAlbum, setIsNewAlbum] = useState(false);  
  const [album, setAlbum] = useState("");
  const [albums, setAlbums] = useState([]);
  const [date, setDate] = useState('');
  const [albumImg, setAlbumImg] = useState('');


  async function getSongDuration() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
    const newSong = await fetch(url);
    try {
      const audioBuffer = await audioContext.decodeAudioData(await newSong.arrayBuffer());
      const d = Math.ceil(audioBuffer.duration);
      return d;  // Optional: Return the duration for further use
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

        const res = await fetch(`http://${ip}:${port}/`, {
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
    document.getElementsByTagName('form')[0].reset();
    setShow(false);
  }

  const handleShow = () => setShow(true);

  async function getAlbums(){

      const albums = await fetch(`http://${ip}:${port}/songs?Query=select a.name , al.title as album, s.url, s.title ,s.duration,s.songid, s.likes, s.dislikes from artist a join songs s on a.artistid = s.artistid join albums al on s.albumid=al.albumid`, {
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
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Your Albums
                            </Dropdown.Toggle>
                            <Dropdown.Menu key={i = i+1}>
                                {albums.map((album, j)=>(
                                    <Dropdown.Item key={j} onClick={(e)=>{setAlbum(e.target.text)}}>{album['Title']}</Dropdown.Item>
                                ))}                                
                            </Dropdown.Menu>
                        </Dropdown>
                     </div>
                <button className='btn btn-danger' >Delete Song</button>
            </form>
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