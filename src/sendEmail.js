const nodemailer = require('nodemailer');


const sendEmail = async ({ to, subject, text, html }) => {
const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: process.env.SMTP_PORT,
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS,
},
});


const info = await transporter.sendMail({
from: `Auth Demo <${process.env.SMTP_USER}>`,
to,
subject,
text,
html,
});
return info;
};


module.exports = sendEmail;