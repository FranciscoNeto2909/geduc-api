const nodeMailer = require("nodemailer")
const smtpConfig = require("../configs/smtp")

const transporter = nodeMailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass
    }
})

module.exports = {
    async authEmail(req, res) {
        const email = await req.body.email
        const code = await req.body.code

        try {
            transporter.sendMail({
                from: "TaskApp <burdette.kutch68@ethereal.email>",
                to:email,
                subject:"Codigo:",
                text:code,
            })
                .then(msg => console.log("Sms sended with success!"))
                .catch(err => console.log("erro:" + err))
            return res.status(200).json("Sms sended with success!")
        } catch (error) {
            return res.status(400).json(error)
        }
    }

}