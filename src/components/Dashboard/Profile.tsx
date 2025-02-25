import Box from "@mui/material/Box";
import wallpaper from "../../assets/wallpaper.jpg";
import {
  Card,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Chip,
  IconButton,
  CardMedia,
} from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./profile.module.css";
import * as yup from "yup";
import { useForm } from "@tanstack/react-form";
import { yupValidator } from "@tanstack/yup-form-adapter";
import { User } from "../../type/type.ts";
import { updateUserData } from "../../service/http.ts";
import SettingsIcon from "@mui/icons-material/Settings";
import { useGenres } from "../../hooks/useGenres.ts";
import { useNavigate } from "react-router-dom";
import { SETTINGS } from "../../utils/consts.ts";
import toast from "react-hot-toast";
import avatar from "../../assets/avatar.png";

function Profile({ currentUser }: { currentUser: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: genres, isLoading } = useGenres();
  const navigate = useNavigate();

  const form = useForm<User>({
    defaultValues: {
      name: currentUser.name || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || "",
      photo: currentUser?.photo || "",
      uid: currentUser.uid || "",
      bio: currentUser.bio || "",
      readingGoals: currentUser.readingGoals || 0,
      favoriteGenres: currentUser.favoriteGenres || [],
    },
    onSubmit: (value) => {
      console.log("Data:", value);
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    validatorAdapter: yupValidator(),
  });
  const handleFieldChange =
    (fieldName: string) => (e: ChangeEvent<HTMLInputElement>) => {
      // @ts-ignore
      form.setFieldValue(fieldName, e.target.value);
    };

  // };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const updatedData = {
      name: form.store.state.values.name,
      lastName: form.store.state.values.lastName,
      photo: form.store.state.values.photo,
      uid: form.store.state.values.uid,
      bio: form.store.state.values.bio,
      readingGoals: form.store.state.values.readingGoals,
      favoriteGenres: form.store.state.values.favoriteGenres,
    };
    try {
      await updateUserData(currentUser?.uid, updatedData);
      setIsEditing(false);

      toast.success("User data updated successfully! 👍", {
        position: "top-center",
        // @ts-ignore
        autoClose: 50000,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data! 😞", {
        position: "top-center",
        // @ts-ignore
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "200px",
          backgroundImage: `url(${wallpaper})`,
        }}
      ></Box>

      <Card sx={{ marginTop: 50, margin: "auto" }}>
        <CardMedia
          className={styles.avatar}
          component="img"
          image={avatar}
          alt={"avatar photo"}
          sx={{ borderRadius: "20%", width: "150px" }}
        />
        <Typography variant="h2" gutterBottom>
          {isEditing ? "Edit Your Profile" : " Profile"}
        </Typography>

        <IconButton
          onClick={() => navigate(SETTINGS)}
          style={{ position: "absolute", bottom: "3%", right: "22%" }}
        >
          <SettingsIcon fontSize="large" />
        </IconButton>

        <form
          style={{ padding: "30px", width: "60%", margin: "0 auto" }}
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            validators={{
              onChange: (value) => {
                try {
                  yup
                    .string()
                    .required("Обязательное поле")
                    .validateSync(value);
                  return undefined;
                } catch (error) {
                  if (error instanceof Error) {
                    return error.message;
                  }
                }
              },
            }}
            children={(field) => {
              return (
                <>
                  {!!field.state.meta.errors.length &&
                    field.state.meta.isTouched && (
                      <div>{field.state.meta.errors.join(", ")}</div>
                    )}
                  <TextField
                    fullWidth
                    variant="standard"
                    label="First Name"
                    id="name-input"
                    disabled={!isEditing}
                    style={{ margin: "25px auto" }}
                    type="text"
                    value={field.state.value}
                    onChange={handleFieldChange("name")}
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
              onChange: (value) => {
                try {
                  yup
                    .string()
                    .required("Обязательное поле")
                    .validateSync(value);
                  return undefined;
                } catch (error) {
                  if (error instanceof Error) {
                    return error.message;
                  }
                }
              },
            }}
            children={(field) => {
              return (
                <TextField
                  id="lastName-input"
                  label="Last Name"
                  fullWidth
                  variant="standard"
                  disabled={!isEditing}
                  type="text"
                  style={{ margin: "25px auto" }}
                  autoComplete="current-lasName"
                  value={field.state.value}
                  onChange={handleFieldChange("lastName")}
                  onBlur={field.handleBlur}
                  error={!!field.state.meta.errors.length}
                />
              );
            }}
          />

          <form.Field
            name="bio"
            validators={{
              onChange: (value) => {
                try {
                  yup.string().validateSync(value);
                  return undefined;
                } catch (error) {
                  if (error instanceof Error) {
                    return error.message;
                  }
                }
              },
            }}
            children={(field) => {
              return (
                <TextField
                  id="bio-input"
                  label="Bio"
                  fullWidth
                  multiline
                  maxRows={20}
                  variant="standard"
                  disabled={!isEditing}
                  type="text"
                  style={{ margin: "25px auto" }}
                  value={field.state.value}
                  onChange={handleFieldChange("bio")}
                  onBlur={field.handleBlur}
                  error={!!field.state.meta.errors.length}
                  helperText={field.state.meta.errors.join(", ")}
                />
              );
            }}
          />
          <form.Field
            name="readingGoals"
            validators={{
              // @ts-ignore
              onChange: yup.number().positive(),
            }}
            children={(field) => {
              return (
                <TextField
                  id="readingGoals-input"
                  label="Reading Goals"
                  fullWidth
                  variant="standard"
                  disabled={!isEditing}
                  type="number"
                  style={{ margin: "25px auto" }}
                  autoComplete="current-readingGoals"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(+e.target.value);
                  }}
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
            children={(field) => {
              return (
                <>
                  <Autocomplete
                    multiple
                    // @ts-ignore
                    options={genres}
                    style={{ margin: "25px auto" }}
                    getOptionLabel={(option) => option.name}
                    value={field.state.value || []}
                    disabled={!isEditing}
                    onChange={(_e, value) => field.handleChange(value)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={`${option.id}-${option.name}`}
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
                {!isEditing ? (
                  <Button variant="outlined" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="secondary"
                    disabled={!canSubmit}
                    onClick={(e) => {
                      setIsEditing(false);
                      handleSubmit(e);
                    }}
                  >
                    Save
                  </Button>
                )}
              </>
            )}
          />
        </form>
      </Card>
    </>
  );
}

export default Profile;
