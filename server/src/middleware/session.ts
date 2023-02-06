import { nanoid } from "nanoid";

import session, { Session } from "express-session";
import PGSimple from "connect-pg-simple";
import { db } from "../db";
const PGSession = PGSimple(session);

import type { User } from "@types";
declare module "express-session" {
    interface SessionData {
        user: User;
    }
}
declare module "http" {
    interface IncomingMessage {
        session: Session & {
            user: User;
        };
    }
}
const sessionMiddleware = session({
    store: new PGSession({ pool: db, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET || "whatever this is",
    resave: false,
    saveUninitialized: false,
    name: "chessu",
    proxy: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === "production" ? true : false,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    },
    genid: function () {
        return nanoid(21);
    }
});

export default sessionMiddleware;
