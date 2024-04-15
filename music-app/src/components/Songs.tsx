import SearchComponent  from "./Search.tsx";
// export  SearchComponent;
import { useEffect } from 'react';


function getSongs(){
  useEffect(() => {
    fetch('http://localhost:3000/data?Query=Select * from ttt')
      .then((res) => {
        // console.log(res.json());
        return res.json();
      })
      .then((data) => {
        console.log(data);
        // setPhotos(data);
      });
  }, []);
}

function Songs() {
  console.log("Songs");
  getSongs();
  return (
    <>
      <div className="p-2">Songs</div>
      <SearchComponent fact={"Search Songs"}/>
    </>
  )
}

export default Songs