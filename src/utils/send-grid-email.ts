import ENV from "../config/env";
import fs from "fs";

export function sendEmail(
  fromAddress: string,
  toAddress: string,
  subject: string,
  htmlBody: string
) {
  const msg = {
    to: toAddress,
    from: fromAddress,
    subject,
    // text: "and easy to do anywhere, even with Node.js",
    html: htmlBody,
  };

  // Sending email
  // return sgMail.send(msg);
  return true;
}

export function sendEmailWithAttachment(
  fromAddress: string,
  toAddress: string,
  subject: string,
  htmlBody: string,
  pathToAttachment: string,
  filename: string
) {
  console.log("pathToAttachment", pathToAttachment);
  const attachment = fs.readFileSync(pathToAttachment).toString("base64");
  const msg = {
    to: toAddress,
    from: fromAddress,
    subject,
    text: "and easy to do anywhere, even with Node.js",
    attachments: [
      {
        content: attachment,
        filename,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  return true;

  // return sgMail.send(msg).catch((error) => {
  //   console.log("ErrorLog", error);
  // });
}
