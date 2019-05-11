import express from 'express';
import user from '../controllers/user';
import validators from '../middlewares/validators/user';

const router = express.Router();

router.route('/signup')
  .post(validators.create, user.create);

export default user;
