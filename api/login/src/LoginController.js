const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const DBHelper = require('./util/DBHelper');

module.exports = {
  login: async (req, res) => {
    DBHelper.getConnection((err, connection) => {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to connect to database' });

      const { email, password } = req.body;

      const sql = 'SELECT * FROM users WHERE email = ?';
      const values = [email];

      connection.query(sql, values, (err, results, fields) => {
        if (err) return res.status(500).send({ auth: false, message: 'Database query failed' });

        connection.release();

        if (!results || !results.length) {
          return res.status(200).send({ auth: false });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, async (err, valid) => {
          if (valid) {
            const token = jwt.sign({ id: user.id }, process.env.SECRET, {
              expiresIn: '7d'
            });

            res.status(200).send({ auth: true, token: token });
          } else {
            res.status(200).send({ auth: false });
          }
        });
      });
    });
  },
  authenticate: async (req, res) => {
    let token = req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
      token.slice('Bearer '.length, token.length);
    }

    if (token) {
      jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        DBHelper.getConnection((err, connection) => {
          if (err) return res.status(500).send({ auth: false, message: 'Failed to connect to database' });

          connection.release();

          res.status(200).send({ auth: true, user });
        });
      });
    } else {
      res.status(401).send({
        auth: false,
        message: 'Auth token is not supplied'
      });
    }
  }
};
