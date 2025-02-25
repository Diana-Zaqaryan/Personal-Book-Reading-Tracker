import React, { FormEvent, useState } from "react";
import {
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import * as yup from "yup";
import { useForm } from "@tanstack/react-form";
import { yupValidator } from "@tanstack/yup-form-adapter";

import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail } from "../../service/http.ts";
import Box from "@mui/material/Box";
import toast from "react-hot-toast";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface formModule {
  login: string;
  password: string;
}

function Login({ handleSetUp }: { handleSetUp: (value: boolean) => void }) {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<formModule>({
    defaultValues: {
      login: "",
      password: "",
    },
    onSubmit: (value) => {
      console.log("Отправленные данные:", value);
    },
    // @ts-ignore
    validatorAdapter: yupValidator(),
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const login = async () => {
    const { login, password } = form.store.state.values;
    try {
      const isLoginSuccessful = await loginWithEmail(login, password);
      if (isLoginSuccessful) {
        handleSetUp(true);
        setIsSuccess(true);
        setErrorMessage(null);
        toast.success("Login successful! 🎉", {
          position: "top-center",
          // @ts-ignore
          autoClose: 50050,
          theme: "colored",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast.error("Error during login! 😞", {
        position: "top-center",
        // @ts-ignore
        autoClose: 5000,
        theme: "colored",
      });
      setIsSuccess(false);
      setErrorMessage(error.message || "Login failed. Please try again.");
      console.error("Error during login:", error);
    }
  };

  return (
    <Box>
      <Box
        style={{ height: window.innerHeight - 50 }}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box
          style={{ width: "400px", margin: "5em auto" }}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <form
            onSubmit={async (e: FormEvent) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="login"
              validators={{
                // @ts-ignore
                onChange: yup
                  .string()
                  .email("Please enter a valid email address.")
                  .required("Email is required."),
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
                      variant="outlined"
                      label="Login"
                      id="login-input"
                      style={{ margin: "10px auto" }}
                      type="email"
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      onBlur={field.handleBlur}
                      error={!!field.state.meta.errors.length}
                      helperText={field.state.meta.errors.join(", ")}
                    />
                  </>
                );
              }}
            />

            <form.Field
              name="password"
              validators={{
                // @ts-ignore
                onChange: yup
                  .string()
                  .required("Password is required.")
                  .min(6, "Password must be at least 6 characters long.")
                  .matches(
                    /[0-9]/,
                    "Password must contain at least one number.",
                  )
                  .matches(
                    /[A-Z]/,
                    "Password must contain at least one uppercase letter.",
                  )
                  .matches(
                    /[a-z]/,
                    "Password must contain at least one lowercase letter.",
                  ),
              }}
              children={(field) => {
                return (
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={!!field.state.meta.errors.length}
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
                    variant="contained"
                    fullWidth
                    style={{ margin: "20px auto" }}
                    color="primary"
                    onClick={login}
                  >
                    Login
                  </Button>

                  <span>
                    No account ? <Link to={"/sign-up"}>Sign up</Link>
                  </span>
                  {isSuccess && (
                    <Alert severity="success">Login successful!</Alert>
                  )}
                  {errorMessage && (
                    <Alert severity="error">{errorMessage}</Alert>
                  )}
                </>
              )}
            />
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
