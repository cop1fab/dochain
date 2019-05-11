import express from 'express';
import user from './user';
import blockchains from './blockchains';

const router = express.Router();

router.use('/blockchains', blockchains);
router.use('/auth', user);
router.use('/users', user);

export default router;
