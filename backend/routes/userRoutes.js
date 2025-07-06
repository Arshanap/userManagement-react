import express from 'express';
const router = express.Router();
import { authUser, registerUser, logoutUser,
        getUserProfile, updateUserProfile,
        getUsers, deleteUser, getUserById,
        updateUserByAdmin, createUserByAdmin } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
    .route('/profile')
    .get(protect, getUserProfile)
    .post(protect, updateUserProfile)

router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUserByAdmin);
router.post('/create', protect, admin, createUserByAdmin);




export default  router ;