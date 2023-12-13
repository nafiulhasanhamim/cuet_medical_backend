const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USERNAME, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const emailWithNodeMailer = async (emailData) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USERNAME, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };
    const info = await transporter.sendMail(mailOptions);
    // console.log("Message Sent %s",info.response)
  } catch (error) {
    console.error("Error occured while sending email : ", error);
    throw error;
  }
};

module.exports = emailWithNodeMailer;
