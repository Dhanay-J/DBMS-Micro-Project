import ReactAudioPlayer from 'react-audio-player';
import { useContext } from 'react';
import { MusicContext } from './Songs';

const Player = () => {

  const url = useContext(MusicContext);
 
  
  return (
    <>
      <div className="d-flex justify-content-center fixed-bottom m-3" style={{zIndex:2, position:'fixed'}}>
        <ReactAudioPlayer
          src={url}
          volume={0.2}
          autoPlay
          controls
          className="w-80"
        />

        
      </div>
    </>
  );
};

export default Player;
