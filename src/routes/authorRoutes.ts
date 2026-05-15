import { Router } from "express";
import {
  createAuthor,
  getBooksByAuthor,

} from "../controllers/authorController";

const router = Router();

router.post("/create", createAuthor);
router.get("/:authorId/books", getBooksByAuthor);



export default router;
