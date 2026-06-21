# 1. What is WebSocket and why use it?

WebSocket is a protocol that provides a persistent, two-way connection between a client and server.

HTTP:

Client → Request
Server → Response
Connection closes

WebSocket:

Client ↔ Server

The connection stays open, and both sides can send messages anytime.

Common use cases:

- Chat applications
- Live notifications
- Online/offline user status
- Collaborative editing
- Live dashboards
- Gaming

---

# 2. Why not use HTTP polling?

Polling:

Every 5 seconds:

Client:
"Any new messages?"

Server:
"No"

5 seconds later:

"Any new messages?"

Problem:

- Many unnecessary requests
- Higher server load
- Delayed updates

WebSocket:

User sends message
↓
Server immediately pushes it
↓
Other users receive it instantly

---

# 3. Explain the WebSocket connection lifecycle.

1. Client sends HTTP WebSocket upgrade request

2. Server accepts and upgrades the connection

3. Persistent connection is established

4. Messages can flow both directions

5. Either side can close the connection

---

# 4. How does a chat application work with WebSockets?

Example:

User A sends:

{
"roomId": "123",
"message": "Hello"
}

Server:

- Validates the user
- Stores the message in PostgreSQL
- Broadcasts it to users in that room

Other clients receive:

{
"user": "A",
"message": "Hello"
}

Important:

The database remains the source of truth.

WebSocket is only the transport layer for real-time updates.

---

# 5. How do you know which users should receive a message?

Usually with rooms/channels.

Example:

room:123

Users:

Alice
Bob
Charlie

When Alice sends a message:

Server emits to room:123.

Only users in that room receive it.

---

# 6. What happens if a user disconnects?

The server receives a disconnect event.

Common actions:

- Mark user as offline
- Remove their socket from active connections
- Clean up memory/resources

Clients usually attempt automatic reconnection.

---

# 7. What happens if a message is sent while the user is offline?

This separates a beginner from someone with production experience.

Bad approach:

"WebSocket stores the message."

No.

Good approach:

- Store messages in PostgreSQL
- User reconnects
- Fetch missed messages via API or synchronization logic

WebSocket delivers live updates, but persistence belongs to the database.

---

# 8. How do you authenticate a WebSocket connection?

Common approaches:

During the initial handshake:

Client sends:

- JWT token
- Session cookie

Server:

- Validates token
- Attaches user information to the connection

Example:

socket.user = {
id: 123,
role: "admin"
}

---

# 9. How do you scale WebSocket servers?

Single server:

Users
↓
WebSocket Server

Multiple servers:

Users
↓
Server A
Server B
Server C

Problem:

User A is connected to Server A.
User B is connected to Server C.

How does A's message reach B?

Solution:

Use a shared pub/sub system, often Redis.

Flow:

Server A receives message
↓
Publish to Redis channel
↓
Server C receives event
↓
Send message to User B

---

# 10. Why would you use Redis with WebSockets?

Redis can maintain communication between multiple WebSocket servers.

Examples:

- Redis Pub/Sub
- Socket.IO Redis adapter

It allows messages and events to be shared across all instances.

---

# 11. Can WebSocket replace REST APIs?

No.

REST is still better for:

- CRUD operations
- Fetching initial data
- Authentication endpoints
- Resource-based APIs

WebSocket is better for:

- Real-time events
- Notifications
- Presence updates

Most real applications use both.

---

# 12. What problems can WebSockets create?

1. Connection management

Thousands of users keep connections open.

2. Reconnection logic

Network interruptions happen.

3. Scaling

Multiple servers need shared state.

4. Security

You must authenticate and authorize connections.

5. Memory leaks

Disconnected sockets must be cleaned up.

---

# 13. Explain your WebSocket experience.

Strong answer based on your resume:

"In our dealership platform we built a real-time chat system between website visitors and dealership staff.

We used WebSockets so messages appeared instantly without the client repeatedly polling the server.

When a message arrived, the backend handled validation and persistence, stored it in the database, and then pushed the event to the relevant connected users.

We also handled user connection status and connection lifecycle events."

---

# 14. Mid vs Senior WebSocket knowledge

Mid-level knows:

- WebSocket vs HTTP
- Real-time communication
- Rooms
- Authentication
- Reconnection handling

More senior discussion:

- Horizontal scaling with Redis Pub/Sub
- Handling millions of connections
- Message ordering
- Back-pressure
- Presence systems
- Connection reliability

For your interviews, the mid-level topics are enough.
# WebSockets & Socket.io Interview Preparation (80/20)

