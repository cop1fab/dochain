import express from 'express';
import cheke from 'cheke';
import checktoken from '../helpers/checkToken';
import BlockChainController from '../controllers/BlockChain';

import asyncHandler from '../helpers/asyncHandler';

const router = express.Router();

router.post(
  '/',
  cheke({ body: { data: 'required|object', topk: 'required|string' } }),
  checktoken,
  asyncHandler(BlockChainController.create),
);

export default router;
