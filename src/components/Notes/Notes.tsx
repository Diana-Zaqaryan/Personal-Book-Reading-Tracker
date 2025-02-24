import { useUser } from "../../hooks/useUser.ts";
import { Note } from "../../type/type.ts";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { CardMedia, Rating, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateUserData } from "../../service/http.ts";
import { useRef } from "react";
import toast from "react-hot-toast";

function Notes() {
  const { data: userData, refetch } = useUser();

  const noteRef = useRef(userData?.notes);
  const removeNote = async (bookId: string, noteContent: string) => {
    if (!userData?.uid) return;

    try {
      const updatedNotes = noteRef.current.map((note: Note) => {
        if (note.book.id === bookId) {
          return {
            ...note,
            note: note.note.filter((n) => n !== noteContent),
          };
        }
        return note;
      });

      const filteredNotes = updatedNotes.filter(
        (note: Note) => note.note.length > 0,
      );

      await updateUserData(userData.uid, { notes: filteredNotes });
      noteRef.current = filteredNotes;
      refetch();
      toast.success("Note removed successfully!");
    } catch (error) {
      console.error("Error removing note:", error);
      toast.error("Failed to remove note.");
    }
  };

  return (
    <>
      {!!userData?.notes?.length ? (
        <List>
          {userData?.notes.map((note: Note, index: number) => {
            return (
              <ListItem
                key={index}
                sx={{
                  width: "70%",
                  margin: "1em auto",
                  border: "4px double",
                  borderRadius: "15px",
                  gap: "3em",
                }}
              >
                <Box>
                  <CardMedia
                    sx={{ width: "10em", height: "15em" }}
                    component="img"
                    image={note.book?.image}
                    alt={note.book?.name}
                  />
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="subtitle2"
                  >
                    {note.book?.author}
                  </Typography>{" "}
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "1em" }}
                  >
                    <Rating
                      name="read-only"
                      readOnly
                      precision={0.2}
                      value={note.book?.rating}
                    />
                    <span>{note.book?.rating}</span>
                  </Box>
                </Box>
                <Box display={"flex"} flexDirection={"column"} width={"100%"}>
                  <Box>
                    {note?.book && (
                      <>
                        <Typography variant="h5" gutterBottom>
                          {note.book?.name}
                        </Typography>
                      </>
                    )}
                  </Box>

                  <List>
                    {note.note.map((note1: string, index: number) => (
                      <Box display={"flex"} alignItems={"center"}>
                        <ListItem
                          key={`${note1}- ${index}`}
                          sx={{ gap: "1em" }}
                        >
                          <StickyNote2Icon />
                          {note1}
                        </ListItem>

                        <DeleteIcon
                          onClick={() => removeNote(note.book.id, note1)}
                        />
                      </Box>
                    ))}
                  </List>
                </Box>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography variant={"h4"} margin={"5em auto"}>
          No notes available.
        </Typography>
      )}
    </>
  );
}

export default Notes;
