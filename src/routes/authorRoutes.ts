import { Router } from "express";
import {
  createAuthor,
  getBooksByAuthor,

} from "../controllers/authorController";

const router = Router();

// router.get("/", getUsers);
// router.delete("/", isAuthor, deleteUsers);
// router.get("/:id", getUserById);
router.post("/create", createAuthor);
router.get("/:authorId/books", getBooksByAuthor);



export default router;
