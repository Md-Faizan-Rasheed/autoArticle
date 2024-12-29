
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Endpoint to send email
app.post("/send-email", upload.fields([{ name: "file" }, { name: "image" }]), async (req, res) => {
    const { to, subject, htmlContent } = req.body;
  const files = req.files;

  if (!files || !files.file || !files.image) {
    return res.status(400).send("Both file and image are required");
  }

  const file = files.file[0]; // Uploaded document
  const image = files.image[0]; // Uploaded image
  require("dotenv").config();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
    attachments: [
        {
            filename: `${file.originalname}`,
            contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            path: file.path, // Path to the uploaded file
          },
          {
            filename: `${image.originalname}`,
            contentType: "image/png", // Example MIME type for an image
            path: image.path, // Path to the uploaded image file
          },
    ],
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);

    // Clean up uploaded file after sending email
    fs.unlink(file.path, (err) => {
      if (err) console.error("Failed to delete file:", err);
    });

    res.status(200).send(`Email sent: ${info.response}`);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
