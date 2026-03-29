const nodemailer = require("nodemailer");

/**
 * Creates a reusable Gmail SMTP transporter.
 * Credentials are read from environment variables at call-time.
 */
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

/**
 * Sends a 6-digit OTP to the given email address.
 * Visual theme: Clarity brand — pitch-black background, neon-green (#39FF14) accents.
 *
 * @param {string} to  - Recipient email address
 * @param {string} otp - 6-digit OTP string
 */
const sendOtpEmail = async (to, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Clarity" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Clarity Verification Code",
    // ── Plain-text fallback ──────────────────────────────────────────────────
    text: `Your Clarity OTP is: ${otp}\n\nValid for 5 minutes. Do not share this code with anyone.\n\n– The Clarity Team`,
    // ── Branded HTML email ───────────────────────────────────────────────────
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Clarity OTP</title>
</head>
<body style="margin:0;padding:0;background:#000000;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:#000000;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- ── Outer card ─────────────────────────────────────────────── -->
        <table width="520" cellpadding="0" cellspacing="0" border="0"
               style="background:#0a0a0a;border:1px solid #1c1c1c;border-radius:20px;
                      overflow:hidden;max-width:520px;width:100%;">

          <!-- ── Top neon accent line ───────────────────────────────── -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#000,#39FF14,#000);
                        line-height:3px;font-size:0;">&nbsp;</td>
          </tr>

          <!-- ── Header ─────────────────────────────────────────────── -->
          <tr>
            <td align="center" style="padding:40px 32px 28px;">

              <!-- Wordmark logo — matches the app exactly -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <!-- Neon-green dot grid behind text (decorative) -->
                    <div style="display:inline-block;">
                      <span style="
                        font-size:34px;
                        font-weight:900;
                        letter-spacing:6px;
                        color:#39FF14;
                        text-shadow:0 0 20px rgba(57,255,20,0.7),
                                    0 0 40px rgba(57,255,20,0.4);
                        font-family:'Segoe UI',Arial,sans-serif;
                      ">CLARITY</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:6px;">
                    <span style="
                      font-size:11px;
                      color:#555555;
                      letter-spacing:3px;
                      text-transform:uppercase;
                      font-family:'Segoe UI',Arial,sans-serif;
                    ">Financial Intelligence</span>
                  </td>
                </tr>
              </table>

              <!-- Thin neon divider -->
              <table width="80" cellpadding="0" cellspacing="0" border="0"
                     style="margin:24px auto 0;">
                <tr>
                  <td style="height:1px;background:#39FF14;opacity:0.4;line-height:1px;font-size:0;">&nbsp;</td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── Body ───────────────────────────────────────────────── -->
          <tr>
            <td style="padding:0 40px 40px;">

              <p style="margin:0 0 6px;font-size:11px;color:#555555;
                         letter-spacing:2px;text-transform:uppercase;
                         font-family:'Segoe UI',Arial,sans-serif;">
                Email Verification
              </p>
              <h1 style="margin:0 0 20px;font-size:20px;font-weight:700;
                          color:#ffffff;font-family:'Segoe UI',Arial,sans-serif;">
                Your one-time verification code
              </h1>

              <!-- ── OTP box ──────────────────────────────────────── -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="margin:0 0 28px;">
                <tr>
                  <td align="center"
                      style="background:#000000;
                             border:1px solid #39FF14;
                             border-radius:14px;
                             padding:28px 16px;">

                    <!-- Individual digit boxes -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        ${otp.split("").map(digit => `
                        <td style="padding:0 5px;">
                          <div style="
                            width:44px;
                            height:54px;
                            line-height:54px;
                            text-align:center;
                            background:#0d0d0d;
                            border:1px solid rgba(57,255,20,0.35);
                            border-radius:10px;
                            font-size:26px;
                            font-weight:900;
                            color:#39FF14;
                            font-family:'Courier New',monospace;
                            display:inline-block;
                            box-shadow:0 0 8px rgba(57,255,20,0.2);
                          ">${digit}</div>
                        </td>`).join("")}
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Expiry note -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="margin:0 0 24px;">
                <tr>
                  <td style="background:#0d0d0d;border:1px solid #1c1c1c;
                              border-radius:10px;padding:14px 18px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="24" valign="middle"
                            style="font-size:16px;color:#39FF14;">⏱</td>
                        <td valign="middle"
                            style="font-size:13px;color:#a0a0a0;
                                   font-family:'Segoe UI',Arial,sans-serif;">
                          This code expires in&nbsp;
                          <span style="color:#39FF14;font-weight:700;">5 minutes</span>.
                          Do not share it with anyone.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <p style="margin:0;font-size:12px;color:#555555;line-height:1.7;
                         font-family:'Segoe UI',Arial,sans-serif;">
                If you didn't create a Clarity account, you can safely ignore this email.
                Clarity will <span style="color:#a0a0a0;font-weight:600;">never</span>
                ask you to share your OTP.
              </p>

            </td>
          </tr>

          <!-- ── Bottom neon accent line ─────────────────────────────── -->
          <tr>
            <td style="height:1px;background:#1c1c1c;line-height:1px;font-size:0;">&nbsp;</td>
          </tr>

          <!-- ── Footer ─────────────────────────────────────────────── -->
          <tr>
            <td align="center" style="padding:20px 32px;background:#050505;border-radius:0 0 20px 20px;">
              <p style="margin:0;font-size:11px;color:#333333;
                         font-family:'Segoe UI',Arial,sans-serif;letter-spacing:0.5px;">
                © ${new Date().getFullYear()} Clarity Financial Intelligence &nbsp;·&nbsp;
                <span style="color:#39FF14;">clarity.app</span>
              </p>
            </td>
          </tr>

        </table>
        <!-- ── End outer card ──── -->

      </td>
    </tr>
  </table>

</body>
</html>
    `.trim(),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
