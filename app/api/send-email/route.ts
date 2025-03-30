import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { doctorEmail, patientName, message, reportData } =
      await request.json();
    const patientEmail = session.user.email; // Get email from authenticated session

    if (!doctorEmail || !patientName || !reportData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a transporter
    let transporter;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Using test email account");
      const testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      // Use configured Gmail service
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // This should be an App Password
        },
      });
    }

    // Create HTML email content
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0891b2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .report-section { margin: 15px 0; padding: 15px; background-color: white; border-left: 4px solid #0891b2; }
            .btn { display: inline-block; background-color: #0891b2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Veneer Consultation Request</h1>
            </div>
            <div class="content">
              <p>Dear Doctor,</p>
              <p>Your patient ${patientName} has used our SmileMatch AI platform and would like to discuss veneer options with you.</p>
              
              ${
                message
                  ? `<p><strong>Patient Message:</strong> ${message}</p>`
                  : ""
              }
              
              <div class="report-section">
                <h2>Smile Analysis Results</h2>
                <p><strong>Face Shape:</strong> ${reportData.faceShape}</p>
                <p><strong>Teeth Color:</strong> ${
                  reportData.teethAnalysis.color
                }</p>
                <p><strong>Teeth Alignment:</strong> ${
                  reportData.teethAnalysis.alignment
                }</p>
                <p><strong>Teeth Size:</strong> ${
                  reportData.teethAnalysis.size
                }</p>
                
                <h3>Recommended Veneer Styles:</h3>
                <ul>
                  ${reportData.recommendedStyles
                    .map(
                      (style: any) => `
                    <li>
                      <strong>${style.name}</strong> (${style.compatibility}% compatibility)<br>
                      ${style.description}
                    </li>
                  `
                    )
                    .join("")}
                </ul>
              </div>
              
              <p>The patient's contact information is provided below:</p>
              <p><strong>Email:</strong> ${patientEmail || "Not provided"}</p>
              
              <p>Please contact the patient to schedule a consultation to discuss these veneer options.</p>
              
              <p>Thank you,<br>SmileMatch AI Team</p>
            </div>
            <div class="footer">
              <p>This email was sent from the SmileMatch AI platform. The analysis is based on AI technology and should be verified by a dental professional.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: `"SmileMatch AI" <${
        process.env.EMAIL_USER || "smilematch@example.com"
      }>`,
      to: doctorEmail,
      replyTo: patientEmail, // Set the patient's email as the reply-to address
      subject: `Veneer Consultation Request for ${patientName}`,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);

    // For test accounts, show the URL where the message can be viewed
    if (!process.env.EMAIL_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      previewUrl: !process.env.EMAIL_USER
        ? nodemailer.getTestMessageUrl(info)
        : null,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
