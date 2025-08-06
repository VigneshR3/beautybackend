require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { IncomingForm } = require("formidable");
const nodemailer = require("nodemailer");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({ origin: "*", credentials: true }));

app.post("/api/appoint", (req, res) => {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res
        .status(400)
        .json({ success: false, message: "Form parsing failed" });
    }  

    // Prepare email content
    const output = `
      <h2>New Appointment</h2>
      <p><strong>Name:</strong> ${fields.firstname[0]} ${fields.lastname[0]}</p>
      <p><strong>Email:</strong> ${fields.email[0]}</p>
      <p><strong>Phone:</strong> ${fields.phonenumber[0]}</p>
      <p><strong>Date:</strong> ${fields.date[0]}</p>
      <p><strong>Service Type:</strong> ${fields.servicetype[0]}</p>
      <p><strong>Message:</strong> ${fields.message[0]}</p>
    `;

    // Setup email transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)
    // Send mail
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: fields?.email[0]?.trim(), // 🔥 This must be defined
        subject: "New Appointment Submission",
        html: output,
      });

      res.json({
        success: true,
        message: "Appointment submitted and email sent!",
      });
    } catch (error) {
      console.error("Email send error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to send email or Email is not correct",
        });
    }
  });
});
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
