const nodemailer = require("nodemailer");

// Create transporter with Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// HTML Email Template Generator
const generateEmailTemplate = (data) => {
  const {
    name,
    email,
    phone,
    role,
    crops,
    location,
    problemsNeeds,
    productsRequired,
    buyerLocation,
    qualification,
    specialization,
  } = data;

  let roleSpecificContent = "";

  if (role === "farmer") {
    roleSpecificContent = `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #2d5016;">Crops:</strong> ${crops || "N/A"}
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #2d5016;">Location:</strong> ${
            location || "N/A"
          }
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #2d5016;">Problems/Needs:</strong><br/>
          ${problemsNeeds || "N/A"}
        </td>
      </tr>
    `;
  } else if (role === "buyer") {
    roleSpecificContent = `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #2d5016;">Products Required:</strong><br/>
          ${productsRequired || "N/A"}
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #2d5016;">Location:</strong> ${
            buyerLocation || "N/A"
          }
        </td>
      </tr>
    `;
  } else if (role === "expert") {
    roleSpecificContent = `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #2d5016;">Qualification:</strong> ${
            qualification || "N/A"
          }
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #2d5016;">Specialization:</strong> ${
            specialization || "N/A"
          }
        </td>
      </tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AgroConnect Registration Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 14px;
        }
        .content {
          padding: 30px 20px;
        }
        .welcome-text {
          color: #2d5016;
          font-size: 16px;
          margin-bottom: 25px;
          font-weight: 500;
        }
        .info-section {
          background-color: #f0fdf4;
          border-left: 4px solid #16a34a;
          padding: 20px;
          margin-bottom: 25px;
          border-radius: 4px;
        }
        .info-section table {
          width: 100%;
          border-collapse: collapse;
        }
        .info-section strong {
          color: #2d5016;
        }
        .role-badge {
          display: inline-block;
          background-color: #16a34a;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 15px;
          text-transform: capitalize;
        }
        .section-title {
          color: #2d5016;
          font-size: 16px;
          font-weight: 600;
          margin-top: 20px;
          margin-bottom: 15px;
          border-bottom: 2px solid #16a34a;
          padding-bottom: 10px;
        }
        .footer {
          background-color: #f9fafb;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
        }
        .footer p {
          margin: 5px 0;
        }
        .success-message {
          background-color: #dcfce7;
          border: 1px solid #86efac;
          color: #166534;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 500;
        }
        .cta-button {
          display: inline-block;
          background-color: #16a34a;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
          font-weight: 600;
          text-align: center;
        }
        .cta-button:hover {
          background-color: #15803d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌾 AgroConnect</h1>
          <p>Agricultural Advisory & Community Platform</p>
        </div>
        
        <div class="content">
          <p class="welcome-text">Hello ${name},</p>
          
          <div class="success-message">
            ✅ Your registration has been successfully submitted!
          </div>
          
          <p>Thank you for joining the AgroConnect community. We're excited to have you on board!</p>
          
          <div class="info-section">
            <div class="role-badge">${role}</div>
            <div class="section-title">Registration Details</div>
            <table>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #2d5016;">Name:</strong> ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #2d5016;">Email:</strong> ${email}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #2d5016;">Phone:</strong> ${phone}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #2d5016;">Role:</strong> ${
                    role.charAt(0).toUpperCase() + role.slice(1)
                  }
                </td>
              </tr>
              ${roleSpecificContent}
            </table>
          </div>
          
          <p style="color: #555; margin-top: 20px;">
            <strong>What's Next?</strong><br/>
            You can now log in to your AgroConnect account and start connecting with our community. 
            Explore features tailored to your role and make the most of our platform.
          </p>
          
          <a href="${
            process.env.CLIENT_URL || "http://localhost:3000"
          }/login" class="cta-button">
            Go to AgroConnect
          </a>
        </div>
        
        <div class="footer">
          <p><strong>AgroConnect</strong> - Connecting Agriculture with Technology</p>
          <p>Contact: ${
            process.env.SUPPORT_EMAIL || "support@agroconnect.com"
          }</p>
          <p>&copy; 2024 AgroConnect. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send registration email
const sendRegistrationEmail = async (registrationData) => {
  try {
    const htmlContent = generateEmailTemplate(registrationData);

    const fromAddress =
      process.env.SMTP_FROM || `AgroConnect <${process.env.SMTP_USER}>`;

    const mailOptions = {
      from: fromAddress,
      to: registrationData.email,
      subject: "🌾 Welcome to AgroConnect - Registration Confirmation",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Registration email sent successfully:", info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw error;
  }
};

module.exports = {
  sendRegistrationEmail,
  generateEmailTemplate,
};
