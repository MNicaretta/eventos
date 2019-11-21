const DBHelper = require('./util/DBHelper');
const constants = require('./util/const');

module.exports = {
  getEvents: async (req, res) => {
    try {
      const results = await DBHelper.query(
        `
        SELECT * FROM events
        WHERE id NOT IN (
          SELECT ref_event FROM registrations
          WHERE ref_user = ?
        )
        `,
        [req.user.id]
      );
      res.send(results);
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  },
  register: async (req, res) => {
    try {
      let registration = {
        ref_user: req.user.id,
        ref_event: req.params.eventId,
        state: constants.REGISTRATION.STATE_REGISTERED
      };

      await DBHelper.query('INSERT INTO registrations SET ?', registration);

      registration = (
        await DBHelper.query('SELECT * FROM registrations WHERE ref_user = ? AND ref_event = ?', [registration.ref_user, registration.ref_event])
      )[0];

      return res.send({ registration });
    } catch (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        return res.status(400).send({ message: 'Usuário já cadastrado no evento' });
      } else {
        console.error(err);
        return res.status(500).send();
      }
    }
  }
};
