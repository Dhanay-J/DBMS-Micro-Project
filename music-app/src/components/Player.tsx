import ReactAudioPlayer from 'react-audio-player';


const Player = () => {
  

  return (
    <>
      
    <div className="d-flex justify-content-center">
      <ReactAudioPlayer
      src="/src/components/Na Ja.mp3"
      
      volume={0.2}
      controls={true}
      
      className="w-80"
      />
    </div>



    </>

  );
};


export default Player