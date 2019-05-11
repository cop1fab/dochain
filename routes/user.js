import express from 'express';
import user from '../controllers/user';
import validators from '../middlewares/validators/user';

const router = express.Router();

router.post('/signup', validators.create, user.create);
router.post('/login', user.login);

export default router;
