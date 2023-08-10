// const nodemailer = require('nodemailer');

// // Send confirmation email
// exports.sendConfirmationEmail = (email, confirmationCode) => {
  
//     // Create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'ketsebaotertumo@gmail.com', // my email address
//       pass: '123456789' // my email password
//     }
//   });

//   // Send confirmation email
//   let mailOptions = {
//     from: 'ketsebatertumo@gmail.com', // Sender's email address
//     to: email, // Recipient's email address
//     subject: 'Confirm Your Account',
//     html: `
//         <p>Thank you for signing up!<p>
//         <p>Please click the following link to confirm your account: <a href="localhost:6000/confirm/${confirmationCode}">Confirm your account</a></p>`,    
// };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Confirmation email sent: ' + info.response);
//     }
//   });
// };
// module.exports= sendConfirmationEmail;