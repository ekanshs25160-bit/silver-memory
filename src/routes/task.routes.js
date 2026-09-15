import {Router} from 'express'
import { createTask } from '../controllers/task.controller.js'
import { verifyJWT, verifyUserRole } from '../middlewares/auth.middleware.js'
import { UserRoleEnum } from '../utils/constants.js'

const router = Router()

router.use(verifyJWT)

router.route('/:projectId').post(createTask)

export default Router