import { Hono } from "hono";

import { kindeClient, sessionManager } from "../kinde";
import { getUser } from "../kinde"

// all the routes that deals with loggin in, registering are here

export const authRoute = new Hono()
  .get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
  })
  .get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  })
  .get("/callback", async (c) => {
    // this is what kinde will call once its done loggin in or registering a user, it will redirect the uesr to / route
    const url = new URL(c.req.url);   // get the context, for extracting url and session manager
    await kindeClient.handleRedirectToApp(sessionManager(c), url);
    return c.redirect("/");
  })
  .get("/logout", async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  })
  .get("/me", getUser, async (c) => {
    const user = c.var.user
    return c.json({ user });
  });