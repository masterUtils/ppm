import { MiddlewareUserKey } from "./static/constant";
import { IncomingHttpHeaders } from "http";

export function obtainUserFromMiddleware(header: IncomingHttpHeaders) {
  return header[MiddlewareUserKey] as string;
}
