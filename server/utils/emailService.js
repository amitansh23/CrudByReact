import nodemailer from "nodemailer";

export const sendWelcomeEmail = async (mailOptions) => {
    try{
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "officialcheck1234@gmail.com",
      pass: process.env.SKEY 
    },
  });
  return transporter.sendMail(mailOptions);
}
catch (error) {
    console.error(error);
}
};