---

# WebSocket Fundamentals

### Q1: What is WebSocket and why do we need it?

**Answer:**

WebSocket is a communication protocol that allows a **persistent, two-way connection** between a client and a server.

Traditional HTTP follows a request-response model:

```
Client -------- Request --------> Server
Client <------- Response -------- Server
(Connection closes)
```

With WebSocket:

```
Client <====== Persistent Connection ======> Server

Client can send messages anytime
Server can push messages anytime
```

It is useful when the server needs to send data to clients in real time.

Common use cases:

- Chat applications
- Live notifications
- Multiplayer games
- Collaborative editors
- Live dashboards
- Stock/crypto prices
- Online presence indicators

---

# Q2: How does the WebSocket connection start?

**Answer:**

WebSocket starts as a normal HTTP request using an **HTTP Upgrade handshake**.

Flow:

1. Client sends an HTTP request with:

```
Upgrade: websocket
Connection: Upgrade
```

2. Server accepts the upgrade and returns `101 Switching Protocols`.

3. The connection changes from HTTP to WebSocket.

4. Both sides keep the TCP connection open and exchange messages freely.

---

# Q3: Why not just use polling or HTTP requests?

**Answer:**

### Regular polling

The client repeatedly asks:

```
"Do you have new data?"
"Do you have new data?"
"Do you have new data?"
```

Problems:

- Many unnecessary requests
- Increased server load
- Delayed updates depending on polling interval

---

### WebSockets

The server pushes data immediately:

```
User sends message
        ↓
Server receives it
        ↓
Server instantly pushes it to other users
```

Benefits:

- Real-time updates
- Lower latency
- Less network overhead

---

# Socket.io Basics

### Q4: What is Socket.io?

**Answer:**

Socket.io is a library that provides a higher-level API for real-time communication.

It uses WebSocket when available and can fall back to other transports when necessary.

It provides features like:

- Event-based communication
- Automatic reconnection
- Rooms
- Broadcasting
- Acknowledgements
- Connection management

---

### Q5: Explain the basic client-server flow.

**Answer:**

Client:

```javascript
const socket = io("https://api.example.com");

socket.on("message", (data) => {
  console.log(data);
});

socket.emit("sendMessage", {
  text: "Hello"
});
```

---

Server:

```javascript
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("sendMessage", (data) => {
    console.log(data);

    socket.emit("message", data);
  });
});
```

Key idea:

- `emit()` sends an event
- `on()` listens for an event

---

# Connections & User Management

### Q6: How do you identify which socket belongs to which user?

**Answer:**

Each connection has a unique socket ID:

```javascript
socket.id
```

However, in production we usually associate the socket with an authenticated user.

Example:

```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  const user = verifyJWT(token);

  socket.user = user;

  next();
});
```

Then:

```javascript
console.log(socket.user.id);
```

This allows us to know which user is sending messages.

---

# Rooms (Groups)

### Q7: What are rooms in Socket.io?

**Answer:**

Rooms are groups of sockets.

A socket can join multiple rooms.

Example:

```
Socket A --------\
                  \
                   Room: chat-123
                  /
Socket B --------/
```

When a message is sent to the room, everyone inside receives it.

Use cases:

- Chat conversations
- Team workspaces
- Game lobbies
- Live events
- User-specific notifications

---

### Q8: How do users join a room?

**Answer:**

Server:

```javascript
socket.on("joinChat", (chatId) => {
  socket.join(`chat:${chatId}`);
});
```

Now the socket is part of that room.

---

### Q9: How do you send a message to everyone in a room?

**Answer:**

```javascript
io.to("chat:123").emit("newMessage", {
  text: "Hello everyone"
});
```

All users inside `chat:123` receive the event.

---

### Q10: How do you send a message to everyone except the sender?

**Answer:**

Use `socket.broadcast`.

Example:

```javascript
socket.broadcast.emit("userTyping", {
  userId: 10
});
```

Everyone connected except the current socket receives it.

For a room:

```javascript
socket.to("chat:123").emit("userTyping", {
  userId: 10
});
```

Everyone in the room receives it except the sender.

---

# Real Chat Architecture

### Q11: How would you design a chat system using Socket.io?

**Answer:**

Typical flow:

### User opens chat

1. Client connects using JWT.
2. Server authenticates the socket.
3. User joins their chat rooms.

Example:

```
User 25 joins:

chat:100
chat:200
chat:300
```

---

### User sends a message

Client:

```javascript
socket.emit("sendMessage", {
  chatId: 100,
  text: "Hello"
});
```

