const nodemailer = require("nodemailer");

const sendMail = async (subject, message, send_to, send_from, reply_to) => {
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
      });
    
      let mailDetails = {
        from: send_from,
        to: send_to,
        subject: subject,
        text: message,
      };
        mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log(err)
        } else {
          res.status(201).json({status:201,err})
        }
      });
}

module.exports = { sendMail };
