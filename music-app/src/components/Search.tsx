import React, { useState } from "react";
import { FormControl, Button } from "react-bootstrap";

const SearchComponent = ({fact}: {fact: string}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    alert(`Search for ${searchValue}`);
  };

  return (
    <div>
      <FormControl 
        className="p-2 m-2"
        type="text"
        placeholder={fact} //"Search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Button className="p-2 m-2" onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default SearchComponent;