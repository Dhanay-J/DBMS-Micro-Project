import ReactAudioPlayer from 'react-audio-player';


const Player = () => {
  

  return (
    <>
      
    <div className="d-flex justify-content-center">
      <ReactAudioPlayer
      src="/src/assets/songs/Gods Plan..mp3"
      
      volume={0.2}
      controls={true}
      
      className="w-80"
      />
    </div>



    </>

  );
};


export default Player