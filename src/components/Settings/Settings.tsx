import React, { FormEvent, useState } from "react";
import {
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Button,
  TextField,
  OutlinedInput,
  IconButton,
  InputAdornment,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useTheme } from "../Contexts/ThemeContext.tsx";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateEmail,
} from "firebase/auth";
import { auth, db } from "../../../firebase.ts";
import { doc, updateDoc } from "firebase/firestore";
import { User } from "../../type/type.ts";
import { deleteAccount } from "../../service/http.ts";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE } from "../../utils/consts.ts";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "@tanstack/react-form";
import { yupValidator } from "@tanstack/yup-form-adapter";
import * as yup from "yup";

const Settings = ({
  currentUser,
  refetch,
}: {
  currentUser: User;
  refetch: () => void;
}) => {
  const { theme, toggleTheme } = useTheme();
  const user = auth.currentUser;
  const [newPassword, setNewPassword] = useState(currentUser.password);
  const [currentPass, setCurrentPass] = useState(currentUser.password);
  const [currentMail, setCurrentMail] = useState(user?.email);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: currentMail || "",
      newPassword: "",
      currentPassword: currentPass,
      theme: currentUser?.theme ? currentUser.theme : "",
      notificationEnabled:
        currentUser.notificationEnabled !== undefined
          ? currentUser.notificationEnabled
          : true,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted with values:", value);

      if (!user || !user.email) {
        alert("No user is signed in.");
        return;
      }

      try {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentUser.password as string,
        );
        await reauthenticateWithCredential(user, credential);

        if (value.email !== user.email) {
          await updateEmail(user, value.email);
          setCurrentMail(value.email);
          alert("Email updated successfully!");
        }

        if (value.newPassword) {
          await updatePassword(user, value.newPassword);
          setCurrentPass(value.newPassword);
        }

        const userRef = doc(db, "user", user.uid);
        await updateDoc(userRef, {
          password: newPassword,
        });
        refetch();

        alert("Changes saved successfully!");
      } catch (error: any) {
        console.error("Error saving changes:", error);
        switch (error.code) {
          case "auth/invalid-credential":
            alert("Invalid current password. Please try again.");
            break;
          case "auth/requires-recent-login":
            alert("This operation requires recent login. Please log in again.");
            break;
          default:
            alert(`Failed to save changes: ${error.message}`);
        }
      }
    },
    validatorAdapter: yupValidator(),
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleDeleteAccount = async () => {
    const isDeleteSuccessful = await deleteAccount(
      form.getFieldValue("newPassword"),
    );
    if (isDeleteSuccessful) {
      navigate(LOGIN_ROUTE);
    }
  };

  const handleThemeToggle = async () => {
    const user = auth.currentUser;

    if (user) {
      toggleTheme();
      const userRef = doc(db, "user", user.uid);
      await updateDoc(userRef, {
        theme: theme === "light" ? "dark" : "light",
      });
      refetch();
      localStorage.setItem("theme", JSON.stringify([theme, user.uid]));
    }
  };

  const handleNotificationToggle = async (newStatus: boolean) => {
    if (!user) return;
    const userRef = doc(db, "user", user.uid);
    await updateDoc(userRef, {
      notificationEnabled: newStatus,
    });
    refetch();
  };

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        console.log("Form submission triggered");
        form.handleSubmit();
        console.log("After form.handleSubmit");
      }}
      style={{ width: "70%", margin: "0 auto" }}
    >
      <Box sx={{ p: 3 }} color="primary">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <form.Field
            name="theme"
            children={(field) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Theme & Appearance
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentUser.theme === "dark" || theme === "dark"}
                      onChange={(e) => {
                        handleThemeToggle();
                        field.handleChange(e.target.value);
                      }}
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                />
              </Box>
            )}
          />

          <form.Field
            // @ts-ignore
            name="notificationsEnabled"
            // @ts-ignore
            children={(field) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Notification Preferences
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={currentUser?.notificationEnabled}
                      onChange={(e) => {
                        handleNotificationToggle(e.target.checked);
                        field.handleChange(e.target.value);
                      }}
                      color="primary"
                    />
                  }
                  label="Enable Reminders"
                />
              </Box>
            )}
          />
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Account Settings
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <form.Field
            name="email"
            validators={{
              onChange: yup
                .string()
                .email("Please enter a valid email")
                .required("Email is required"),
            }}
            children={(field) => (
              <FormControl>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  id="email"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setCurrentMail(e.target.value);
                  }}
                  onBlur={field.handleBlur}
                  error={!!field.state.meta.errors.length}
                  helperText={field.state.meta.errors.join(", ")}
                  sx={{ mb: 2 }}
                />
              </FormControl>
            )}
          />

          <form.Field
            name="currentPassword"
            validators={{
              onChange: yup
                .string()
                .min(6, "Password must be at least 6 characters"),
            }}
            children={(field) => (
              <FormControl>
                <InputLabel htmlFor="currentPassword-password">
                  Current Password
                </InputLabel>
                <OutlinedInput
                  disabled={true}
                  id="current-password"
                  type={"text"}
                  value={currentPass}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setNewPassword(e.target.value);
                  }}
                  onBlur={field.handleBlur}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="New Password"
                />
              </FormControl>
            )}
          />

          <form.Field
            name="newPassword"
            validators={{
              onChange: yup
                .string()
                .min(6, "Password must be at least 6 characters"),
            }}
            children={(field) => (
              <FormControl>
                <InputLabel htmlFor="new-password">New Password</InputLabel>
                <OutlinedInput
                  id="new-password"
                  placeholder={currentPass}
                  type={showPassword ? "text" : "password"}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setNewPassword(e.target.value);
                  }}
                  onBlur={field.handleBlur}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="New Password"
                />
              </FormControl>
            )}
          />
        </Box>

        <Box sx={{ marginTop: "30px" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAccount}
            sx={{
              backgroundColor: "transparent",
              color: "red",
              "&:hover": { backgroundColor: "#bd2121", color: "#fff" },
            }}
          >
            Delete Account
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default Settings;
