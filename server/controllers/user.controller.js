import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

    // Create a new user object
    const user = new User({
      fname,
      lname,
      email,
      password,
    });

    // Save the user to the database
    await user.save();

    // Return the newly created user object
    res.status(201).json({
      user,
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the user from the database
    const user = await User.findById(id);

    // Return the user object
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fname, lname, email, password } = req.body;

    // Find the user in the database and update its details
    const user = await User.findByIdAndUpdate(
      id,
      {
        fname,
        lname,
        email,
        password,
      },
      { new: true } // return the updated user object
    );

    // Return the updated user object
    res.status(200).json({
      user,
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the user from the database
    await User.findByIdAndDelete(id);

    // Return a success message
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};