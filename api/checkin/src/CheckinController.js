const DBHelper = require('./util/DBHelper');
const constants = require('./util/const');
const mail = require('./util/mail');

module.exports = {
  getEvents: async (req, res) => {
    try {
      res.send(await DBHelper.query('SELECT * FROM events'));
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  },
  checkin: async (req, res) => {
    try {
      await Promise.all(req.body.map(u => DBHelper.query('INSERT IGNORE INTO users SET ?', { email: u })));

      const registration = {
        eventId: req.params.eventId,
        state: constants.REGISTRATION.STATE_CHECKIN
      };

      users = await DBHelper.query('SELECT id FROM users WHERE email IN (?)', [req.body]);

      await Promise.all(
        users.map(u => {
          return DBHelper.query('INSERT INTO registrations SET ? ON DUPLICATE KEY UPDATE state = VALUES(state)', {
            ref_user: u.id,
            ref_event: registration.eventId,
            state: registration.state
          });
        })
      );

      users.map(u => mail('Check-in', 'checkin', u.id, registration.eventId));

      return res.send({ msg: `${users.length} usuários registrados` });
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  }
};
