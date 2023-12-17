const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  if (process.env.EMAIL_NAME === email) {
    console.log("Cannot send email to yourself !!!");
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_KEY,
      },
    });

    transporter.sendMail(
      {
        from: process.env.EMAIL_NAME,
        to: email,
        subject: subject,
        text: text,
      },
      (err, info) => {
        if (err) {
          console.log("error sending email: " + err);
        } else {
          console.log("successfully sent mail: " + info.response);
        }
      }
    );
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
