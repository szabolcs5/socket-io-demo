import {sessionStore} from '../stores/session'

export function isUsername(username: string) {
    return username.length > 3;
}

export function isUsernameAvailable(username: string) {
    return !sessionStore.findSessionByUsername(username);
}
