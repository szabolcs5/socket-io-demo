import { Socket } from 'socket.io'

export interface ISocket extends Socket {
  sessionID: string
  userID: string
  username: string
}

export interface IPrivateMessage {
  message: string
  to: string
}
