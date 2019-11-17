const DBHelper = require('./util/DBHelper');
const constants = require('./util/const');

module.exports = {
  getRegistrations: async (req, res) => {
    try {
      const results = await DBHelper.query(
        `
        SELECT * FROM events e, registrations r
        WHERE e.id = r.ref_event
        AND r.ref_user = ?
        `,
        [req.user.id]
      );
      res.send(results);
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  },
  cancel: async (req, res) => {
    try {
      let registration = {
        ref_user: req.body.userId,
        ref_event: req.body.eventId,
        state: constants.REGISTRATION.STATE_CANCELED
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
