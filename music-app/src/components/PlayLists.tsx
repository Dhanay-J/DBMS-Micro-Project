import SearchComponent from "./Search";

function PlayLists() {
  return (
    <>
      <div className="p-2">PlayLists</div>
      <SearchComponent fact={"Search Playlist"} />
    </>
  )
}

export default PlayLists;