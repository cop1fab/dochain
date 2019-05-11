import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { user } from '../database/models';

dotenv.config();

export default class User {
  static async create(req, res) {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10);

      const result = await user.create(req.body);

      const { email, type } = result;

      const token = jwt.sign(req.body, process.env.SECRET);

      return res.status(201).json({
        status: 201,
        user: {
          email,
          type,
        },
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

  // eslint-disable-next-line class-methods-use-this
  static async login(req, res) {
    // eslint-disable-next-line no-shadow
    const findUser = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (
      Object.keys(findUser.dataValues).length > 0
      && bcrypt.compareSync(req.body.password, findUser.dataValues.password)
    ) {
      const payload = {
        id: findUser.dataValues.id,
        email: findUser.dataValues.email,
      };

      delete findUser.dataValues.password;

      return res.status(200).send({
        user: findUser.dataValues,
        token: jwt.sign(payload, process.env.SECRET, {
          expiresIn: '1d',
        }),
        message: 'Welcome back!',
      });
    }
    res.status(400).json({
      status: 400,
      error: 'The action wasn/t successful',
    });
  }
}
