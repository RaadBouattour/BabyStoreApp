const User = require("../models/User");
const bcrypt = require("bcrypt");

// Get all users (excluding admins)
exports.getAllUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const users = await User.find({ isAdmin: false }).select("-password"); // Exclude password
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, address } = req.body;

    // Determine which user to update
    const userId = req.user.isAdmin ? req.params.id : req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for email uniqueness if it's being updated
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
};

// Block or unblock a user (Admin only)
exports.blockOrUnblockUser = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const { blocked } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.blocked = blocked; // Update the blocked status
    await user.save();

    res.status(200).json({
      message: `User has been ${blocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (err) {
    console.error("Error blocking/unblocking user:", err);
    res.status(500).json({ error: err.message });
  }
};
