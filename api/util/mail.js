const DBHelper = require('./DBHelper');
const fetch = require('node-fetch');

module.exports = async (subject, template, userId, eventId) => {
  try {
    const event = (await DBHelper.query('SELECT * FROM events where id = ?', [eventId]))[0];
    const user = (await DBHelper.query('SELECT * FROM users where id = ?', [userId]))[0];

    await fetch('http://mail:3000/api/mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: template,
        toMail: user.email,
        subject: subject,
        replacements: {
          name: user.name,
          email: user.email,
          event: event.name,
          date: event.dt_event
        }
      })
    });
  } catch (err) {
    console.error(err);
  }
};
