import express from 'express';
import cheke from 'cheke';
import BlockChainController from '../controllers/BlockChain';

import asyncHandler from '../helpers/asyncHandler';

const router = express.Router();

router.post(
  '/',
  cheke({ body: { data: 'required|string|min:1' } }),
  asyncHandler(BlockChainController.create),
);

export default router;
