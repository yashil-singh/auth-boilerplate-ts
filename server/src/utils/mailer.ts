import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

type SendMailProps = {
  receiverMail: string;
  subject: string;
  text?: string;
  html?: string;
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

const sendMail = async ({
  html,
  receiverMail,
  subject,
  text,
}: SendMailProps) => {
  try {
    if (process.env.MAILER_USER && process.env.MAILER_NAME) {
      const mailOptions = {
        from: {
          name: process.env.MAILER_NAME,
          address: process.env.MAILER_USER,
        },
        to: receiverMail,
        subject,
        text,
        html,
      };

      await transporter.sendMail(mailOptions);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("🚀 ~ Error sending mail:", error);
    return false;
  }
};

export default sendMail;
