import { FormEvent, useState } from "react";
import { TextField, Button, Divider, Autocomplete, Chip } from "@mui/material";
import * as yup from "yup";
import { useForm } from "@tanstack/react-form";
import { yupValidator } from "@tanstack/yup-form-adapter";
import GoogleIcon from "@mui/icons-material/Google";
import styles from "./signUp.module.css";

import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithGoogle, signupWithEmail } from "../../service/http.ts";
import { db } from "../../../firebase.ts";
import { useGenres } from "../../hooks/useGenres.ts";
import { HOME } from "../../utils/consts.ts";

function SignUp({ handleSetUp }: { handleSetUp: (value: boolean) => void }) {
  const navigate = useNavigate();
  const { data: genres, isLoading } = useGenres();
  const [selectedGenres, setSelectedGenres] = useState<
    { id: string; name: string }[]
  >([]);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      photo: null,
      bio: "",
      readingGoals: null,
      favoriteGenres: [],
    },
    onSubmit: (value) => {
      console.log("Отправленные данные:", value);
    },
    validatorAdapter: yupValidator(),
  });

  const signUp = async () => {
    const { email, password, firstName, lastName, bio, readingGoals } =
      form.store.state.values;
    try {
      const user = await signupWithEmail(email, password);

      const userRef = doc(db, "user", user.uid);
      await setDoc(userRef, {
        name: firstName,
        lastName,
        email: user.email,
        uid: user.uid,
        readingGoals: readingGoals,
        password,
        bio: bio,
        favoriteGenres: selectedGenres,
      });

      handleSetUp(true);
      navigate(HOME);
      alert("User successfully created!");
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("Error during sign up!");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      const userRef = doc(db, "user", user.uid as string);

      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await setDoc(
          userRef,
          {
            name: userDoc.data().name || "Unknown",
            lastName: userDoc.data().lastName || "User",
            email: user.email,
            uid: user.uid,
          },
          { merge: true },
        );
      } else {
        await setDoc(userRef, {
          name: "Unknown",
          lastName: "User",
          email: user.email,
          uid: user.uid,
        });
      }

      handleSetUp(true);
      alert("Google login successful!");
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Error during Google login!");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Box>
      <Box
        alignItems={"center"}
        justifyContent={"center"}
        display={"flex"}
        width={"75%"}
        margin={"0 auto"}
      >
        <Box
          alignItems={"center"}
          justifyContent={"center"}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            margin: "2em auto",
          }}
        >
          <form
            onSubmit={async (e: FormEvent) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="firstName"
              validators={{
                onChange: yup
                  .string()
                  .min(3, "First name must be at least 3 characters long")
                  .required("First name is required"),
              }}
              children={(field) => {
                return (
                  <>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="First Name"
                      id="firstName-input"
                      sx={{ margin: "0 auto" }}
                      helperText={field.state.meta.errors.join(", ")}
                      type="string"
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      onBlur={field.handleBlur}
                      error={!!field.state.meta.errors.length}
                    />
                  </>
                );
              }}
            />

            <form.Field
              name="lastName"
              validators={{
                onChange: yup
                  .string()
                  .min(3, "Last name must be at least 3 characters long")
                  .required("Last name is required"),
              }}
              children={(field) => {
                return (
                  <>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Last Name"
                      id="lastName-input"
                      sx={{ margin: "0.5em auto" }}
                      type="string"
                      helperText={field.state.meta.errors.join(", ")}
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      onBlur={field.handleBlur}
                      error={!!field.state.meta.errors.length}
                    />
                  </>
                );
              }}
            />

            <form.Field
              name="email"
              validators={{
                onChange: yup
                  .string()
                  .email("Please enter a valid email address")
                  .required("Email is required"),
              }}
              children={(field) => {
                return (
                  <>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Email"
                      id="email-input"
                      sx={{ margin: "0.5em auto" }}
                      type="email"
                      helperText={field.state.meta.errors.join(", ")}
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      onBlur={field.handleBlur}
                      error={!!field.state.meta.errors.length}
                    />
                  </>
                );
              }}
            />

            <form.Field
              name="password"
              validators={{
                onChange: yup
                  .string()
                  .required("Password is required")
                  .min(6, "Password must be at least 6 characters long")
                  .matches(/[0-9]/, "Password must contain at least one number")
                  .matches(
                    /[A-Z]/,
                    "Password must contain at least one uppercase letter",
                  )
                  .matches(
                    /[a-z]/,
                    "Password must contain at least one lowercase letter",
                  ),
              }}
              children={(field) => {
                return (
                  <TextField
                    id="password-input"
                    label="Password"
                    fullWidth
                    sx={{ margin: "0.5em auto" }}
                    variant="outlined"
                    type="password"
                    helperText={field.state.meta.errors.join(", ")}
                    autoComplete="current-password"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                    }}
                    onBlur={field.handleBlur}
                    error={!!field.state.meta.errors.length}
                  />
                );
              }}
            />

            <form.Field
              name="bio"
              validators={{
                onChange: yup.string(),
              }}
              children={(field) => {
                return (
                  <TextField
                    id="bio-input"
                    label="Bio"
                    fullWidth
                    multiline
                    maxRows={4}
                    sx={{ margin: "0.5em auto" }}
                    variant="outlined"
                    type="text"
                    autoComplete="current-lastName"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors.join(", ")}
                  />
                );
              }}
            />
            <form.Field
              name="readingGoals"
              children={(field) => {
                return (
                  <TextField
                    id="readingGoals-input"
                    label="Reading Goals"
                    fullWidth
                    variant="outlined"
                    type="number"
                    sx={{ margin: "0.5em auto" }}
                    autoComplete="current-readingGoals"
                    value={field.state.value}
                    // @ts-ignore
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors.join(", ")}
                  >
                    Books
                  </TextField>
                );
              }}
            />

            <form.Field
              name="favoriteGenres"
              children={(_field) => {
                return (
                  <>
                    <Autocomplete
                      multiple
                      // @ts-ignore
                      options={genres}
                      sx={{ margin: "0.5em auto" }}
                      getOptionLabel={(option) => option.name}
                      value={selectedGenres}
                      onChange={(_event, newValue) =>
                        setSelectedGenres(newValue)
                      }
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            label={option.name}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select Genres" />
                      )}
                      fullWidth
                    />
                  </>
                );
              }}
            />

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit]) => (
                <>
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    style={{ margin: "20px auto" }}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={signUp}
                  >
                    Login
                  </Button>

                  <Divider component="li" sx={{ listStyle: "none" }} />

                  <Box
                    className={styles.box}
                    onClick={loginWithGoogle}
                    component="section"
                    sx={{ p: 2, border: "1px dashed grey" }}
                  >
                    <GoogleIcon />
                    Sign in with Google.
                  </Box>
                </>
              )}
            />
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default SignUp;
