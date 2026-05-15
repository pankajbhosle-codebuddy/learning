import { createBook, deleteBookById, getBookById } from '@/controllers/bookController'
import { Router } from 'express'

const router = Router()

router.post("/", createBook);
router.get("/:id", getBookById);
router.delete("/:id", deleteBookById);


export default router