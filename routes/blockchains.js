import express from 'express';
import cheke from 'cheke';
import BlockChainController from '../controllers/BlockChain';

const router = express.Router();

router.post('/', cheke({ body: { data: 'required|string|min:1' } }), BlockChainController.create);

export default router;
