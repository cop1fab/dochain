// eslint-disable-next-line no-unused-vars
import bcrypt from 'bcryptjs';
import db from '../database/models';

export default class BlockChain {
  static async create(req, res) {
    let prevHash = '';
    const { publicKey } = req.user;
    console.log(publicKey);
    const newBlockchain = {
      prevHash: '',
      data: { ...req.body.data, organization: req.user.name },
      currHash: bcrypt.hashSync(JSON.stringify(req.body.data), 10),
      fromPublicKey: publicKey,
      toPublicKey: req.body.toPublicKey,
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

  static async getAllByKey(req, res) {
    const allBlocks = await db.BlockChain.findAll({ where: { toPublicKey: req.params.publicKey } });

    if (allBlocks.length > 0) {
      return res.status(200).json({
        records: allBlocks,
      });
    }

    return res.status(404).json({
      error: 'no record found',
    });
  }
}
