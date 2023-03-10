import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Alert, IconButton, InputAdornment, Snackbar } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
//For Login Auth Redux
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useState, useEffect } from "react";
// import { login } from "../components/ReduxContainer/ApiCall";
import Joi from "joi";
import {
  loginStart,
  loginFailure,
  loginSuccess,
} from "../components/ReduxContainer/UserReducer";

const theme = createTheme();

export default function Login() {
  const [eroor, setErrorMessage] = useState("");
  const [open3, setOpen3] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen3(false);
  };
  const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
      const res = await axios.post(
        `http://localhost:5000/api/user/login`,
        user
      );
      dispatch(loginSuccess(res.data));
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setOpen3(true);
      dispatch(loginFailure(eroor)); 
    }
  };

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const userDetails = user.user;
  const { isFetching, error } = useSelector((state) => state.user);
  useEffect(() => {}, [user, userDetails]);
  // const [email, setemail] = useState('');
  // const [password, setPassword] = useState('');
  var emailPWChecker = "";
  const handleSubmit = (e) => {
    // e.preventDefault();

    if (userDetails?.noUser) {
      emailPWChecker = userDetails?.noUser;
      alert(emailPWChecker);
    }

    login(dispatch, form);
    console.log(form);
  };

  const handleClick = (e) => {
    e.preventDefault();
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setForm({
      ...form,
      [input.name]: input.value,
    });

    const result = schema
      .extract(input.name)
      .label(input.name)
      .validate(input.value);

    if (result.error) {
      setErrors({ ...errors, [input.name]: result.error.details[0].message });
    } else {
      delete errors[input.name];
      setErrors(errors);
    }
  };

  const [errors, setErrors] = useState({
    form,
  });

  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().min(6).max(20).required(),
  });

  const isFormInvalid = () => {
    const result = schema.validate(form);

    return !!result.error;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Snackbar open={open3} autoHideDuration={4000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {eroor}
            </Alert>
          </Snackbar>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleClick}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              name="email"
              onChange={handleChange}
              value={form.email}
              fullWidth
              // id="email"
              label="Email"
              autoComplete="email"
            />
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              error={!!errors.password}
              helperText={errors.password}
              name="password"
              label="Password"
              onChange={handleChange}
              value={form.password}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
              disabled={isFormInvalid()}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to={"/forgot/password"} variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to={"/signup"} variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
