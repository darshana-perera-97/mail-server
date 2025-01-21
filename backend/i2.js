require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Configure SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send an email with multiple file attachments to a list of recipients
const sendEmailWithAttachments = async (emailList) => {
  try {
    for (const email of emailList) {
      const mailOptions = {
        from: `"Database Backup" <${process.env.SMTP_USER}>`, // Sender address
        to: email, // Current recipient email
        subject: `Database backup of ${new Date().toISOString().split("T")[0]}`,
        text: "Please find the attached files below.",
        attachments: [
          {
            filename: "a.json", // File 1
            path: path.join(__dirname, "a.json"),
            contentType: "application/json",
          },
          {
            filename: "a1.json", // File 2
            path: path.join(__dirname, "a1.json"),
            contentType: "application/json",
          },
          {
            filename: "a2.json", // File 3
            path: path.join(__dirname, "a2.json"),
            contentType: "application/json",
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${email}: ${info.messageId}`);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// List of emails
const emailList = [
  "darshana.saluka.pc@gmail.com",
  "darshana.saluka.pc@gmail.com",
];

// Call the function
sendEmailWithAttachments(emailList);
