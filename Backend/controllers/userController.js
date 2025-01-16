const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const users = await User.find().select("-password"); // Exclude password
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.updateUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
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
  
      // Update the name if provided
      if (name) {
        user.name = name;
      }
  
      // Update the password if provided
      if (password) {
        const bcrypt = require("bcrypt");
        user.password = await bcrypt.hash(password, 10);
      }
  
      await user.save();
  
      res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: err.message });
    }
  };
  
  
  
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
  
      