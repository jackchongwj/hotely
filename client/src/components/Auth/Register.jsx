import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Alert, Box, Button, Typography, TextField } from "@mui/material";
import logo from "assets/logo.png";
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  formContainer: {
    p: 2,
    border: "2px solid black",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "700px",
    width: "450px",
    margin: "auto",
    backgroundColor: "white",
    color: "black",
  },
  logoContainer: {
    height: "200px",
    width: "200px",
    borderRadius: "50%",
    mb: 4,
  },
  form: {
    width: "80%",
  },
  field: {
    width: "100%",
    mb: 2,
  },
  submitButton: {
    width: "80%",
    display: "flex",
    justifyContent: "center",
    margin: "0 auto",
    mt: 2,
  },
  loginButton: {
    mt: 2,
    display: "flex",
    justifyContent: "center",
  },
};

const Register = () => {
  const [fname, setFirstName] = useState('');
  const [lname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(fname, lname, email, password);
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        fname,
        lname,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setAlert({
            show: true,
            message: "Registration Successful. Redirecting to login...",
            severity: "success",
          });
          // Redirect after showing the message or set a timeout to redirect
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setAlert({
            show: true,
            message: data.message || "Failed to register. Please try again.",
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert({
          show: true,
          message: "An error occurred. Please try again later.",
          severity: "error",
        });
      });
  };

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });
  
  return (
    <Box sx={styles.container}>
      {alert.show && (
        <Box sx={{ width: "100%", mt: 2 }}>
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Box>
      )}
      <Box sx={styles.formContainer}>
        <Box component="img" alt="logo" src={logo} sx={styles.logoContainer} />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
          <Box sx={styles.field}>
            <TextField
              label="First Name"
              type="text"
              fullWidth
              value={fname}
              onChange={handleFirstNameChange}
              required
              InputLabelProps={{
                style: { color: "black" },
              }}
              InputProps={{ style: { color: "black" } }}
            />
          </Box>
          <Box sx={styles.field}>
            <TextField
              label="Last Name"
              type="text"
              fullWidth
              value={lname}
              onChange={handleLastNameChange}
              required
              InputLabelProps={{
                style: { color: "black" },
              }}
              InputProps={{
                style: { color: "black" },
              }}
            />
          </Box>
          <Box sx={styles.field}>
            <TextField
              error={emailError}
              helperText={emailError ? "Please enter a valid email." : ""}
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={handleEmailChange}
              required
              InputLabelProps={{
                style: { color: "black" },
              }}
              InputProps={{
                style: { color: "black" },
              }}
            />
          </Box>
          <Box sx={styles.field}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={handlePasswordChange}
              required
              InputLabelProps={{
                style: { color: "black" },
              }}
              InputProps={{
                style: { color: "black" },
              }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={styles.submitButton}
          >
            Register
          </Button>
          <Typography sx={styles.loginButton}>
            Already have an account?{" "}
            <Button
              component={RouterLink}
              to="/login"
              color="primary"
              variant="text"
            >
              Login
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
