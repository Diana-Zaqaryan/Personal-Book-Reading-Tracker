import { useState, useEffect, use, useRef } from "react";
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
import { updateUserBookList, updateUserData } from "../../service/http.ts";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Book, DropZoneType, Status } from "../../type/type.ts";
import { useStatuses } from "../../hooks/useStatuses.ts";
import BookIcon from "@mui/icons-material/Book";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useMutationUser from "../../hooks/useUserUpdate.ts";
import booksList from "../BooksList/booksList.tsx";
import BooksList from "../BooksList/booksList.tsx";
import { useBook } from "../../hooks/useBook.tsx";

const ITEM_TYPE = "BOOK";

const BookCard = ({ book, moveBook, removeBook }) => {
  const [, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: book.id },
  }));

  const { data: userData, refetch } = useUser();

  const { data: statuses } = useStatuses();
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
    updateUserData(userData.uid, { bookList: updatedBookList });
    refetch();
  };

  return (
    // @ts-ignore
    <Box key={book.id} ref={drag} margin={"1em"}>
      <Card
        sx={{
          display: "flex",
          borderRadius: 3,
          width: "22em",
          height: "20em",
          alignItems: "flex-start",
          justifyContent: "space-evenly",
        }}
      >
        <Box>
          <CardMedia
            sx={{ width: "10em", height: "15em" }}
            component="img"
            image={book.image}
            alt={book.name}
          />
          <Slider
            defaultValue={book.currentPage}
            step={1}
            max={book.totalPage}
            sx={{ width: "80%", margin: "2em auto" }}
            valueLabelDisplay="on"
            marks={[{ value: book.totalPage, label: book.totalPage }]}
            onChange={(_event: Event, newValue: number | number[]) =>
              handleReadingPagesChange(book, newValue as number)
            }
          />
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
            <Typography variant="subtitle1" gutterBottom>
              {book.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom variant="subtitle2">
              {book.author}
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
  // @ts-ignore
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    // @ts-ignore
    drop: (item: Book) => {
      moveBook(item.id, status);
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
      }}
    >
      <Typography variant="h6" gutterBottom>
        {statusName}
      </Typography>
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          moveBook={moveBook}
          removeBook={removeBook}
        />
      ))}
    </Box>
  );
};

function Experiment() {
  const { data, isLoading, refetch } = useUser();
  const { data: BookData } = useBook();

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

  console.log("updates--->", data.bookList);

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

  console.log(bookRef.current);

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
        <BooksList data={BookData} isAuth={true} onAddBook={handleAddBook} />
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

export default Experiment;
