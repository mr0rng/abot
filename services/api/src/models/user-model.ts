import DAO, {UnexpectedNumberOfRows, DAOError} from '@abot/dao';
import { v4 } from 'uuid';
import { Session } from "../sessions/client";

class UserModelError extends Error {}
class UserExists extends UserModelError {}
class UserNotFound extends UserModelError {}

class UserModel {
    private dao: DAO;

    constructor(dao: DAO) {
        this.dao = dao;
    }

    async create(login: string, type: string, passwordHash: string): Promise<Session> {
        try {
            return await this.dao.executeOne(
                'INSERT INTO "Users" ("id", "login", "type", "payload", "passwordHash") VALUES ($1, $2, $3, $4, $5) RETURNING "id", "login", "type", "isAdmin", "isBanned", "payload";',
                [v4(), login, type, {}, passwordHash]
            ) as Session;
        } catch (e) {
            if (e.constraint === 'Users_login_type_key') {
                throw new UserExists("User already exists");
            }
            throw e;
        }
    };

    async getByCredentials(login: string, type: string, passwordHash: string): Promise<Session> {
        try {
            return await this.dao.executeOne(
                'SELECT "id", "login", "type", "isAdmin", "isBanned", "payload" FROM "Users" WHERE "login"=$1 AND "type"=$2 AND "passwordHash"=$3;',
                [login, type, passwordHash],
            ) as Session;
        } catch (e) {
            const error = e as UnexpectedNumberOfRows;
            if (error.isUnexpectedNumberOfRows) {
                throw new UserNotFound("User does not exists");
            }
            throw e;
        }
    }
}


export default UserModel;
export {UserExists, UserNotFound};
