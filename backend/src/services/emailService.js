const nodemailer = require('nodemailer');

/**
 * Creates a reusable transporter using Gmail SMTP.
 * Credentials come from environment variables:
 *   EMAIL_USER  — Gmail address (e.g. rms.university@gmail.com)
 *   EMAIL_PASS  — App password (not your Gmail login password)
 */
function createTransporter() {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send test-account credentials to a scholar's Gmail.
 * @param {object} opts
 * @param {string} opts.to        Recipient email (scholar's Gmail)
 * @param {string} opts.name      Scholar name
 * @param {string} opts.testId    e.g. "TEST-001"
 * @param {string} opts.testPassword Plain-text test password
 * @param {string} opts.expiresAt  ISO date string or null
 * @param {string} opts.label      Optional label / purpose
 */
async function sendTestCredentials({ to, name, testId, testPassword, expiresAt, label }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[EmailService] EMAIL_USER or EMAIL_PASS not set — skipping email.');
    return;
  }

  const transporter = createTransporter();

  const expiry = expiresAt
    ? new Date(expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'No expiry';

  const purposeLine = label ? `<p style="margin:0 0 8px"><strong>Purpose:</strong> ${label}</p>` : '';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a5f,#2563EB);padding:28px 32px;text-align:center">
      <div style="width:52px;height:52px;background:rgba(255,255,255,0.15);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:12px">🎓</div>
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">Research Management System</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px">Scholar Registration Portal — Test Account</p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px">
      <p style="margin:0 0 16px;font-size:15px;color:#1f2937">Dear <strong>${name}</strong>,</p>
      <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.6">
        The Administrator has issued a <strong>Test Account</strong> for you to log in to the Scholar Registration Portal and complete your details.
      </p>

      <!-- Credentials Box -->
      <div style="background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:10px;padding:20px 24px;margin-bottom:20px">
        <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#1D4ED8;text-transform:uppercase;letter-spacing:0.5px">🔑 Your Login Credentials</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#6B7280;width:120px">Test User ID</td>
            <td style="padding:6px 0">
              <code style="background:#fff;border:1px solid #BFDBFE;padding:4px 12px;border-radius:6px;font-size:15px;font-weight:700;color:#1D4ED8;letter-spacing:1px">${testId}</code>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#6B7280">Password</td>
            <td style="padding:6px 0">
              <code style="background:#fff;border:1px solid #BFDBFE;padding:4px 12px;border-radius:6px;font-size:15px;font-weight:700;color:#1D4ED8">${testPassword}</code>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#6B7280">Expires On</td>
            <td style="padding:6px 0;font-size:13px;color:#374151;font-weight:600">${expiry}</td>
          </tr>
        </table>
        ${purposeLine}
      </div>

      <!-- Steps -->
      <div style="margin-bottom:20px">
        <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#1f2937">📋 Steps to login:</p>
        <ol style="margin:0;padding-left:20px;font-size:13px;color:#374151;line-height:1.8">
          <li>Visit the RMS Portal login page</li>
          <li>Click <strong>"🧪 Register Scholar Details — Test Login"</strong></li>
          <li>Enter your Test User ID and Password above</li>
          <li>Fill in all your scholar registration details</li>
          <li>Submit for Admin approval</li>
        </ol>
      </div>

      <div style="background:#FEF3C7;border:1px solid #FCD34D;border-radius:8px;padding:12px 16px;margin-bottom:20px">
        <p style="margin:0;font-size:12.5px;color:#92400E">
          ⚠️ <strong>Important:</strong> This is a temporary test account. Do not share your credentials. The account expires on <strong>${expiry}</strong>.
        </p>
      </div>

      <p style="margin:0;font-size:13px;color:#6B7280">
        If you face any issues, please contact your Administrator directly.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#F9FAFB;padding:16px 32px;border-top:1px solid #E5E7EB;text-align:center">
      <p style="margin:0;font-size:11.5px;color:#9CA3AF">© 2024 Research Management System · University of Excellence</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"RMS Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your RMS Test Login Credentials — ${testId}`,
    html,
  });

  console.log(`[EmailService] Test credentials sent to ${to}`);
}

module.exports = { sendTestCredentials };
