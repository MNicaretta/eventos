const bcrypt = require('bcrypt');
const DBHelper = require('./util/DBHelper');

module.exports = {
  register: async (req, res) => {
    DBHelper.getConnection((err, connection) => {
      if (err) return res.status(500).send({ message: 'Failed to connect to database' });

      const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        dt_birth: req.body.dt_birth,
        cpf: req.body.cpf,
        phone: req.body.phone
      };

      bcrypt.hash(user.password, 5, async (err, hash) => {
        if (err) return res.status(500).send({ message: 'Failed to encrypt password' });

        const sql = 'INSERT INTO users SET ?';
        user.password = hash;

        connection.query(sql, user, (err, results, fields) => {
          if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
              return res.status(400).send({ message: 'Email ja cadastrado' });
            } else {
              return res.status(500).send({ message: 'Database query failed' });
            }
          }

          connection.release();

          user.id = results.insertId;

          res.status(200).send({ user });
        });
      });
    });
  }
};
