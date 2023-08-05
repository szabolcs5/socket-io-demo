# Chat Demo with socket.IO

## Server

To start the NodeJS server, run the following commands:

```
npm install
npm run serve
```

> To establish a connection with the server, a minimum 4 characters long username has to be sent in the header.

### Supported events

**session** (sessionID, userID)\
**user disconnected** (userID)\
**online users** (users[])\
**user connected** (userID, username)\
**private message** (message, from, to)\

### The admin platform

https://admin.socket.io/#/

> The URL of the backend server is needed here.

## Frontend

To start the ReactJS frontend, run the following commands:

```
npm install
npm run start
```

### Functionalities

-   login on the home page by providing a username
-   selection of a user to chat with
-   switching between recipients
