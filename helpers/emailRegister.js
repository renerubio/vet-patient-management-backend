import nodemailer from "nodemailer"
const emailRegister = async (data) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  }); 

  const {email, name, token } = data;
  
  const info = await transport.sendMail({
    from: "Veterinarian Patient Management",
    to: email,
    subject: "Check your account in VPM",
    text: "Check your account in VPM",
    html: `<p>Hi: ${name}, check your account</p>
    <p>Your account is ready, you just have to check it in the following link:
      <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Check account</a>
    </p>
    <p>If you didn't create this account, you can ignore this message</p>
    `,
  });

  console.log("message sended: %s", info.messageId);

}

export default emailRegister;