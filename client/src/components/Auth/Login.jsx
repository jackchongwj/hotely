import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Typography, TextField } from '@mui/material'
import logo from 'assets/logo.png'
import { useNavigate } from 'react-router-dom'

const BASE_URL = process.env.REACT_APP_BASE_URL

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  formContainer: {
    p: 2,
    border: '2px solid black',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '600px',
    width: '450px',
    margin: 'auto',
    backgroundColor: 'white',
    color: 'black',
  },
  logoContainer: {
    height: '200px',
    width: '200px',
    borderRadius: '50%',
    mb: 4,
  },
  form: {
    width: '80%',
  },
  field: {
    width: '100%',
    mb: 2,
  },
  submitButton: {
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    margin: '0 auto',
    mt: 2,
  },
  registerButton: {
    mt: 2,
    display: 'flex',
    justifyContent: 'center',
  },
}

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(email, password);
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      window.localStorage.setItem('loggedIn', true);
      localStorage.setItem("user", JSON.stringify(data.user)); 
      navigate('/dashboard');
    })
    .catch(error => {
      console.error('Error occurred logging in:', error);
    });
}


  return (
    <Box sx={styles.container}>
      <Box sx={styles.formContainer}>
        <Box component='img' alt='logo' src={logo} sx={styles.logoContainer} />
        <Typography variant='h3' gutterBottom sx={{ fontWeight: 'bold' }}>
          Login
        </Typography>
        <Box component='form' onSubmit={handleSubmit} sx={styles.form}>
          <Box sx={styles.field}>
            <TextField
              label='Email'
              type='email'
              fullWidth
              value={email}
              onChange={handleEmailChange}
              required
              InputLabelProps={{
                style: { color: 'black' },
              }}
              InputProps={{
                style: { color: 'black' },
              }}
            />
          </Box>
          <Box sx={styles.field}>
            <TextField
              label='Password'
              type='password'
              fullWidth
              value={password}
              onChange={handlePasswordChange}
              required
              InputLabelProps={{
                style: { color: 'black' },
              }}
              InputProps={{
                style: { color: 'black' },
              }}
            />
          </Box>
          <Button
            type='submit'
            variant='contained'
            size='large'
            sx={styles.submitButton}
          >
            Login
          </Button>
          <Typography sx={styles.registerButton}>
            Don't have an account?{' '}
            <Button
              component={RouterLink}
              to='/register'
              color='primary'
              variant='text'
            >
              Register
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Login
