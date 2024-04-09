import User from '../models/User.js'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body

    // Check if user with the email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists.' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = new User({
      fname,
      lname,
      email,
      password: hashedPassword,
    })

    // Save the user to the database
    await newUser.save()
    console.log('newUser', newUser)

    res
      .status(201)
      .json({ message: 'User registered successfully.', status: 'ok' })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user with the email exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    console.log('useruser', user)

    // Check if the password matches
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: 'Invalid credentials.', redirectUrl: '/dashboard' })
    }

    // Generate and return JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    })
    res.json({ status: 'ok', data: token, user })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ status: 'error', message: 'Server error' })
  }
}
