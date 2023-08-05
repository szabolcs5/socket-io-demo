import { IPrivateMessage, ISocket } from '../types/Socket'
import validator from 'validator'

export function privateMessage(socket: ISocket, data: IPrivateMessage) {
  const { message, to } = data

  console.log('Private message from ', socket.userID, ' to ', to)

  const sanitizedMessage = validator.escape(message)

  socket.to(to).emit('private message', {
    message: sanitizedMessage,
    from: socket.userID,
    to,
  })
}
