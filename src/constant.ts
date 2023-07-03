import { msClientID, msClientSecret } from "./env";
import { ConfidentialClientApplication } from "@azure/msal-node";

export const MiddlewareUserKey = "x-user";
export const TEMPLATE_WITH_PIC = `
<html lang="zh-CN">
 <head>
  <title>TITLE</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 </head>
 <body data-absolute-enabled="true" style="font-family:Microsoft YaHei,serif;font-size:11pt">
  <img src="PIC_URL" alt="problem"/>
 </body>
</html>
`;
export const TEMPLATE_WITHOUT_PIC = `
<html lang="zh-CN">
 <head>
  <title>TITLE</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 </head>
 <body data-absolute-enabled="true" style="font-family:Microsoft YaHei,serif;font-size:11pt">
 </body>
</html>
`;

export const baseUrl = process.env.NODE_ENV === "production" ?
  "https://master.learningman.top" :
  "http://localhost:3000";

export const redirectUri = `${baseUrl}/api/msAuth`;
export const scopes = ["User.Read", "profile", "offline_access",
  "Notes.Create", "Notes.ReadWrite.All"];

export const cca = new ConfidentialClientApplication(
  {
    auth: {
      clientId: msClientID,
      clientSecret: msClientSecret,
      authority: "https://login.microsoftonline.com/consumers"
    }
  }
);
