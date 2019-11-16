const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const DBHelper = require('./util/DBHelper');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const results = await DBHelper.query('SELECT * FROM users WHERE email = ?', [email]);

      if (!results || !results.length) {
        return res.send({ auth: false });
      }

      const user = results[0];

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
          expiresIn: '7d'
        });

        res.send({ auth: true, token: token });
      } else {
        res.send({ auth: false });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  }
};
