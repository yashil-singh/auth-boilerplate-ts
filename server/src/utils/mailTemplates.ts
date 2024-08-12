type VerificationMailProps = {
  receiverName: string;
  verificationCode: string;
  appName?: string;
  backgroundImage?: string;
};

type WelcomeMailProps = {
  receiverName: string;
  appName?: string;
  backgroundImage?: string;
};

type PasswordResetMailProps = {
  receiverName: string;
  appName?: string;
  backgroundImage?: string;
  resetLink: string;
  expiry: string;
};

export const generateVerificationMailTemplate = ({
  appName = process.env?.APP_NAME,
  receiverName,
  verificationCode,
  backgroundImage = process.env?.MAIL_BACKGROUND,
}: VerificationMailProps) => {
  const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
  </head>
  <body
    style="
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
        sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <div
      style="
        background-image: url(${backgroundImage});
        background-size: cover;
        padding: 80px;
        border-radius: 6px;
      "
    >
      <div
        style="background-color: white; padding: 20px 60px; border-radius: 6px"
      >
        <div style="padding: 20px 0px">
          <h1 style="margin: 0">Verify Your Email Address</h1>
        </div>
        <p>Hello <span style="font-weight: bold">${
          receiverName.split(" ")[0]
        }</span>,</p>
        <p>Thank you for signing up! Here is your verification code:</p>
        <div style="text-align: center; margin: 30px 0">
          <span
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 5px;
              color: #00b4d8;
            "
            >${verificationCode}</span
          >
        </div>
        <p>
          Enter this code on the verification page to complete your
          registration.
        </p>
        <p>This code will expire in 15 minutes for security reasons.</p>
        <p>
          If you didn't create an account on ${appName}, please ignore this email.
        </p>
        <br />
        <p>
          Best regards,<br /><span style="font-weight: bold">${appName}</span>
        </p>
      </div>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>`;

  return template;
};

export const generateWelcomeMailTemplate = ({
  appName = process.env?.APP_NAME,
  receiverName,
  backgroundImage = process.env?.MAIL_BACKGROUND,
}: WelcomeMailProps) => {
  const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome | ${appName}</title>
  </head>
  <body
    style="
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
        sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <div
      style="
        background-image: url(${backgroundImage});
        background-size: cover;
        padding: 80px;
        border-radius: 6px;
      "
    >
      <div
        style="background-color: white; padding: 20px 60px; border-radius: 6px"
      >
        <div style="padding: 20px 0px">
          <h1 style="margin: 0">Welcome ${receiverName}!</h1>
        </div>
        <p>Thank you for choosing ${appName}! We are happy to see you on board.</p>

        <p>Best regards,<br /><span style="font-weight: bold">${appName}</span></p>
      </div>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>`;

  return template;
};

export const generatePasswordResetMailTemplate = ({
  appName = process.env?.APP_NAME,
  receiverName,
  resetLink,
  expiry,
  backgroundImage = process.env?.MAIL_BACKGROUND,
}: PasswordResetMailProps) => {
  const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
  </head>
  <body
    style="
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
        sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <div
      style="
        background-image: url(${backgroundImage});
        background-size: cover;
        padding: 80px;
        border-radius: 6px;
      "
    >
      <div
        style="background-color: white; padding: 20px 60px; border-radius: 6px"
      >
        <div style="padding: 20px 0px">
          <h1 style="margin: 0">Hello ${receiverName.split(" ")[0]},</h1>
        </div>
        <p>
          We received a request to reset your password. If you didn't make this
          request, please ignore this email.
        </p>

        <p>We recommend that you:</p>

        <ul>
          <li>Use a strong, unique password.</li>
          <li>Enable two-factor authentication if available</li>
          <li>Avoid using the same password across multiple sites.</li>
        </ul>

        <p>To reset your password, click on the button below:</p>

        <div style="text-align: center; margin: 50px 0">
          <a
            href="${resetLink}"
            style="
              background-color: #00b4d8;
              color: white;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            "
            >Reset Password</a
          >
        </div>

        <p>
          Note that this link will expire in
          <span style="font-weight: bold">${expiry}</span>.
        </p>

        <p>Best regards,<br /><span style="font-weight: bold">${appName}</span></p>
      </div>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>
`;

  return template;
};

export const generatePasswordResetSuccessMailTemplate = ({
  receiverName,
  appName = process.env?.APP_NAME,
  backgroundImage = process.env?.MAIL_BACKGROUND,
}: WelcomeMailProps) => {
  const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>
  <body
    style="
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
        sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <div
      style="
        background-image: url(${backgroundImage});
        background-size: cover;
        padding: 80px;
        border-radius: 6px;
      "
    >
      <div
        style="background-color: white; padding: 20px 60px; border-radius: 6px"
      >
        <div style="padding: 20px 0px">
          <h1 style="margin: 0">Hello ${receiverName.split(" ")[0]},</h1>
        </div>
        <p>
          We are writing to confirm that your password has been successfully
          reset.
        </p>

        <div
          style="
            width: 100%;
            display: flex;
            margin: 30px 0px;
          "
        >
          <span
            style="
              background-color: #4caf50;
              color: white;
              width: 50px;
              height: 50px;
              line-height: 50px;
              border-radius: 50%;
              display: inline-block;
              font-size: 30px;
              text-align: center;
              margin: auto;
            "
          >
            ✓
          </span>
        </div>

        <p>
          If you not initiate this reset, please contact our support team
          immediately.
        </p>

        <p>Thank you for helphg us keep your account secure.</p>

        <p>Best regards,<br /><span style="font-weight: bold">${appName}</span></p>
      </div>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>`;

  return template;
};
