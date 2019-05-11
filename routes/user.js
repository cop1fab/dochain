import express from 'express';
import user from '../controllers/user';
import validators from '../middlewares/validators/user';
import checkToken from '../helpers/checkToken';

const router = express.Router();

router.post('/signup', validators.create, user.create);
router.post('/login', user.login);
router.get('/:id', checkToken, user.getUser);

export default router;
