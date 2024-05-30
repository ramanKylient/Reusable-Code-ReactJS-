import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  Box,
  TextField,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { signIn } from "../../utilities/service/auth";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

const defaultTheme = createTheme();

function LoginForm() {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true
    const data = new FormData(event.currentTarget);
    const user = {
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      const signInResponse = await signIn(user);
      console.log(signInResponse); // Do something with the signIn response

      // Assuming signInResponse contains a token
      localStorage.setItem("token", signInResponse.token);
      navigate("/");
      setTimeout(() => {
        toast.success("Login successfully!");
      }, 300);
    } catch (error) {
      console.error("Sign in failed:", error); // Handle sign in error
      // Assuming error response has a message field
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(`Sign in failed: ${errorMessage}`);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={6}
            sx={{
              backgroundImage: "url(logo512.png)",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#282c34",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={6}
            component={Paper}
            elevation={2}
            square
          >
            <Box
              sx={{
                my: 12,
                mx: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Grid container>
                  <Grid item xs>
                    <FormControlLabel
                      control={<Checkbox value="remember" color="primary" />}
                      label="Remember me"
                    />
                  </Grid>
                  <Grid item>
                    <GoogleOAuthProvider
                      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    >
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          console.log(credentialResponse);
                          // Assuming signInResponse contains a token
                          localStorage.setItem(
                            "token",
                            credentialResponse.credential
                          );
                          navigate("/");
                          setTimeout(() => {
                            toast.success("Login successfully!");
                          }, 300);
                        }}
                        onError={() => {
                          console.log("Login Failed");
                        }}
                      />
                    </GoogleOAuthProvider>
                  </Grid>
                </Grid>{" "}
                <LoadingButton
                  loading={loading} // Use loading state here
                  loadingPosition="start"
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </LoadingButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
      <ToastContainer />
    </>
  );
}

export default LoginForm;
