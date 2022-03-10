import nodemailer from "nodemailer";

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "madhusaran2019@gmail.com",
    pass: "Madhu@8682",
  },
});

let mailDetails = {
  from: "madhusaran2019@gmail.com",
  to: "madhu.a1993@gmail.com",
  subject: "Test mail",
  text: "Node.js testing mail for GeeksforGeeks",
};

mailTransporter.sendMail(mailDetails, function (err, data) {
  if (err) {
    console.log("Error Occurs");
  } else {
    console.log("Email sent successfully");
  }
});
