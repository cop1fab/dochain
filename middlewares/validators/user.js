import Joi from 'joi';

class user {
  static create(req, res, next) {
    const schema = Joi.object().keys({
      username: Joi.string().min(3).max(20),
      picture: Joi.string().regex(/(https?:\/\/.*\.(?:png|jpg|jpeg))/i),
    });

    const result = Joi.validate(req.body, schema);
    if (!result.error) {
      return next();
    }
    return res.status(400).json({
      status: 400,
      message: Joi.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
    });
  }
}

export default user;
