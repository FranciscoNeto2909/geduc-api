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
    const { email, code } = req.body;

    try {
      await transporter.sendMail({
        from: smtpConfig.from,
        to: email,
        subject: "Código de verificação",
        text: `Seu código de verificação é: ${code}`,
      });

      return res.status(200).json({ message: "Email enviado!" });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      return res.status(500).json({ error: "Falha ao enviar email" });
    }
  },
};
