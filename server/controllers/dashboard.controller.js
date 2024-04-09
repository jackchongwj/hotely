import User from "../models/User.js";

export const dashboard = async (req, res) => {
  try {
    // Retrieve user details from the database using the authenticated user ID
    const user = await User.findById(req.user);

    // Send user details to the dashboard view
    res.status(200).json({
      user: {
        displayName: user.fname,
        id: user._id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

