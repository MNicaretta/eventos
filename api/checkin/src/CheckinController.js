const DBHelper = require('./util/DBHelper');
const constants = require('./util/const');
const mail = require('./util/mail');

module.exports = {
  checkin: async (req, res) => {
    try {
      let promises = [];

      req.body.forEach(u => {
        promises.push(DBHelper.query('INSERT IGNORE INTO users SET ?', { email: u }));
      });

      await Promise.all(promises);

      promises = [];

      const registration = {
        eventId: req.params.eventId,
        state: constants.REGISTRATION.STATE_CHECKIN
      };

      users = await DBHelper.query('SELECT id FROM users WHERE email IN (?)', [req.body]);

      users.forEach(u => {
        promises.push(
          DBHelper.query('INSERT INTO registrations SET ? ON DUPLICATE KEY UPDATE state = VALUES(state)', {
            ref_user: u.id,
            ref_event: registration.eventId,
            state: registration.state
          })
        );
      });

      await Promise.all(promises);

      users.forEach(u => {
        mail('Check-in', 'checkin', u.id, registration.eventId);
      });

      return res.send({ msg: `${users.length} usuários registrados` });
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  }
};
