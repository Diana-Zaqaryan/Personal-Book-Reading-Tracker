import { InputBase } from "@mui/material";

import { ChangeEvent } from "react";

function Search({ handleInput }: { handleInput: (e: string) => void }) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleInput(e.target.value);
  };
  return (
    <>
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          border: "2px solid",
          borderRadius: "10px",
          padding: "5px 20px",
          width: "20em",
          alignSelf: "flex-end",
          marginTop: "2em",
          marginRight: "1.5em",
        }}
        placeholder="Search books"
        inputProps={{ "aria-label": "search books" }}
        onChange={handleChange}
      />
    </>
  );
}

export default Search;
