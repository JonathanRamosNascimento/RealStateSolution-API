const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

module.exports = {
  async index(req, res) {
    const users = await User.find();

    return res.json(users);
  },

  async store(req, res) {
    const { email } = req.body;
    try {
      if (await User.findOne({ email }))
        return res.status(400).send({ error: 'Este email já esta foi cadastrado!' });
      const user = await User.create(req.body);

      user.password = undefined;

      return res.json({ user, token: generateToken({ id: user._id }) });
    } catch (err) {
      return res.status(400).send({ error: 'Falha no registro! ' + err });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
      return res.status(400).send({ error: 'Usuário não encontrado' });

    if (!await bcrypt.compare(password, user.password))
      return res.status(400).send({ error: 'Senha invalida!' })

    user.password = undefined;

    res.send({ user, token: generateToken({ id: user._id }) });
  }
}