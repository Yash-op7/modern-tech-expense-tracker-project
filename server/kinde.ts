import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import { type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { z } from "zod";

const KindeEnv = z.object({
  KINDE_DOMAIN: z.string(),
  KINDE_CLIENT_ID: z.string(),
  KINDE_CLIENT_SECRET: z.string(),
  KINDE_REDIRECT_URI: z.string().url(),
  KINDE_LOGOUT_REDIRECT_URI: z.string().url(),
});

// throws an exception if the environment is missing something vital
const ProcessEnv = KindeEnv.parse(process.env);

// Client for authorization code flow
export const kindeClient = createKindeServerClient(       // setup the kinde client object 
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: ProcessEnv.KINDE_DOMAIN!,
    clientId: ProcessEnv.KINDE_CLIENT_ID!,
    clientSecret: ProcessEnv.KINDE_CLIENT_SECRET!,
    redirectURL: ProcessEnv.KINDE_REDIRECT_URI!,
    logoutRedirectURL: ProcessEnv.KINDE_LOGOUT_REDIRECT_URI!,
  }
);

// set up a session manager, kinde doesn't have an opinion on how we store the session details, when we login or register kinde will give us a token to identify the current user, we can just store them in some object in memory
// but we can store all login token details in a cookie so that every request we make from the client will contain those user details so it will be really easy to authorize with the server

let store: Record<string, unknown> = {};

export const sessionManager = (c: Context): SessionManager => ({
  // when we need the session we just get it from the cookie
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,   // so that it can't be accessed by JS
      secure: true,     // so that we have to have a SSL conn
      sameSite: "Lax",  // same site lax to avoid cross site forgery attacks  
    } as const;

    // set the token as a cookie
    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  // if we want to delete a session just remove the item/token from the cookie
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});


// now we setup a middleware function to pass the authenticated user to all the authenticated routes, and we make all expenses routes as authenticated routes
type Env = {
  Variables: {
    user: UserType;
  };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);
    if (!isAuthenticated) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const user = await kindeClient.getUserProfile(manager);
    c.set("user", user);
    await next();
  } catch (e) {
    console.error(e);
    return c.json({ error: "Unauthorized" }, 401);
  }
});