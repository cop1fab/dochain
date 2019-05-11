import bcrypt from 'bcryptjs';
import { generateKeyPair } from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { user } from '../database/models';

dotenv.config();

class User {
  static async keyPairs(done) {
    try {
      generateKeyPair(
        'rsa',
        {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: 'top secret',
          },
        },
        (err, publicKey, privateKey) => {
          done(publicKey, privateKey);
        },
      );
    } catch (e) {
      return new Error(e.message);
    }
  }

  static async create(req, res) {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10);

      return User.keyPairs(async (publicKey, privateKey) => {
        const token = jwt.sign({ publicKey }, process.env.SECRET);

        req.body = { ...req.body, publicKey, privateKey };

        try {
          const result = await user.create(req.body);

          const { email, type } = result;

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
      return res.status(401).send({
        status: 401,
        message: "Email and password don't match",
      });
    }

    if (!bcrypt.compareSync(req.body.password, findUser.dataValues.password)) {
      return res.status(401).send({
        status: 401,
        message: "Email and password don't match",
      });
    }

    const payload = {
      publicKey: findUser.publicKey,
    };

    return res.status(200).send({
      user: { ...findUser.get(), password: undefined, privateKey: undefined },
      token: jwt.sign(payload, process.env.SECRET),
      message: 'Welcome back!',
    });
  }
}

export default User;
