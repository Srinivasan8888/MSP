import express from 'express'
const router = express.Router()
import { createMsp, createThreshold} from '../Controller/Insert.Controller.js'

router.post('/create', createMsp)
router.get('/create', createMsp)
router.post('/createThreshold', createThreshold)

export default router;