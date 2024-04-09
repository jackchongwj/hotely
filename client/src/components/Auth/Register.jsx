import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Typography, TextField } from '@mui/material'
import logo from 'assets/logo.png'

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
    height: '700px',
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
  loginButton: {
    mt: 2,
    display: 'flex',
    justifyContent: 'center',
  },
}

const Register = () => {
  const [fname, setFirstName] = useState('')
  const [lname, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value)
  }

  const handleLastNameChange = (e) => {
    setLastName(e.target.value)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(fname, lname, email, password)
    fetch('http://localhost:5001/auth/register', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
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
        console.log(data, 'userRegister')
        if (data.status == 'ok') {
          alert('Registration Successful')
        } else {
          alert('Something went wrong')
        }
      })
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.formContainer}>
        <Box component='img' alt='logo' src={logo} sx={styles.logoContainer} />
        <Typography variant='h3' gutterBottom sx={{ fontWeight: 'bold' }}>
          Register
        </Typography>
        <Box component='form' onSubmit={handleSubmit} sx={styles.form}>
          <Box sx={styles.field}>
            <TextField
              label='First Name'
              type='text'
              fullWidth
              value={fname}
              onChange={handleFirstNameChange}
              required
              InputLabelProps={{
                style: { color: 'black' },
              }}
              InputProps={{ style: { color: 'black' } }}
            />
          </Box>
          <Box sx={styles.field}>
            <TextField
              label='Last Name'
              type='text'
              fullWidth
              value={lname}
              onChange={handleLastNameChange}
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
              label='Email Address'
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
            Register
          </Button>
          <Typography sx={styles.loginButton}>
            Already have an account?{' '}
            <Button
              component={RouterLink}
              to='/login'
              color='primary'
              variant='text'
            >
              Login
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Register
