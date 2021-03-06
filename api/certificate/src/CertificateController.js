const DBHelper = require('./util/DBHelper');
const constants = require('./util/const');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const uuidv4 = require('uuid/v4');
const mail = require('./util/mail');

module.exports = {
  certificate: async (req, res) => {
    try {
      const result = await DBHelper.query('SELECT * FROM registrations WHERE ref_user = ? AND ref_event = ?', [
        req.user.id,
        req.params.eventId
      ]);

      if (result && result[0]) {
        const registration = result[0];

        if (registration.state === constants.REGISTRATION.STATE_CHECKIN) {
          const event = (await DBHelper.query('SELECT * FROM events where id = ?', [registration.ref_event]))[0];
          const user = (await DBHelper.query('SELECT * FROM users where id = ?', [registration.ref_user]))[0];

          const uuid = uuidv4();

          if (!event.code) {
            DBHelper.query('UPDATE registrations SET certificate_code = ? WHERE ref_user = ? and ref_event = ?', [
              uuid,
              registration.ref_user,
              registration.ref_event
            ]);

            mail('Certificado', 'certificate', user.id, event.id);
          }

          const filePath = `./certificate${uuid}.pdf`;
          const fileStream = fs.createWriteStream(filePath);

          const doc = new PDFDocument();
          doc.pipe(fileStream);

          doc.fontSize('13').text(
            `Usuário: ${user.name} - ${user.email}
             Evento: ${event.name} - ${event.date}
             Código para validação: ${uuid}`
          );

          doc.end();

          fileStream.addListener('finish', () => {
            res.download(filePath);
          });
        } else {
          res.status(400).send({ message: 'Usuário não fez checkin' });
        }
      } else {
        res.status(404).send({ message: 'Registro não encontrado' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  }
};
