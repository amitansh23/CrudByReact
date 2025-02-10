import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "officialcheck1234@gmail.com",
    pass: process.env.SKEY
  }
      
      
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: 'Official Check',
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

export default mailSender;