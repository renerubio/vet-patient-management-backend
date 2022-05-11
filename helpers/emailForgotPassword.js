import nodemailer from "nodemailer";
const emailForgotPassword = async (data) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  const info = await transport.sendMail({
    from: "Veterinarian Patient Management",
    to: email,
    subject: "Reset your password in VPM",
    text: "Reset your password VPM",
    html: `<p>Hi: ${name}, You have requested reset your password</p>
    <p>Please, follow the link below to generate a new password:
      <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset your password</a>
    </p>
    <p>If you didn't create this account, you can ignore this message</p>
    `,
  });

  console.log("message sended: %s", info.messageId);
};

export default emailForgotPassword;
