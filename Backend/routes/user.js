const express = require("express");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  blockOrUnblockUser,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");

const router = express.Router();


router.get("/", auth, getAllUsers);
router.put("/:id", auth, updateUser);
router.put("/me", auth, updateUser); 
router.delete("/:id", auth, deleteUser);
router.put("/:id/block", auth, blockOrUnblockUser);

module.exports = router;
