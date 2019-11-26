const DBHelper = require('./util/DBHelper');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');

function readHTMLFile(path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
}

module.exports = {
  sendMail: async (req, res) => {
    readHTMLFile(`${__dirname}/../templates/${req.body.template}.html`, (err, html) => {
      if (!err) {
        const template = handlebars.compile(html);
        const htmlToSend = template(req.body.replacements);
        const mailOptions = {
          from: process.env.MAIL_USER,
          to: req.body.toMail,
          subject: req.body.subject,
          html: htmlToSend
        };
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          secure: process.env.MAIL_SECURE,
          port: process.env.MAIL_PORT,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          }
        });
        transporter.sendMail(mailOptions, (error, response) => {
          if (error) {
            console.error(error);
            return res.status(500).send();
          }

          res.stats(200).send();
        });
      } else {
        console.error(err);
        return res.status(500).send();
      }
    });
  }
};
