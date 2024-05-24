import User from "../models/User.js";

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
        role: user.role,
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
        role,
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