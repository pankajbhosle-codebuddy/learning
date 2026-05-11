import { getBooksByAuthor } from '@/controllers/authorController'
import { Router } from 'express'

const router = Router()

router.get("/:authorId/books", getBooksByAuthor);


export default router