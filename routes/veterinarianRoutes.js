import express from "express";
const router = express.Router();
import {
  register,
  profile,
  confirm,
  authenticate,
  recoverPassword,
  checkToken,
  newPassword,
  updateProfile,
  updatePassword,
} from "../controllers/veterinarianController.js";

import checkAuth from "../middleware/authMiddleware.js";

// public area
router.post("/", register);
router.get("/confirm/:token", confirm);
router.post("/login", authenticate);

router.post("/recover-password", recoverPassword);
router.route("/recover-password/:token").get(checkToken).post(newPassword);

// privated area
router.get("/profile", checkAuth, profile);
router.put("/profile/:id", checkAuth, updateProfile);
router.put("/update-password", checkAuth, updatePassword);

export default router;
