import express from 'express';
import user from './user';
import blockchains from './blockchains';

const router = express.Router();

router.use('/blockchains', blockchains);
router.use('/auth', user);

export default router;
