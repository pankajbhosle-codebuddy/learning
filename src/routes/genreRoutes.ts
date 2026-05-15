import { createGenre, getBooksByGenre } from '@/controllers/genreController'
import { Router } from 'express'

const router = Router()

router.post("/", createGenre);
router.get("/:genreId/books", getBooksByGenre);


export default router