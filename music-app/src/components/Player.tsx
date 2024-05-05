// import ReactAudioPlayer from 'react-audio-player';
// import { useContext, useEffect} from 'react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';



const Player = () => {
  // const musicCnt = useSong();

  const url = useSelector((state:any) => state.song.url);

  return (
    <>
      <div className='d-flex justify-content-center fixed-bottom ' style={{zIndex:2, position:'fixed'}}>
        
        <ReactPlayer
          url={url}
          volume={0.2}
          playing
          controls
          className='m-3 rounded '         
          width='60%'
          height='50px'
          />
    </div>
    </>
  );
};

export default Player;
