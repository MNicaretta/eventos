const bcrypt = require('bcrypt');
const DBHelper = require('./util/DBHelper');

module.exports = {
  register: async (req, res) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      dt_birth: req.body.dtBirth,
      cpf: req.body.cpf
    };

    try {
      user.password = await bcrypt.hash(user.password, 10);

      const results = await DBHelper.query('INSERT INTO users SET ?', user);

      user.id = results.insertId;

      return res.status(200).send({ user });
    } catch (err) {
      console.error(err);
      if (err.code == 'ER_DUP_ENTRY') {
        return res.status(400).send({ message: 'Email ja cadastrado' });
      } else {
        return res.status(500).send();
      }
    }
  }
};
