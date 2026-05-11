import { Router } from "express";
import {
  getUserById,
  getUsers,
  deleteUsers,
} from "../controllers/userController";
import { protect } from "@/middlewares/auth";
import { isAuthor } from "@/middlewares/author";

const router = Router();

router.get("/", getUsers);
router.delete("/", isAuthor, deleteUsers);
router.get("/:id", getUserById);

export default router;
