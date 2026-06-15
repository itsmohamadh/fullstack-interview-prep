If I were preparing for a senior backend interview, these are the topics I'd prioritize.

---

# 1. Event Loop

This is probably the most important Node-specific topic.

### What is the Event Loop?

Node uses:

- Single-threaded JavaScript execution
- Non-blocking I/O
- Event Loop for scheduling work

Example:

```js
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

console.log("3");
```

Output:

```text
1
3
2
```

Common follow-up:

> If Node is single-threaded, how can it handle thousands of requests?

Answer:

Because network I/O is delegated to the OS/libuv and doesn't block the JavaScript thread.

---

# 2. Async Patterns

Know all three.

### Callback

```js
fs.readFile("file.txt", (err, data) => {});
```

### Promise

```js
readFile()
  .then(...)
  .catch(...);
```

### Async/Await

```js
try {
  const data = await readFile();
} catch (err) {
  console.error(err);
}
```

Interview question:

> Why is async/await preferred?

- Readability
- Easier error handling
- Less callback nesting

---

# 3. Promise.all vs Promise.allSettled

Common question.

### Sequential

```js
await getUser();
await getOrders();
```

### Parallel

```js
await Promise.all([getUser(), getOrders()]);
```

Faster because requests run concurrently.

---

### allSettled

```js
await Promise.allSettled([getUser(), getOrders()]);
```

Returns results even if some fail.

---

# 4. Middleware

Core Express concept.

```js
app.use((req, res, next) => {
  console.log(req.method);
  next();
});
```

Question:

> What is middleware?

Functions that run before route handlers.

Common examples:

- Authentication
- Logging
- Validation
- Rate limiting
- Error handling

---

# 5. Error Handling

Junior answer:

```js
try {
  ...
} catch (err) {
  ...
}
```

Senior answer:

Centralized error handling.

```js
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});
```

---

### Async Error Wrapper

```js
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

Usage:

```js
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await service.getUsers();
    res.json(users);
  }),
);
```

---

# 6. REST API Design

Very common.

Bad:

```text
GET /getUsers
POST /createUser
DELETE /deleteUser
```

Better:

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

Interviewers care about consistency.

---

# 7. HTTP Status Codes

Know these:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

Common question:

### Difference between 401 and 403?

401:

```text
Not authenticated
```

403:

```text
Authenticated
But not allowed
```

---

# 8. JWT Authentication

Extremely common.

### Login Flow

```text
User Login
 ↓
Verify credentials
 ↓
Generate JWT
 ↓
Return JWT
```

```js
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: "1h",
});
```

---

### Protected Route

```js
const payload = jwt.verify(token, process.env.JWT_SECRET);
```

Question:

> Where should JWTs be stored?

Good answer:

- HttpOnly cookie (preferred)
- Avoid localStorage for sensitive auth

---

# 9. Sessions vs JWT

Classic question.

### Session

```text
Server stores session
Client stores session ID
```

Pros:

- Easy revocation

Cons:

- Shared session store required

---

### JWT

```text
Self-contained token
```

Pros:

- Stateless
- Easy horizontal scaling

Cons:

- Harder revocation

---

# 10. Refresh Tokens

Senior interview favorite.

Problem:

```text
Access token expires
User should stay logged in
```

Solution:

```text
Short-lived access token
Long-lived refresh token
```

Flow:

```text
Access token expired
 ↓
Send refresh token
 ↓
Issue new access token
```

---

# 11. Password Hashing

Question:

> Can we store passwords encrypted?

Correct answer:

No.

Store hashed passwords.

Use:

```text
bcrypt
argon2
```

Example:

```js
const hash = await bcrypt.hash(password, 12);
```

Verify:

```js
await bcrypt.compare(password, hash);
```

---

# 12. Authentication vs Authorization

Interviewers ask this constantly.

### Authentication

```text
Who are you?
```

Example:

```text
Login
JWT
Session
```

---

### Authorization

```text
What are you allowed to do?
```

Example:

```text
Admin
Moderator
User
```

---

# 13. RBAC (Role-Based Access Control)

Example:

```js
const allow =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }

    next();
  };
```

Usage:

```js
app.delete("/users/:id", auth, allow("admin"), controller);
```

---

# 14. Rate Limiting

Very common.

Protect against:

- Abuse
- Brute force attacks
- API flooding

Example:

```js
rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

Often backed by Redis.

---

# 15. Security Questions

### SQL Injection

Bad:

```js
`SELECT * FROM users
 WHERE email='${email}'`;
```

Good:

```js
db.query("SELECT * FROM users WHERE email=?", [email]);
```

Or ORM parameterization.

---

### XSS

User input:

```html
<script>
  alert(1);
</script>
```

Mitigation:

- Escape output
- Sanitize input
- CSP headers

---

### CSRF

Question:

> What is CSRF?

Attacker causes authenticated user to perform actions unknowingly.

Protection:

- SameSite cookies
- CSRF tokens

---

# 16. CORS

Question:

> Why am I getting a CORS error?

Browser security restriction.

Example:

```js
app.use(
  cors({
    origin: "https://myfrontend.com",
    credentials: true,
  }),
);
```

---

# 17. File Uploads

Common practical question.

Use:

```text
multer
```

Important discussion:

- File size limits
- Validation
- Virus scanning
- S3 uploads

---

# 18. Logging

Bad:

```js
console.log();
```

Production:

```text
Pino
Winston
```

Structured logs:

```js
logger.info({
  userId,
  route,
});
```

---

# 19. Scaling Node Applications

Question:

> One Node process uses only one CPU core. How do you scale?

Options:

### Cluster

```text
One worker per CPU core
```

### Containers

```text
Multiple instances
```

### Load Balancer

```text
Nginx
ALB
```

---

# 20. Common Architecture Question

Design:

```text
Auth Service
User Service
Order Service
```

Discussion:

- Separation of concerns
- Shared database?
- Event-driven communication?
- Redis cache?
- Message queues?

Interviewers want reasoning more than a perfect answer.

---

# 21. Express Folder Structure

Typical question:

```text
src/
├── controllers
├── services
├── repositories
├── middleware
├── routes
├── validators
├── utils
└── app.js
```

Senior discussion:

Keep business logic out of controllers.

Bad:

```js
router.get("/users", async () => {
  // 200 lines
});
```

Good:

```js
controller
  -> service
     -> repository
```

---

# 22. Most Common Real Interview Scenario

> Build authentication for an API.

Expected discussion:

### Registration

```text
Validate input
Hash password
Store user
```

### Login

```text
Verify password
Generate JWT
Return token
```

### Protected Route

```text
Verify JWT
Attach user to request
Continue
```

### Authorization

```text
Check role
Allow or deny
```

### Security

```text
Rate limiting
Password hashing
Refresh tokens
HttpOnly cookies
```

---

# 23. Topics That Separate Mid-Level from Senior

Most candidates know:

- Express routes
- Middleware
- JWT

The stronger candidates can explain:

- Event Loop internals
- JWT vs Session tradeoffs
- Refresh token strategy
- RBAC
- Rate limiting with Redis
- Horizontal scaling
- Centralized error handling
- Logging and observability
- Security concerns (XSS, CSRF, SQL injection)
- Service architecture decisions

If you're interviewing for Node backend roles, a surprisingly high percentage of interviews revolve around a single flow:

```text
User Login
 ↓
JWT
 ↓
Refresh Token
 ↓
Protected Route
 ↓
Role Check
 ↓
Rate Limiting
 ↓
Redis Cache
```

If you can design and discuss that end-to-end, you're already covering a large portion of what senior Node/Express interviewers care about.
