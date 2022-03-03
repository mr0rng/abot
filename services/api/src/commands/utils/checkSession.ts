import {ApplicationError} from "../index";
import {Session} from "../../sessions/client";


export const getSession = async (app, session_key): Promise<Session> => {
  return await app.sessions.get_session(session_key);
}

export const ensureUser = async (app, session_key): Promise<Session> => {
  const session = await getSession(app, session_key);
  if (session === null || session.isBanned) {
    throw new ApplicationError(403, "Session is wrong.");
  }
  return session;
}

export const ensureAdminUser = async (app, session_key): Promise<Session> => {
  const session = await getSession(app, session_key);
  if (session === null || session.isBanned || !session.isAdmin) {
    throw new ApplicationError(403, "Session is wrong.");
  }
  return session;
}
