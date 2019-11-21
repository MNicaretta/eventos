const DBHelper = require('./util/DBHelper');
const constants = require('./util/const');

module.exports = {
  checkin: async (req, res) => {
    try {
      let registration = {
        ref_user: req.user.id,
        ref_event: req.params.eventId,
        state: constants.REGISTRATION.STATE_CHECKIN
      };

      await DBHelper.query('UPDATE registrations SET state = ? WHERE ref_user = ? and ref_event = ?', [
        registration.state,
        registration.ref_user,
        registration.ref_event
      ]);

      registration = (
        await DBHelper.query('SELECT * FROM registrations WHERE ref_user = ? AND ref_event = ?', [
          registration.ref_user,
          registration.ref_event
        ])
      )[0];

      return res.send({ registration });
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  }
};
