import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CustomDrawer from "../Drawer/drawer.tsx";
import { Outlet } from "react-router-dom";
import { useTheme } from "@mui/material";

const drawerWidth = 200;

// @ts-ignore
function Main({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "row",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        "& .MuiPaper-root": {
          padding: 0,
        },
      }}
      color="default"
    >
      <Box
        color="primary"
        sx={{
          "& .MuiDrawer-docked": {
            height: "100%",
          },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              position: "relative",
              borderRight: "1px solid grey",
            },
          }}
        >
          <CustomDrawer />
        </Drawer>
      </Box>
      <Box
        color="primary"
        sx={{
          flexGrow: 1,
          p: 3,
          position: "relative",
          minHeight: "100vh",
          padding: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Outlet />
        {children}
      </Box>
    </Box>
  );
}

export default Main;
