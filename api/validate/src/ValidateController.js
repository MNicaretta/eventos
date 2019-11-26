const DBHelper = require('./util/DBHelper');
const constants = require('./util/const');
const PDFDocument = require('pdfkit');
const uuidv4 = require('uuid/v4');
const fs = require('fs');

module.exports = {
  validate: async (req, res) => {
    try {
      console.log(req.params.code);
      const result = await DBHelper.query('SELECT * FROM registrations WHERE certificate_code = ?', [req.params.code]);
      console.log(result);
      if (result && result[0]) {
        const registration = result[0];

        if (registration.state === constants.REGISTRATION.STATE_CHECKIN) {
          const event = (await DBHelper.query('SELECT * FROM events where id = ?', [registration.ref_event]))[0];
          const user = (await DBHelper.query('SELECT * FROM events where id = ?', [registration.ref_user]))[0];

          const filePath = `./certificate${uuidv4()}.pdf`;
          const fileStream = fs.createWriteStream(filePath);

          const doc = new PDFDocument();
          doc.pipe(fileStream);

          doc
            .fontSize('13')
            .text(
              `Usuário: ${user.name} - ${user.email}\n` +
                `Evento: ${event.name} - ${event.date}\n` +
                `Código para validação: ${registration.certificate_code}`
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
