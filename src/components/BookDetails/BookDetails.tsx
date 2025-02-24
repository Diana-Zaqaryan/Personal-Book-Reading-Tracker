import Box from "@mui/material/Box";
import {
  Button,
  CardMedia,
  FormControl,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useBook } from "../../hooks/useBook.tsx";
import { useState } from "react";

import EditNoteIcon from "@mui/icons-material/EditNote";
import toast from "react-hot-toast";
import { auth, db } from "../../../firebase.ts";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const getInitialRating = (bookId: string) => {
  const storedRating = localStorage.getItem(`rating-${bookId}`);
  return storedRating ? parseFloat(storedRating) : 0;
};
function BookDetails() {
  let { id } = useParams();

  const { data: book } = useBook(id as string);

  const [rating, setRating] = useState(getInitialRating(book?.id as string));
  const [newNote, setNewNote] = useState("");
  const [isFieldOpened, setIsFieldOpened] = useState(false);

  const handleRatingUpdate = (newRating: number) => {
    setRating(newRating);
    localStorage.setItem(`rating-${book?.id}`, newRating.toString());
  };

  const handleAddNote = async () => {
    const user = auth.currentUser;
    if (user && newNote.trim() && book?.id) {
      try {
        const userRef = doc(db, "user", user.uid);

        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const existingNotes = userData?.notes || [];

          const existingNoteForBook = existingNotes.find(
            (note: any) => note.book.id === book.id,
          );

          if (existingNoteForBook) {
            existingNoteForBook.note.push(newNote);
          } else {
            existingNotes.push({ book: book, note: [newNote] });
          }
          await updateDoc(userRef, {
            notes: existingNotes,
          });

          toast.success("Note added successfully!");
          setNewNote("");
          setIsFieldOpened(false);
        } else {
          console.error("User document not found");
        }
      } catch (error) {
        console.error("Error adding note:", error);
        toast.error("Failed to add note.");
      }
    }
  };

  return (
    <Box>
      <Typography variant={"h2"}> {book?.name}</Typography>

      <Box
        margin={"1em auto"}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            borderRadius: 3,
            width: "90%",
            height: "20em",
            alignItems: "flex-start",
            justifyContent: "space-evenly",
            margin: "0 auto",
          }}
        >
          <Box>
            <CardMedia
              sx={{ width: "10em", height: "15em" }}
              component="img"
              image={book?.image}
              alt={book?.name}
            />
            <Typography color="textSecondary" gutterBottom variant="subtitle2">
              {book?.author}
            </Typography>
            <Rating
              name="read-only"
              readOnly
              precision={0.2}
              value={book?.rating || rating}
              onChange={(_, newValue) => handleRatingUpdate(newValue || 0)}
            />
            <div>{book?.rating}</div>
          </Box>

          <Box
            sx={{
              padding: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{ margin: "2em auto" }}>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="subtitle2"
              >
                {book?.desc}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "column",
                gap: "1.5em",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <FormControl
                  fullWidth
                  sx={{
                    padding: 0,
                    height: "2em",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                ></FormControl>
              </Box>
            </Box>
          </Box>
        </Box>
        <EditNoteIcon
          sx={{ fontSize: "2.5em", alignSelf: "flex-end", margin: ".5em 2em" }}
          onClick={() => setIsFieldOpened(true)}
        />
      </Box>

      {isFieldOpened && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
            gap: "2em",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Your Notes and Highlights</Typography>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            placeholder="Add a note or highlight..."
            sx={{ width: "50%" }}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNote}
            sx={{ width: "10em" }}
          >
            Save Note
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default BookDetails;
