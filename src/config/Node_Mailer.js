const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: "sksatenderkumar59@gmail.com",
    pass: "riqglbmnmbkyogvt",
  },
});

const nodemailerfun = async function main(data) {
  try {
    const { gmail, subject, otp } = data;

    if (!gmail) {
      throw new Error("Recipient email (gmail) is not defined.");
    }

    const info = await transporter.sendMail({
      from: process.env.NODEMAILER_ACCOUNT_USER,
      to: gmail,
      subject: subject,
      text: `OTP number is: ${otp}`,
    });

  
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { nodemailerfun };
