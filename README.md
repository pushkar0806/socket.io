# WebSocket Implementation Node


## Features
* With webSocket, we have a persisent connection, which means the client connects to the server and stays connected for as long as it needs to!
* It is a seperate protocol from HTTP.
* Its a two directional connection meaning one client sends a message to the server, now the server sends this new message to the other clients connected to the same server. This gives the Real time scenario of the chat applications.
* User Room functionality to join and chat with your buddies. 
* Share your current location with your buddies.

# Prerequisite
```bash
1. node js >= 10
```
## Installation

```bash
npm install
```


2. socket.io Library
```bash
 npm i socket.io 
```

# Important packages used
1. express
2. socket.io


# Summary
* socket.emit -> sends event to specific client
* io.emit -> sends event to every connected client
* socket.broadcast.emit -> sends event to every connected clients except himself
* io.to.emit -> sends event to everybody in this room (configure the 'to')
* socket.broadcast.to.emit -> sends event to all the clients in that specific room, limiting the user himself
