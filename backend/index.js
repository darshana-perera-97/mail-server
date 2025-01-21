const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const nodemailer = require("nodemailer");
const app = express();
const emailList = require("./emailList.json").emails;
const port = 5002;

// Middleware to parse JSON
app.use(express.json());

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

// Get all items
app.get("/backupNow", async (req, res) => {
  try {
    await sendEmailWithAttachments(emailList); // Call the email function
    res
      .status(200)
      .json({ success: true, message: "Backup emails sent successfully!" });
  } catch (error) {
    console.error("Error during backup:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send backup emails." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
