import express from "express";
import user from '../contollers/userController.js'

const router = express.Router();


router.get('/', user.getAllUsers)
router.post('/', user.createUser)
router.post('/login', user.login)
router.get('/user/:id', user.getUser)
router.put('/user/:id', user.updateUser)
router.delete('/user/:id', user.deleteUser)






export default router