import { Router } from "express";
import {
  getHello,
  createUser,
  getUserById,
  getUsers,
} from "../controllers/userController";

const router = Router();

router.get("/hello", getHello);
router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

export default router;
