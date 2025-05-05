import express from 'express'
const router = express.Router()
import { createMsp } from '../Controller/Insert.Controller.js'

router.post('/create', createMsp)

export default router;