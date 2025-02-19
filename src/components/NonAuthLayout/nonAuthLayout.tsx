import { Box, useTheme } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { BOOKS } from "../../utils/consts.ts";

interface NonAuthRouteProps {
  isAuth: boolean;
}

const NonAuthLayout = ({ isAuth }: NonAuthRouteProps) => {
  const theme = useTheme();
  if (isAuth) {
    return <Navigate to={BOOKS} replace />;
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Outlet />
    </Box>
  );
};

export default NonAuthLayout;
