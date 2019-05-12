import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { user } from '../database/models';


dotenv.config();

const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: 401,
      message: 'Authorization is missing',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const jwtPayload = jwt.verify(token, process.env.SECRET);
    const result = await user.findOne({ where: { publicKey: jwtPayload.publicKey } });

    if (result) {
      req.user = result.dataValues;
      return next();
    }

    return res.status(400).json({
      status: 404,
      message: 'User not found',
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

export default checkToken;
