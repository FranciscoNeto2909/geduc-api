const nodeMailer = require("nodemailer");
const smtpConfig = require("../configs/smtp");

const transporter = nodeMailer.createTransport({
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  auth: {
    user: smtpConfig.user,
    pass: smtpConfig.pass,
  },
});

module.exports = {
  async authEmail(req, res) {
    const email = req.body.email;
    const code = req.body.code;

    try {
      transporter
        .sendMail({
          from: "TaskApp <mybnbapp@gmail.com>",
          to: email,
          subject: "Codigo:",
          text: code,
        })
        .then(msg => console.log("Email enviado!"))
        .catch(err => console.log("erro:" + err));
      return res.status(200).json("Email enviado!");
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
