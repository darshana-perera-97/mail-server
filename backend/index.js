const express = require("express");
const cors = require("cors");
const { DateTime } = require("luxon");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const nodemailer = require("nodemailer");
const app = express();
const port = 5002;

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Path to the emailList JSON file
const emailListPath = path.join(__dirname, "emailList.json");

// Helper function to read emailList from file
const getEmailList = () => {
  try {
    const data = fs.readFileSync(emailListPath, "utf8");
    return JSON.parse(data).emails;
  } catch (error) {
    console.error("Error reading emailList.json:", error);
    return [];
  }
};

// Get the current time in Sri Lankan time zone
const now = DateTime.now().setZone("Asia/Colombo").toFormat("cccc, HH:mm");

var Day = "Tuesday";
var Time = "17:50";

// Helper function to write emailList to file
const updateEmailList = (emails) => {
  try {
    fs.writeFileSync(
      emailListPath,
      JSON.stringify({ emails }, null, 2),
      "utf8"
    );
    return true;
  } catch (error) {
    console.error("Error writing to emailList.json:", error);
    return false;
  }
};

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

const timeChecker = () => {
  // console.log(DateTime.now().setZone("Asia/Colombo").toFormat("cccc, HH:mm"));
  const t = DateTime.now().setZone("Asia/Colombo").toFormat("cccc, HH:mm");
  // console.log(Day + ",-" + Time);
  if (t === Day + ", " + Time) {
    console.log("first");
    const emailList = getEmailList();
    sendEmailWithAttachments(emailList); // Call the email function
  }
  // if (
  //   'Day + ", " + Time' ===
  //   DateTime.now().setZone("Asia/Colombo").toFormat("cccc, HH:mm")
  // ) {
  //   console.log("first");
  // }
};

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

// API to get the current schedule
app.get("/getTime", (req, res) => {
  res.json({ Day, Time });
});

// Backup Now API
app.get("/backupNow", async (req, res) => {
  try {
    const emailList = getEmailList();
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

// Schedule Backup route
app.post("/scheduleBackup", (req, res) => {
  const { day, time } = req.body;

  // Validate the received data
  if (!day || !time) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }
  Day = day;
  Time = time;
  // Log the scheduled backup details and the current time
  console.log(`Backup scheduled for ${day} at ${time}`);
  // console.log(`Current Sri Lankan time: ${now}`);

  // Respond with success
  res.status(200).json({
    success: true,
    message: "Backup scheduled successfully!",
    currentTime: now, // Return the current time as part of the response
  });
});

// View Email List API
app.get("/emailList", (req, res) => {
  try {
    const emailList = getEmailList();
    res.status(200).json({ success: true, emailList });
  } catch (error) {
    console.error("Error fetching email list:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch email list." });
  }
});

// Edit Email List API (Add/Remove Email)
app.post("/emailList", (req, res) => {
  const { action, email } = req.body;

  if (!action || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Action and email are required." });
  }

  try {
    let emailList = getEmailList();

    if (action === "add") {
      if (emailList.includes(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists." });
      }
      emailList.push(email);
    } else if (action === "remove") {
      if (!emailList.includes(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Email not found." });
      }
      emailList = emailList.filter((e) => e !== email);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'add' or 'remove'.",
      });
    }

    if (updateEmailList(emailList)) {
      res.status(200).json({
        success: true,
        message: "Email list updated successfully.",
        emailList,
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to update email list." });
    }
  } catch (error) {
    console.error("Error updating email list:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update email list." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  // Print "text" every 60 seconds
  setInterval(() => {
    // console.log(Day + " + " + Time);
    timeChecker();
  }, 60000); // 60000 milliseconds = 60 seconds
});
