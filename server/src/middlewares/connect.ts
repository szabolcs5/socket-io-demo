import { isUsername, isUsernameAvailable } from '../helpers/errorHandling'
import { sessionStore } from '../stores/session'
import { randomUUID } from 'crypto'
import { ISocket } from '../types/Socket'

function validateUsername(username: string) {
  console.log('Validating username', username)

  if (!isUsername(username)) {
    return 'Username must be at least 4 characters long'
  }

  if (!isUsernameAvailable(username)) {
    return 'Username is already taken'
  }

  return null
}

export function connect(
  socket: ISocket,
  next: (err?: Error | undefined) => void
) {
  const sessionID = String(socket.handshake.headers.sessionid ?? '')

  if (sessionID !== '') {
    const session = sessionStore.findSession(sessionID)

    if (session) {
      socket.sessionID = sessionID
      socket.userID = session.userID
      socket.username = session.username
      return next()
    }
  }

  const username = String(socket.handshake.headers.username)

  const error = validateUsername(username)

  if (error) {
    return next(new Error(error))
  }

  socket.sessionID = randomUUID()
  socket.userID = randomUUID()
  socket.username = username
  sessionStore.saveSession(socket.sessionID, {
    connected: true,
    userID: socket.userID,
    username: socket.username,
  })

  next()
}
