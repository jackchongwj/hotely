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

    // Save a reference to the refresh token
    await User.updateOne(
      { _id: user._id, "refreshTokens.token": refreshToken },
      { "$set": { "refreshTokens.$.expires": new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000)) } } // 7 days from now
    );
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
    // Use the user ID from the JWT, added by the auth middleware
    const userId = req.userId;

    // Retrieve the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user object, consider omitting sensitive fields
    res.status(200).json({
      user: {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
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