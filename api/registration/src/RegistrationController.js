const DBHelper = require('./util/DBHelper');

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
  }
};
