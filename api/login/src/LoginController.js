const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const DBHelper = require('./util/DBHelper');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const results = await DBHelper.query('SELECT * FROM users WHERE email = ?', [email]);

      if (!results || !results.length) {
        return res.status(200).send({ auth: false });
      }

      const user = results[0];

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
          expiresIn: '7d'
        });

        res.status(200).send({ auth: true, token: token });
      } else {
        res.status(200).send({ auth: false });
      }
    } catch (err) {
      return res.status(500).send();
    }
  },
  authenticate: async (req, res) => {
    let token = req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
      token = token.slice('Bearer '.length, token.length);
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET);

        const results = DBHelper.query('SELECT * FROM users WHERE id = ?', decoded.id);

        if (!results || !results.length) {
          return res.status(200).send({ auth: false });
        }

        const user = results[0];

        res.status(200).json({ auth: true, user });
      } catch (err) {
        return res.status(500).send();
      }
    } else {
      res.status(401).json({
        auth: false,
        message: 'Auth token is not supplied'
      });
    }
  }
};
