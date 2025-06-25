import express from 'express';
import { register, login } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/admin-only', protect, authorize('admin'), (req, res) => res.json({ message: 'Welcome admin!' }))
router.get('/protected', protect, (req, res) => res.json({ message: 'Welcome user!' }))
router.get('/non-protected', (req, res) => res.json({ message: 'Welcome user!' }))

export default router;