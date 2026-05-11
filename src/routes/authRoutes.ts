import { login } from '@/controllers/authController'
import { createUser } from '@/controllers/userController';
import { Router } from 'express'

const router = Router()

router.post('/login', login)
router.post("/signup", createUser);



export default router