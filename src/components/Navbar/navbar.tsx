import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Avatar, Badge, Menu, MenuItem, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { BOOKS, LOGIN_ROUTE, PROFILE } from "../../utils/consts.ts";
import styles from "./navbar.module.css";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../../service/http.ts";
import NotificationsIcon from "@mui/icons-material/Notifications";
import icon2 from "../../assets/icon2.png";

export default function ButtonAppBar({
  isAuth,
  handleLogOut,
  notifications,
}: {
  isAuth: boolean;
  handleLogOut: (value: boolean) => void;
  notifications: number;
}) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // @ts-ignore
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutOfSystem = async () => {
    try {
      await logout();
      handleLogOut(false);
      setAnchorEl(null);
      navigate(LOGIN_ROUTE);
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Error logging out!");
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "relative",
        "& .MuiPaper-root": {
          position: "relative",
          zIndex: 1000,
        },
      }}
    >
      <AppBar
        position="static"
        className={styles.header}
        color="primary"
        enableColorOnDark
        sx={{ flexGrow: 1, position: "relative", boxShadow: "none" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 0, cursor: "pointer" }}
          >
            <img
              className={styles.icon}
              src={icon2}
              alt="icon"
              onClick={() => {
                isAuth && navigate(BOOKS);
              }}
            />
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: "30px" }}>
            {isAuth ? (
              <>
                <Box>
                  <Badge badgeContent={notifications} color="error">
                    <NotificationsIcon />
                  </Badge>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Box sx={{ display: "flex" }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                      onClick={handleClick}
                      aria-controls={open ? "basic-menu" : undefined}
                    />
                    <Menu
                      id="demo-positioned-menu"
                      aria-labelledby="demo-positioned-button"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <NavLink to={PROFILE}>
                        <MenuItem
                          onClick={handleClose}
                          sx={{
                            display: "flex",
                            gap: "10px",
                            textAlign: "center",
                            textDecoration: "none",
                          }}
                        >
                          <SettingsIcon />
                          Profile
                        </MenuItem>
                      </NavLink>
                      <MenuItem onClick={logoutOfSystem}>
                        <LogoutIcon />
                        Logout
                      </MenuItem>{" "}
                    </Menu>
                  </Box>
                </Box>
              </>
            ) : (
              <NavLink to={LOGIN_ROUTE}>
                <Button variant={"contained"} key={"login"}>
                  Login
                </Button>
              </NavLink>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
