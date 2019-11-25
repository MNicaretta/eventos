const bcrypt = require('bcrypt');
const DBHelper = require('./util/DBHelper');

module.exports = {
  signup: async (req, res) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      dt_birth: req.body.dtBirth,
      cpf: req.body.cpf
    };

    try {
      const result = await DBHelper.query('SELECT * FROM users WHERE email = ?', [user.email]);

      if (result && result[0] && result[0].name) {
        return res.status(400).send({ message: 'Email ja cadastrado' });
      }

      user.password = await bcrypt.hash(user.password, 10);

      const results = await DBHelper.query(
        'INSERT INTO users SET ?' +
          'ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), dt_birth = VALUES(dt_birth), cpf = VALUES(cpf)',
        user
      );

      user.id = results.insertId;

      return res.send({ user });
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  }
};
