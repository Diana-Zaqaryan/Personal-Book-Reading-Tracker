import { useEffect, useState } from "react";
import "./App.css";
import ButtonAppBar from "./components/Navbar/navbar.tsx";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login/login.tsx";
import SignUp from "./components/SignUp/signUp.tsx";
import BooksList from "./components/BooksList/booksList.tsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, generateToken, messaging } from "../firebase.ts";
import { useUser } from "./hooks/useUser.ts";
import NonAuthLayout from "./components/NonAuthLayout/nonAuthLayout.tsx";
import Main from "./components/main/main.tsx";
import { onMessage } from "firebase/messaging";
import {
  BOOKS,
  LOGIN_ROUTE,
  NOTES,
  PROFILE,
  SETTINGS,
  SIGN_UP,
  TOREADLIST,
} from "./utils/consts.ts";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import Profile from "./components/Dashboard/Profile.tsx";
import { darkTheme, lightTheme } from "./themes.ts";
import Settings from "./components/Settings/Settings.tsx";
import Experiment from "./components/experiments/experiment.tsx";
import { useBooks } from "./hooks/useBooks.tsx";
import toast, { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import BookDetails from "./components/BookDetails/BookDetails.tsx";
import { Book } from "./type/type.ts";
import Notes from "./components/Notes/Notes.tsx";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import Analytics from "./components/Analytics/Analytics.tsx";
import { updateUserData } from "./service/http.ts";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const { data: userData, refetch } = useUser();
  const { data, isLoading } = useBooks();
  const navigate = useNavigate();

  const muiTheme = userData?.theme
    ? userData?.theme === "dark"
      ? darkTheme
      : lightTheme
    : lightTheme;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
        generateToken();
        onMessage(messaging, (payload) => {
          console.log(payload);
          toast(payload.notification?.body as string);

          const userRef = doc(db, "users", user.uid);

          if (userData?.notificationEnabled) {
            updateDoc(userRef, {
              notifications: arrayUnion(payload.notification?.body),
              notificationCount: userData.notificationCount + 1,
            });
            refetch();
          }
        });

        refetch();
      } else {
        setIsAuth(false);
        navigate(LOGIN_ROUTE);
      }
    });

    return () => unsubscribe();
  }, [refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleAddBook = (book: Book) => {
    const updatedBookList =
      userData && userData?.bookList
        ? [
            ...userData.bookList,
            {
              ...book,
              status: 1,
              currentPage: 0,
              timeSpent: 0,
              addDate: Date.now(),
            },
          ]
        : [
            {
              ...book,
              status: 1,
              currentPage: 0,
              timeSpent: 0,
              addDate: Date.now(),
            },
          ];
    updateUserData(userData.uid, { bookList: updatedBookList });
    refetch();
  };

  function isNewBookAdded(isAdded: boolean, message: string) {
    if (isAdded) {
      toast(message);
    }
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Toaster position={"top-right"} />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ButtonAppBar
        userData={userData}
        handleLogOut={setIsAuth}
        isAuth={isAuth}
        notifications={userData?.notifications}
        refetch={refetch}
      />
      <Routes>
        <Route path="/" element={<Navigate to={LOGIN_ROUTE} replace />} />
        <Route element={<NonAuthLayout isAuth={isAuth} />}>
          <Route
            path={LOGIN_ROUTE}
            element={<Login handleSetUp={setIsAuth} />}
          />
          <Route path={SIGN_UP} element={<SignUp handleSetUp={setIsAuth} />} />
        </Route>
        {isAuth && (
          <Route element={<Main children={undefined} />}>
            <Route
              path={BOOKS}
              element={
                <BooksList
                  isBookAdded={isNewBookAdded}
                  data={data as Book[]}
                  onAddBook={handleAddBook}
                  isAuth={isAuth}
                />
              }
            />
            <Route
              path={SETTINGS}
              element={<Settings currentUser={userData} refetch={refetch} />}
            />
            <Route path={NOTES} element={<Notes />} />
            <Route
              path={PROFILE}
              element={<Profile currentUser={userData} />}
            />
            <Route
              path={TOREADLIST}
              element={<Experiment isNewBookAdded={isNewBookAdded} />}
            />

            <Route path={"/analytics"} element={<Analytics />} />
            <Route path="*" element={<Navigate to={BOOKS} />} />

            <Route path="/book/:id" element={<BookDetails />} />
          </Route>
        )}
      </Routes>
    </MuiThemeProvider>
  );
}

export default App;
