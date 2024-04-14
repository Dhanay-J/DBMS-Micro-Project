import SearchComponent  from "./Search.tsx";
// export  SearchComponent;
function Songs() {
  return (
    <>
      <div className="p-2">Songs</div>
      <SearchComponent fact={"Search Songs"}/>
    </>
  )
}

export default Songs