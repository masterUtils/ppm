import { NextRequest, NextResponse } from "next/server";
import { password } from "./lib/static/env";
import { MiddlewareUserKey } from "./lib/static/constant";

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");
    if (pwd === password) {
      const headers = new Headers(req.headers);
      headers.set(MiddlewareUserKey, user);

      return NextResponse.next({
        request: { headers }
      });
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": "Basic realm='Next.js'"
    }
  });
}