Server:

1. Validate the user has access to the chat.
2. Save the message in PostgreSQL.
3. Emit the new message to the chat room.

Example:

```javascript
io.to("chat:100").emit("newMessage", message);
```

---

### Why save to the database?

WebSocket is only a transport layer.

If the server restarts, the messages are gone.

Persistent data like:

- Messages
- Users
- Chat history

must be stored in a database.

---

# Presence & Online Users

### Q12: How do you track online/offline users?

**Answer:**

When a user connects:

```javascript
onlineUsers.set(user.id, socket.id);
```

When they disconnect:

```javascript
socket.on("disconnect", () => {
  onlineUsers.delete(user.id);
});
```

You can then emit:

```javascript
io.emit("userOnline", {
  userId: user.id
});
```

---

In production, this is usually stored in Redis rather than memory so multiple server instances share the same online state.

---

# Scaling Socket.io

### Q13: What happens when you have multiple Node servers?

**Answer:**

Example:

```
Load Balancer
      |
------------------
|                |
Server A      Server B
```

Problem:

User A connects to Server A.

User B connects to Server B.

If Server A emits a message, Server B doesn't know about it.

---

Solution: Use a Socket.io Redis adapter.

Architecture:

```
        Redis Pub/Sub
             |
   ----------------------
   |                    |
Server A            Server B
   |                    |
Users               Users
```

When Server A emits an event:

1. It publishes the event to Redis.
2. Redis forwards it to other Socket.io servers.
3. Server B sends it to its connected users.

This allows rooms and broadcasts to work across multiple instances.

---

# Reliability

### Q14: What happens if the user loses internet connection?

**Answer:**

Socket.io automatically attempts to reconnect.

Typical flow:

```
Connected
    |
Internet lost
    |
Disconnected
    |
Automatic reconnect attempts
    |
Connected again
```

On reconnection you may need to:

- Re-authenticate the user
- Rejoin rooms
- Fetch missed data from the database

---

# Acknowledgements

### Q15: How do you know if the server successfully received a message?

**Answer:**

Socket.io supports acknowledgements.

Client:

```javascript
socket.emit(
  "sendMessage",
  message,
  (response) => {
    console.log(response.status);
  }
);
```

Server:

```javascript
socket.on("sendMessage", (message, callback) => {
  saveMessage(message);

  callback({
    status: "success"
  });
});
```

This is useful for:

- Message delivery confirmation
- Showing "sent" status
- Handling errors

---

# Security

### Q16: What security considerations exist for WebSockets?

**Answer:**

Important considerations:

- Authenticate connections using JWT or sessions.
- Never trust client events.
- Validate all incoming data.
- Check authorization for rooms and actions.
- Rate limit messages to prevent abuse.
- Use HTTPS/WSS in production.
- Sanitize user-generated content before displaying it.

Example:

A user sends:

```
joinChat(chatId: 100)
```

The server must verify that the user actually belongs to chat 100 before allowing:

```javascript
socket.join("chat:100");
```

---

# Common Interview Scenarios

### Q17: "We already have REST APIs. When would you add WebSockets?"

**Answer:**

I would add WebSockets when the server needs to push data to clients immediately.

Examples:

Good use cases:
- New chat messages
- Notifications
- User presence
- Live dashboards

Not necessary:
- Profile updates
- Settings pages
- Data that only changes after a user action

For many applications, a hybrid approach is best:

REST:
- CRUD operations
- Initial data fetching

WebSockets:
- Real-time updates

---

# Senior Discussion

### Q18: What challenges have you faced with WebSockets in production?

**Answer:**

Common challenges include:

- Managing authentication and reconnects
- Handling users connected from multiple tabs/devices
- Scaling connections across multiple servers
- Keeping online presence accurate
- Preventing unauthorized room access
- Handling missed events after a user reconnects

A robust architecture usually combines:

- Socket.io for real-time transport
- PostgreSQL for persistence
- Redis for shared state and Pub/Sub
- REST APIs for standard CRUD operations

---

# Most Likely Interview Topics (Know These Very Well)

1. WebSocket vs HTTP polling
2. WebSocket handshake
3. Socket.io events (`emit` and `on`)
4. Authentication with sockets
5. Rooms and broadcasting
6. Designing a real-time chat system
7. Tracking online users
8. Handling disconnects and reconnects
9. Scaling Socket.io using Redis Pub/Sub
10. Security and authorization

For a mid-level to senior frontend-focused full-stack role, these are the topics most likely to come up.