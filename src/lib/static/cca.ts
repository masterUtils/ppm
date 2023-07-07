import { ConfidentialClientApplication } from "@azure/msal-node";
import { msClientID, msClientSecret } from "./env";
import { MsCachePlugin } from "../msCache";

export const cca = new ConfidentialClientApplication(
  {
    auth: {
      clientId: msClientID,
      clientSecret: msClientSecret,
      authority: "https://login.microsoftonline.com/consumers"
    },
    cache: {
      cachePlugin: new MsCachePlugin()
    }
  }
);
