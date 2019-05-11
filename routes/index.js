import express from 'express';
import user from './user';
import validators from '../middlewares/validators/user';

const router = express.Router();

router.use('/auth', validators.create, user.create);

export default router;
