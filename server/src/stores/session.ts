import { ISession } from "../types/Session";

class SessionStore {
    sessions: Map<string, ISession>;
    
    constructor() {
        this.sessions = new Map();
    }

    findSession(sessionID: string): ISession | undefined {
        return this.sessions.get(sessionID);
    }

    findSessionByUsername(username: string): boolean {
        let sessionExists = false;
        this.sessions.forEach((session) => {
            if (session.username === username && session.connected) {
                sessionExists = true;
            }
         }
        );
        return sessionExists;
    }


    saveSession(sessionID: string, session: ISession): void {
        this.sessions.set(sessionID, session);
    }

    findAllSessions(): ISession[] {
        return Array.from(this.sessions.values());
    }
}

export const sessionStore = new SessionStore();
