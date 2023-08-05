import { createServer } from 'http'
import { Server } from 'socket.io'
import { connect } from './middlewares/connect'
import { IPrivateMessage, ISocket } from './types/Socket'
import { sessionStore } from './stores/session'
import { privateMessage } from './controllers/private-message'
import { instrument } from '@socket.io/admin-ui'
import { createAdapter } from '@socket.io/mongo-adapter'
import { main } from './database/mongodb'

const server = createServer()
const PORT = process.env.PORT || 5000

// CORS options
const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io', 'http://localhost:3000'],
    credentials: true,
  },
})

// MongoDB adapter
main().then((collection) => {
  io.adapter(createAdapter(collection))
})

// Connect middleware
io.use(connect)

// User namespace
const usernsp = io.of('/user')
usernsp.on('connection', () => {
  console.log('A user connected to the user namespace')
  usernsp.emit('greetings', 'Hello from the user namespace')
})

// On connection
io.on('connection', (socket: ISocket) => {
  socket.join(socket.userID)

  console.log(`${socket.userID} - ${socket.username} user just connected!`)

  socket.on('private message', (data: IPrivateMessage) =>
    privateMessage(socket, data)
  )

  socket.emit('session', {
    sessionID: socket.sessionID,
    userID: socket.userID,
  })

  socket.on('disconnect', async () => {
    const matchingSockets = await io.in(socket.userID).allSockets()
    const isDisconnected = matchingSockets.size === 0
    if (isDisconnected) {
      console.log('User disconnected', socket.userID)

      socket.broadcast.emit('user disconnected', socket.userID)

      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      })
    }
  })

  socket.emit('online users', sessionStore.findAllSessions())

  socket.broadcast.emit('user connected', {
    userID: socket.userID,
    username: socket.username,
  })
})

// Server listener
server.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
)

// Admin UI
instrument(io, {
  auth: false,
  mode: 'development',
})
