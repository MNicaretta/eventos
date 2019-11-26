const DBHelper = require('./util/DBHelper');
const mail = require('./util/mail');

module.exports = {
  cancel: async (req, res) => {
    try {
      let registration = {
        ref_user: req.user.id,
        ref_event: req.params.eventId
      };

      registration = (
        await DBHelper.query('SELECT * FROM registrations WHERE ref_user = ? AND ref_event = ?', [
          registration.ref_user,
          registration.ref_event
        ])
      )[0];

      await DBHelper.query('DELETE FROM registrations WHERE ref_user = ? and ref_event = ?', [
        registration.ref_user,
        registration.ref_event
      ]);

      mail('Cancelament', 'cancel', registration.ref_user, registration.ref_event);

      return res.send({ registration });
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  }
};
