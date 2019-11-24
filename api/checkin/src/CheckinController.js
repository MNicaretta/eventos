const DBHelper = require('./util/DBHelper');
const constants = require('./util/const');

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
        state: constants.REGISTRATION.STATE_REGISTERED
      };

      users = await DBHelper.query('SELECT id FROM users WHERE email IN (?)', [req.body]);

      console.log(users);

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

      return res.send({ msg: `${users.length} usuários registrados` });
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  }
};
