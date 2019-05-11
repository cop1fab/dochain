// eslint-disable-next-line no-unused-vars
import bcrypt from 'bcryptjs';
import db from '../database/models';

export default class BlockChain {
  static async create(req, res) {
    let prevHash = '';
    const { publicKey } = req.user;
    const newBlockchain = {
      prevHash: '',
      data: req.body.data,
      currHash: bcrypt.hashSync(JSON.stringify(req.body.data), 10),
      fromPublicKey: publicKey,
      toPublicKey: req.body.topk
    };


    const createdBlock = await db.BlockChain.create(newBlockchain);

    const allBlocks = await db.BlockChain.findAll();

    if (allBlocks.length > 1 && createdBlock) {
      const checkPrevHash = await db.BlockChain.findOne({
        where: { id: createdBlock.dataValues.id - 1 },
      });
      prevHash = checkPrevHash.dataValues.currHash;
    }

    const updatedBlock = await db.BlockChain.update(
      {
        prevHash,
        currHash: bcrypt.hashSync(
          JSON.stringify({
            blockId: createdBlock.dataValues.id,
            data: createdBlock.dataValues.data,
          }),
        ),
      },
      { where: { id: createdBlock.dataValues.id }, returning: true },
    );

    return res.status(201).json({
      block: updatedBlock[1][0],
    });
  }
}
