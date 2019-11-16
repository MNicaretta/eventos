const jwt = require('jsonwebtoken');
const DBHelper = require('./DBHelper');

module.exports = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];

    if (token) {
      if (token.startsWith('Bearer ')) {
        token = token.slice('Bearer '.length, token.length);
      }

      const decoded = jwt.verify(token, process.env.SECRET);

      const results = await DBHelper.query('SELECT * FROM users WHERE id = ?', decoded.id);

      if (!results || !results.length) {
        return res.send({ auth: false });
      }

      const user = results[0];

      req.user = user;
      next();
    } else {
      res.status(401).json({
        auth: false,
        message: 'Auth token is not supplied'
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
};
