import { createBook, deleteBookById, findBookByNames, getBooks } from '@/controllers/bookController'
import { isAuthor } from '@/middlewares/author';
import { Router } from 'express'

const router = Router()

router.post("/", createBook);
router.get("/", getBooks);
router.get("/search", findBookByNames);
router.delete("/:id", isAuthor, deleteBookById);


export default router