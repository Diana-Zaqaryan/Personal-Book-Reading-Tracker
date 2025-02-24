import { useState } from "react";
import {
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  Rating,
  Typography,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import styles from "./books-list.module.css";
import { Book, BookListType } from "../../type/type.ts";
import Search from "../search/search.tsx";
import ListItem from "@mui/material/ListItem";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import { useNavigate } from "react-router-dom";
import { TOREADLIST } from "../../utils/consts.ts";

function BooksList({ data, isAuth, onAddBook, isBookAdded }: BookListType) {
  const [open, setOpen] = useState(false);
  const [selectBook, setSelectBook] = useState<Book>();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(data as Book[]);
  const theme = useTheme();
  const { data: userData, refetch } = useUser();
  const navigate = useNavigate();

  const handleOpen = (book: Book) => {
    setOpen(true);
    setSelectBook(book);
  };

  const handleSearch = (value: string) => {
    const filtered: undefined | Book[] =
      data &&
      (data.filter((book: Book) =>
        (book as Book).name.toLowerCase().includes(value.toLowerCase()),
      ) as Book[]);

    setFilteredBooks(filtered?.length ? filtered : []);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addBook = async (book: Book) => {
    onAddBook && onAddBook(book);
    const user = auth.currentUser;
    const userRef = doc(db, "user", user?.uid || "");
    await updateDoc(userRef, {
      bookList: userData?.bookList ? [...userData?.bookList, book] : [book],
    });
    const newNotification = `📚 New book added: ${selectBook?.name} at ${new Date().toLocaleTimeString()} `;

    if (userData?.notificationEnabled) {
      await updateDoc(userRef, {
        notifications: arrayUnion(newNotification),
        notificationCount: userData.notificationCount + 1,
      });
    }
    refetch();
    if (isBookAdded) {
      isBookAdded(true, "Great choice! The book has been added. 📚👍");
    }
    navigate(TOREADLIST);
    handleClose();
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          padding: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Search handleInput={handleSearch} />
        <Typography variant="h2" gutterBottom sx={{ margin: "0 auto" }}>
          Books List
        </Typography>
        <List
          color="primary"
          className={styles.list}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-around",
            gap: "30px",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          {filteredBooks.map((book: Book) => (
            <ListItem
              key={book.id}
              style={{ display: "inline-block", width: "auto" }}
            >
              <Card
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  maxWidth: 350,
                  width: "100%",
                  maxHeight: 700,
                  borderRadius: 3,
                  border: "10px double",
                  "&:hover": {
                    transform: "scale(1.1)",
                    transition: ".6s all",
                  },
                }}
              >
                <Box>
                  <CardMedia
                    sx={{ width: 220, cursor: "pointer" }}
                    component="img"
                    height="300"
                    image={book.image}
                    alt="Book image"
                    onClick={() => handleOpen(book)}
                  />
                </Box>
              </Card>
            </ListItem>
          ))}
        </List>
      </Box>

      {selectBook && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
          }}
        >
          <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
            {selectBook?.name}
          </DialogTitle>
          <DialogContent sx={{ display: "flex" }}>
            <div
              className="left_side"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <img src={selectBook?.image} style={{ width: "100%" }} />
              {isAuth && (
                <Button
                  disabled={
                    userData?.bookList &&
                    userData.bookList.some(
                      (book: Book) => book.id === selectBook?.id,
                    )
                  }
                  type="submit"
                  variant="contained"
                  fullWidth
                  style={{ margin: "20px auto" }}
                  color="primary"
                  onClick={() => addBook(selectBook)}
                >
                  Add
                </Button>
              )}
              <Rating
                name="read-only"
                readOnly
                precision={0.2}
                value={selectBook?.rating}
              />
              <div>{selectBook?.rating}</div>
            </div>

            <DialogContentText
              id="alert-dialog-description"
              sx={{ fontSize: "14px", paddingLeft: "20px" }}
            >
              {selectBook?.desc}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default BooksList;
