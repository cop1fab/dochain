// eslint-disable-next-line no-unused-vars
import bcrypt from 'bcryptjs';
import db from '../database/models';

export default class BlockChain {
  static async create(req, res) {
    try {
      const newBlockchain = {
        prevHash: '',
        data: req.body.data,
        currHash: bcrypt.hashSync(req.body.data, 10),
      };

      const lastBlockHash = await db.BlockChain.findAll();
      if (lastBlockHash.length > 0) {
        newBlockchain.prevHash = lastBlockHash[lastBlockHash.length - 1].dataValues.currHash;
      }
      const createdBlock = await db.BlockChain.create(newBlockchain);

      return res.status(201).json({ createdBlock });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}
