import { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Slider,
  FormControl,
  Tooltip,
  useTheme,
  Button,
  Dialog,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUser } from "../../hooks/useUser.ts";
import { updateUserData } from "../../service/http.ts";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Book, DropZoneType, Status } from "../../type/type.ts";
import { useStatuses } from "../../hooks/useStatuses.ts";
import BookIcon from "@mui/icons-material/Book";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import BooksList from "../BooksList/booksList.tsx";
import { useBooks } from "../../hooks/useBooks.tsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase.ts";

const ITEM_TYPE = "BOOK";

const BookCard = ({
  book,
  removeBook,
}: {
  book: Book;
  removeBook: (bookId: string) => void;
}) => {
  const [, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: book.id },
  }));

  const { data: userData, refetch } = useUser();
  const { data: statuses } = useStatuses();

  const navigate = useNavigate();
  function BookStatusIcon({ status }: { status: number | undefined }) {
    let IconComponent;

    switch (status) {
      case 1:
        IconComponent = BookmarkBorderIcon;
        break;
      case 2:
        IconComponent = BookIcon;
        break;
      case 3:
        IconComponent = CheckCircleIcon;
        break;
      default:
        IconComponent = BookmarkBorderIcon;
    }

    return <IconComponent sx={{ width: "20px" }} />;
  }

  const handleDelete = (bookId: string) => {
    removeBook(bookId);
  };

  const handleReadingPagesChange = (currentBook: Book, page: number) => {
    const updatedBookList = userData.bookList.map((book: Book) => {
      if (book.id == currentBook.id) {
        currentBook.currentPage = page;
      }
      return book;
    });

    if (currentBook.currentPage === currentBook.totalPage / 2) {
      toast('📝 "You\'re halfway through your book—keep going!"');
      const user = auth.currentUser;
      const userRef = doc(db, "user", user?.uid || "");
      if (userData?.notificationEnabled) {
        const newNotification = `📝 You\'re halfway through your book—keep going!`;
        updateDoc(userRef, {
          notifications: arrayUnion(newNotification),
          notificationCount: userData.notificationCount + 1,
        });
      }
    }
    updateUserData(userData.uid, { bookList: updatedBookList });
    refetch();
  };

  return (
    <Box
      key={book.id}
      // @ts-ignore
      ref={drag}
      margin={"1em auto"}
    >
      <Card
        sx={{
          display: "flex",
          borderRadius: 3,
          width: "95%",
          height: "20em",
          alignItems: "flex-start",
          justifyContent: "space-evenly",
          flexDirection: "column",
          margin: "0 auto",
          padding: "0 .5em !important",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
            margin: " 0 auto 1.5em auto",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/book/${book.id}`)}
        >
          <CardMedia
            sx={{ width: "10em", height: "15em" }}
            component="img"
            image={book.image}
            alt={book.name}
          />
          <Box sx={{ margin: "2em auto" }}>
            <Typography variant="subtitle1" gutterBottom>
              {book.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="subtitle2">
              {book.author}
            </Typography>
          </Box>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Slider
              defaultValue={book.currentPage}
              step={1}
              max={book.totalPage}
              sx={{
                margin: 0,
                padding: 0,
                "& .MuiSlider-markLabel": {
                  top: "10px",
                  transform: "translateX(-90%)",
                },
              }}
              valueLabelDisplay="on"
              marks={[{ value: book.totalPage, label: book.totalPage }]}
              onChange={(_event: Event, newValue: number | number[]) =>
                handleReadingPagesChange(book, newValue as number)
              }
            />
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
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BookStatusIcon status={book.status} />
                {statuses?.length &&
                  // @ts-ignore
                  statuses?.find((s: Status) => s.id == book?.status).value}
              </Box>
            </FormControl>

            <IconButton
              sx={{ padding: "2px" }}
              onClick={() => handleDelete(book.id)}
            >
              <Tooltip title="Delete">
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

const DropZone = ({
  status,
  statusName,
  books,
  moveBook,
  removeBook,
}: DropZoneType) => {
  const theme = useTheme();

  const { data: userData, refetch } = useUser();

  // @ts-ignore
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    // @ts-ignore
    drop: (item: Book) => {
      moveBook(item.id, status);

      if (status === 3) {
        toast("🏆 You finished a book! Add your next one!");
        const user = auth.currentUser;
        const userRef = doc(db, "user", user?.uid || "");
        if (userData?.notificationEnabled) {
          const newNotification = `🏆 You finished a book  at ${new Date().toLocaleTimeString()}! Add your next one!`;
          updateDoc(userRef, {
            notifications: arrayUnion(newNotification),
            notificationCount: userData.notificationCount + 1,
          });
        }
      }
      refetch();
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Box
      // @ts-ignore
      ref={drop}
      sx={{
        border: `7px double  ${theme.palette.text.primary}`,
        marginBottom: 2,
        minHeight: "300px",
        borderRadius: "20px",
        width: "33%",
      }}
    >
      <Typography variant="h6" gutterBottom>
        {statusName}
      </Typography>
      {books.map((book) => (
        <BookCard key={book.id} book={book} removeBook={removeBook} />
      ))}
    </Box>
  );
};

function Experiment({
  isNewBookAdded,
}: {
  isNewBookAdded: (value: boolean, message: string) => void;
}) {
  const { data, isLoading, refetch } = useUser();
  const { data: BookData } = useBooks();

  const bookRef = useRef(data.bookList);
  const [openAddBookDialog, setOpenAddBookDialog] = useState(false);

  const removeBook = (bookId: string) => {
    const updatedBookList = bookRef.current.filter(
      (book: Book) => book.id !== bookId,
    );
    updateUserData(data.uid, { bookList: updatedBookList }).then(() => {});
    refetch();
    bookRef.current = updatedBookList;
  };

  const moveBook = (bookId: string, newStatus: number) => {
    const updatedBookList = bookRef.current.map((book: Book) => {
      if (book.id === bookId) {
        return { ...book, status: newStatus };
      }
      return book;
    });

    updateUserData(data.uid, { bookList: updatedBookList });
    bookRef.current = updatedBookList;
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleOpenAddBookDialog = () => {
    setOpenAddBookDialog(true);
  };

  const handleCloseAddBookDialog = () => {
    setOpenAddBookDialog(false);
  };

  const handleAddBook = (book: Book) => {
    const updatedBookList = data.bookList ? [...data.bookList, book] : [book];
    updateUserData(data.uid, { bookList: updatedBookList });
    bookRef.current = updatedBookList;
    refetch();
    handleCloseAddBookDialog();
  };

  const toReadBooks = data.bookList
    ? data?.bookList.filter((book: Book) => book.status === 1)
    : [];
  const readingBooks = data.bookList
    ? data?.bookList.filter((book: Book) => book.status === 2)
    : [];
  const completedBooks = data.bookList
    ? data?.bookList.filter((book: Book) => data.bookList && book.status === 3)
    : [];

  return (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", margin: "1em 0" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddBookDialog}
          sx={{ marginRight: "1em", width: "15%", alignSelf: "flex-end" }}
        >
          Add Book
        </Button>
      </Box>

      <Dialog
        open={openAddBookDialog}
        onClose={handleCloseAddBookDialog}
        fullWidth
        maxWidth="md"
      >
        <BooksList
          isBookAdded={isNewBookAdded}
          data={BookData as Book[]}
          isAuth={true}
          onAddBook={handleAddBook}
        />
      </Dialog>
      <DndProvider backend={HTML5Backend}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            width: "98%",
            margin: " 1em auto",
          }}
        >
          <DropZone
            status={1}
            statusName={"To Read"}
            books={toReadBooks}
            moveBook={moveBook}
            removeBook={removeBook}
          />
          <DropZone
            statusName={"Reading"}
            status={2}
            books={readingBooks}
            moveBook={moveBook}
            removeBook={removeBook}
          />
          <DropZone
            statusName={"Complete"}
            status={3}
            books={completedBooks}
            moveBook={moveBook}
            removeBook={removeBook}
          />
        </Box>
      </DndProvider>
    </>
  );
}

// @ts-ignore
export default Experiment;
