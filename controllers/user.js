import bcrypt from 'bcryptjs';
import StellarSdk from 'stellar-sdk';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { user } from '../database/models';

dotenv.config();

class User {
  static async keyPairs(done) {
    const pair = StellarSdk.Keypair.random();

    const privateKey = pair.secret();
    const publicKey = pair.publicKey();
    done(publicKey, privateKey);
  }

  static async create(req, res) {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10);

      return User.keyPairs(async (publicKey, privateKey) => {
        req.body = { ...req.body, publicKey, privateKey };

        try {
          const result = await user.create(req.body);

          const {
            id, name, email, type
          } = result;

          const token = jwt.sign({ id, publicKey }, process.env.SECRET);

          return res.status(201).json({
            status: 201,
            user: {
              id, name, email, type
            },
            token,
            publicKey,
            privateKey,
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
      });
    } catch (e) {
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

    if (!findUser) {
      res.status(404).json({
        status: 404,
        error: 'User don\'t match',
      });
    }

    if (
      bcrypt.compareSync(req.body.password, findUser.dataValues.password)
    ) {
      const payload = {
        id: findUser.id,
        publicKey: findUser.publicKey,
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

  static async getUser(req, res) {
    const { id } = req.params;
    try {
      const foundUser = await user.findOne({ where: { id } });
      if (!foundUser) {
        return res.status(404).json({
          status: 404,
          message: 'User not found!',
        });
      }
      const userInfo = {
        name: foundUser.name,
        gender: foundUser.gender,
        age: foundUser.age,
        nationality: foundUser.nationality,
        type: foundUser.type,
        createdAt: foundUser.createdAt,
      };
      return res.status(200).json({
        status: 200,
        user: userInfo,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error,
      });
    }
  }
}

export default User;
