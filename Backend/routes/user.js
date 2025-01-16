const express = require("express");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  blockOrUnblockUser,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");

const router = express.Router();

// Admin: Get all users
router.get("/", auth, getAllUsers);

// User/Admin: Update user info (Admin can update any user, user can update their own info)
router.put("/:id", auth, updateUser);
router.put("/me", auth, updateUser); // User updates their own info

// Admin: Delete a user
router.delete("/:id", auth, deleteUser);

router.put("/:id/block", auth, blockOrUnblockUser);

module.exports = router;
