import { useUser } from "../../hooks/useUser.ts";
import Box from "@mui/material/Box";
import {
  Button,
  Card,
  CardMedia,
  Dialog,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Slider,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Book, Status } from "../../type/type.ts";
import ListItem from "@mui/material/ListItem";
import { useState } from "react";
import { updateUserData } from "../../service/http.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStatuses } from "../../hooks/useStatuses.ts";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookIcon from "@mui/icons-material/Book";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import BooksList from "../BooksList/booksList.tsx";
import { useBooks } from "../../hooks/useBooks.tsx";

function ToReadList() {
  const { data: userData, isLoading, refetch } = useUser();
  const { data } = useBooks();
  const theme = useTheme();
  const [viewMode, setViewMode] = useState("grid");
  const [status, setStatus] = useState(1);
  const { data: statuses } = useStatuses();
  const [openAddBookDialog, setOpenAddBookDialog] = useState(false);

  const handleOpenAddBookDialog = () => {
    setOpenAddBookDialog(true);
  };

  const handleCloseAddBookDialog = () => {
    setOpenAddBookDialog(false);
  };

  const handleAddBook = (book: Book) => {
    const updatedBookList = userData.bookList
      ? [...userData.bookList, book]
      : [book];
    updateUserData(userData.uid, { bookList: updatedBookList });
    refetch();
    handleCloseAddBookDialog();
  };

  const handleDelete = (bookId: string) => {
    const updatedBookList = userData.bookList.filter(
      (book: Book) => book.id !== bookId,
    );
    updateUserData(userData.uid, { bookList: updatedBookList });
    refetch();
  };

  function BookStatusIcon({ status }: { status: Status }) {
    let IconComponent;

    switch (status.value) {
      case "toRead":
        IconComponent = BookmarkBorderIcon;
        break;
      case "reading":
        IconComponent = BookIcon;
        break;
      case "completed":
        IconComponent = CheckCircleIcon;
        break;
      default:
        IconComponent = BookmarkBorderIcon;
    }

    return <IconComponent sx={{ width: "20px" }} />;
  }

  const handleStatusChange = (currentBook: Book, currentStatus: number) => {
    const updatedBookList = userData.bookList.map((book: Book) => {
      if (book.id == currentBook.id) {
        currentBook.status = currentStatus;
      }
      return book;
    });
    updateUserData(userData.uid, { bookList: updatedBookList });
    refetch();
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

  function valuetext(value: number) {
    return `${value} pages`;
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h2" gutterBottom>
        Books List
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddBookDialog}
        sx={{ marginRight: "1em", width: "15%", alignSelf: "flex-end" }}
      >
        Add Book
      </Button>

      <Dialog
        open={openAddBookDialog}
        onClose={handleCloseAddBookDialog}
        fullWidth
        maxWidth="md"
      >
        <BooksList
          data={data as Book[]}
          isAuth={true}
          onAddBook={handleAddBook}
        />
      </Dialog>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Box sx={{ margin: "1em", alignSelf: "flex-end" }}>
          <Button sx={{ margin: "0 .5em" }}>
            <GridViewIcon onClick={() => setViewMode("grid")} />
          </Button>
          <Button sx={{ margin: "0 .5em" }}>
            <ViewListIcon onClick={() => setViewMode("list")} />
          </Button>
        </Box>
      </Box>

      {viewMode === "grid" ? (
        <Grid
          container
          spacing={6}
          sx={{
            justifyContent: "flex-start",
            padding: "5em",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "2em",
          }}
        >
          {userData?.bookList?.map((book: Book) => (
            <Box key={book.id}>
              <Card
                sx={{
                  display: "flex",
                  borderRadius: 3,
                  width: "25em",
                  height: "20em",
                  alignItems: "flex-start",
                  justifyContent: "space-evenly",
                }}
              >
                <Box>
                  <CardMedia
                    sx={{ width: "11em", height: "15em" }}
                    component="img"
                    image={book.image}
                    alt={book.name}
                  />
                  <Slider
                    defaultValue={book.currentPage}
                    getAriaValueText={valuetext}
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
                    <Typography variant="subtitle2" gutterBottom>
                      {book.name}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="caption"
                    >
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
                        <Select
                          id="demo-simple-select"
                          value={book.status ? book.status : status}
                          key={book.id}
                          sx={{
                            padding: 0,
                            height: "2em",
                            fontSize: "14px",
                            "& .MuiSelect-select": {
                              display: "flex",
                              alignItems: "center",
                            },
                          }}
                          onChange={(e) => {
                            handleStatusChange(book, +e.target.value);
                            setStatus(+e.target.value);
                          }}
                        >
                          {statuses?.map((status) => {
                            return (
                              <MenuItem
                                key={status.id}
                                value={status.id}
                                sx={{
                                  fontSize: "14px",
                                }}
                              >
                                <BookStatusIcon status={status} />
                                {status.value}
                              </MenuItem>
                            );
                          })}
                        </Select>
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
          ))}
        </Grid>
      ) : (
        <Box>
          {userData.bookList.map((book: Book) => (
            <ListItem key={book.id} sx={{ display: "flex", marginBottom: 2 }}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CardMedia
                  sx={{ width: 150, height: 250, margin: "2em" }}
                  component="img"
                  image={book.image}
                  alt={book.name}
                />
                <Box sx={{ paddingLeft: 2, flex: 1, margin: "2em auto" }}>
                  <Typography variant="h6">{book.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {book.author}
                  </Typography>
                  <Slider
                    defaultValue={book.currentPage}
                    getAriaValueText={valuetext}
                    step={1}
                    max={book.totalPage}
                    sx={{ width: "20%", margin: "2em auto" }}
                    valueLabelDisplay="on"
                    marks={[{ value: book.totalPage, label: book.totalPage }]}
                    onChange={(_event: Event, newValue: number | number[]) =>
                      handleReadingPagesChange(book, newValue as number)
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignSelf: "flex-end",
                    margin: "2em",
                  }}
                >
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
                    <Select
                      id="demo-simple-select"
                      value={book.status ? book.status : status}
                      key={book.id}
                      sx={{
                        padding: 0,
                        height: "2em",
                        fontSize: "14px",
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                        },
                      }}
                      onChange={(e) => {
                        handleStatusChange(book, +e.target.value);
                        setStatus(+e.target.value);
                      }}
                    >
                      {statuses?.map((status) => {
                        return (
                          <MenuItem
                            key={status.id}
                            value={status.id}
                            sx={{
                              fontSize: "14px",
                            }}
                          >
                            <BookStatusIcon status={status} />
                            {status.value}
                          </MenuItem>
                        );
                      })}
                    </Select>
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
              </Card>
            </ListItem>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ToReadList;
