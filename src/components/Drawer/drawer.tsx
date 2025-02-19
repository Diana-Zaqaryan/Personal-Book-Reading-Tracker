import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SettingsIcon from "@mui/icons-material/Settings";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useTheme } from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";

const iconMap = {
  Books: <MenuBookIcon />,
  ReadList: <DashboardIcon />,
  Notes: <EditNoteIcon />,
  Settings: <SettingsIcon />,
  Experiment: <ScienceIcon />,
};

function CustomDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div>
      <List sx={{ marginTop: "50px" }}>
        {["ReadList", "Books", "Notes", "Settings", "Experiment"].map(
          (text: string) => {
            const isActive =
              location.pathname ===
              `/${text.split(" ").join("").toLowerCase()}`;

            return (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() =>
                    handleNavigate(`/${text.split(" ").join("").toLowerCase()}`)
                  }
                  sx={{
                    backgroundColor: isActive
                      ? theme.palette.primary.main
                      : "transparent",
                    color: isActive ? theme.palette.common.white : "inherit",
                    "&:hover": {
                      backgroundColor: isActive
                        ? theme.palette.primary.dark
                        : theme.palette.action.hover,
                    },
                    borderRadius: "8px",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? theme.palette.common.white : "inherit",
                    }}
                  >
                    {iconMap[text]}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            );
          },
        )}
      </List>
    </div>
  );
}

export default CustomDrawer;
