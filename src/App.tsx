import { useEffect, useState } from "react";
import "./App.css";
import ButtonAppBar from "./components/Navbar/navbar.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login/login.tsx";
import SignUp from "./components/SignUp/signUp.tsx";
import BooksList from "./components/BooksList/booksList.tsx";
import { onAuthStateChanged } from "firebase/auth";
import { auth, generateToken, messaging } from "../firebase.ts";
import { useUser } from "./hooks/useUser.ts";
import NonAuthLayout from "./components/NonAuthLayout/nonAuthLayout.tsx";
import Main from "./components/main/main.tsx";
import { onMessage } from "firebase/messaging";
import {
  BOOKS,
  LOGIN_ROUTE,
  PROFILE,
  SETTINGS,
  SIGN_UP,
  TOREADLIST,
} from "./utils/consts.ts";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import Profile from "./components/Dashboard/Profile.tsx";
import { darkTheme, lightTheme } from "./themes.ts";
import Settings from "./components/Settings/Settings.tsx";
import ToReadList from "./components/ToReadList/ToReadList.tsx";
import Experiment from "./components/experiments/experiment.tsx";
import { useBook } from "./hooks/useBook.tsx";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const { data: userData, isLoading: userIsLoading, refetch } = useUser();
  const { data, isLoading } = useBook();
  const [notifications, setNotifications] = useState<number>(0);

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
          setNotifications((prev) => prev + 1);
        });

        refetch();
      } else {
        setIsAuth(false);
      }
    });

    return () => unsubscribe();
  }, [refetch]);

  if (userIsLoading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <Toaster position={"top-right"} />
      <ButtonAppBar
        handleLogOut={setIsAuth}
        isAuth={isAuth}
        notifications={notifications}
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
                <BooksList data={data} onAddBook={null} isAuth={isAuth} />
              }
            />
            <Route
              path={SETTINGS}
              element={<Settings currentUser={userData} refetch={refetch} />}
            />
            <Route
              path={PROFILE}
              element={<Profile currentUser={userData} />}
            />
            <Route path={TOREADLIST} element={<ToReadList />} />
            <Route path="*" element={<Navigate to={BOOKS} />} />
            <Route path="/experiment" element={<Experiment />} />
          </Route>
        )}
      </Routes>
    </MuiThemeProvider>
  );
}

export default App;
