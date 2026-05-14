import { createBook, deleteBookById, getBookById } from '@/controllers/bookController'
// import { isAuthor } from '@/middlewares/author';
import { Router } from 'express'

const router = Router()

router.post("/", createBook);
router.get("/:id", getBookById);
// router.get("/search", findBookByNames);
router.delete("/:id", deleteBookById);


export default router