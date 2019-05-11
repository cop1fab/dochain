import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { user } from '../database/models';

dotenv.config();

class User {
  static async create(req, res) {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10);

      const result = await user.create(req.body);

      const { email, type } = result;

      const token = jwt.sign(req.body, process.env.SECRET);

      return res.status(201).json({
        status: 201,
        user: { email, type },
        token,
      });
    } catch (e) {
      if (e.original && e.original.routine === '_bt_check_unique') {
        return res.status(500).json({
          status: 500,
          message: 'Email already exist',
        });
      }

      return res.status(500).json({
        status: 500,
        message: e.message,
      });
    }
  }
}

export default User;
