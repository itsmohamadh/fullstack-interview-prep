## Event Loop & Concurrency

### Q1: If Node.js is single-threaded, how can it handle thousands of concurrent requests?

**Answer:**
Node.js uses a single JavaScript thread for executing your code, but I/O operations (network requests, file reads, database queries) are delegated to libuv (the OS kernel). While waiting for those operations to complete, the event loop continues processing other tasks. When the I/O finishes, the callback is placed in the event queue and executed. This means the JavaScript thread never blocks on I/O, allowing it to handle many concurrent connections efficiently.

---

### Q2: What will this code output and why?

```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
```

**Answer:**

```
1
4
3
2
```

**Explanation:** `console.log("1")` and `console.log("4")` run first (synchronous). Microtasks (Promise callbacks) run before the next event loop tick, so `"3"` comes next. `setTimeout` (even with 0ms) goes to the macrotask queue and runs after microtasks.

---

## Async Patterns

### Q3: Why is async/await preferred over callbacks and raw Promises?

**Answer:**

1. **Readability** - Code reads linearly like synchronous code
2. **Error handling** - Try/catch works naturally instead of `.catch()` chains
3. **Debugging** - Stack traces are clearer
4. **Avoids callback hell** - No nested indentation
5. **Conditionals and loops** - Can use standard JavaScript flow control (if, for, while) naturally

---

### Q4: When would you use Promise.all() vs Promise.allSettled()?

**Answer:**

- **Promise.all()** - Use when all requests must succeed. If any fails, the entire promise rejects immediately. Best for scenarios where partial data is not acceptable.

- **Promise.allSettled()** - Use when you want results from all requests regardless of failures. Returns `{ status, value/reason }` for each. Best for logging, analytics, or when some failures are acceptable.

Example: Fetching user profile AND their orders. If orders fail but profile succeeds, you might still show the profile. Use `allSettled`.

---

## Express Middleware & Error Handling

### Q5: What is Express middleware and when do you use it?

**Answer:**
Middleware are functions that have access to `req`, `res`, and `next`. They run before route handlers. Common uses:

- Authentication (checking JWT)
- Logging requests
- Request validation (body, params, query)
- Rate limiting
- CORS configuration
- Compression
- Parsing request bodies (body-parser)
- Error handling (4-argument middleware)

---

### Q6: Design a centralized error handling system for an Express API.

**Answer:**

```js
// async wrapper to avoid try/catch in every route
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Central error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  // Log full error for debugging
  logger.error({ err, req: { method: req.method, url: req.url } });

  // Send appropriate response
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
```

---

## REST API & HTTP

### Q7: What's wrong with these endpoints? `GET /getUsers`, `POST /createUser`, `DELETE /deleteUser/:id`

**Answer:**
They violate REST conventions. The HTTP method already indicates the action, so verbs in the URL are redundant. Correct version:

```
GET    /users          (list users)
GET    /users/:id      (get one user)
POST   /users          (create user)
PUT    /users/:id      (update user)
DELETE /users/:id      (delete user)
```

Also, use plural nouns consistently.

---

### Q8: Explain the difference between 401 and 403 status codes.

**Answer:**

| Code | Name         | Meaning                                            | Example                                         |
| ---- | ------------ | -------------------------------------------------- | ----------------------------------------------- |
| 401  | Unauthorized | Not authenticated - missing or invalid credentials | No JWT token provided                           |
| 403  | Forbidden    | Authenticated but not authorized to perform action | Regular user trying to delete an admin resource |

**Key distinction:** 401 means "login first", 403 means "logged in but can't do that".

---

## JWT & Authentication

### Q9: Walk through the complete JWT authentication flow for an API.

**Answer:**

**Registration:**

1. Validate input (email, password strength)
2. Hash password with bcrypt (salt rounds = 12)
3. Store user in database
4. Return success (never return password hash)

**Login:**

1. Find user by email
2. Compare password with bcrypt.compare()
3. Generate access token: `jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '15m' })`
4. Generate refresh token (stored in DB or separate JWT)
5. Set access token as HttpOnly cookie OR return in response body

**Protected Route:**

1. Extract token from Authorization header or cookie
2. Verify with `jwt.verify()`
3. Attach decoded payload to `req.user`
4. Continue to route handler

---

### Q10: Where should JWTs be stored? Why is localStorage a bad choice?

**Answer:**

**Preferred:** HttpOnly cookies

- Not accessible via JavaScript (prevents XSS token theft)
- Automatically sent with requests
- Can set SameSite attribute for CSRF protection

**Avoid:** localStorage

- Vulnerable to XSS (any injected script can read the token)
- Must manually attach to requests
- No built-in expiration handling

**Compromise:** Memory (store in app state) + refresh token in HttpOnly cookie

---

### Q11: Sessions vs JWT - pros and cons of each.

**Answer:**

| Aspect          | Sessions                          | JWT                            |
| --------------- | --------------------------------- | ------------------------------ |
| **Storage**     | Server (memory/Redis)             | Client-side                    |
| **Scalability** | Need shared session store (Redis) | Stateless - any server works   |
| **Revocation**  | Easy - delete from store          | Hard - must maintain blacklist |
| **Payload**     | Session ID only                   | Can include user data/roles    |
| **Size**        | Small cookie                      | Can be large                   |
| **Security**    | Can invalidate immediately        | Valid until expiration         |

**Decision:** Use JWT for stateless APIs, microservices, mobile apps. Use sessions for traditional web apps needing easy revocation.

---

### Q12: Explain the refresh token flow.

**Answer:**

**Problem:** Access tokens are short-lived (e.g., 15 minutes) for security, but users shouldn't have to log in every 15 minutes.

**Solution:**

1. On login, issue:
   - Access token (15 min expiry)
   - Refresh token (7 days expiry, stored in DB or as separate JWT)
2. Client uses access token for API calls
3. When access token expires (API returns 401):
   - Client sends refresh token to `/refresh` endpoint
   - Server validates refresh token
   - Server issues new access token
   - Client retries original request
4. If refresh token expires or is revoked, user must re-authenticate

**Security:** Refresh tokens can be revoked on logout or suspicious activity.

---

## Security

### Q13: How do you properly hash passwords? Why encryption is wrong?

**Answer:**

**Never encrypt passwords** - encryption is reversible. If someone gets the key, all passwords are compromised.

**Always hash** with:

- **bcrypt** (most common) - includes salt and is deliberately slow
- **argon2** (modern, memory-hard) - preferred for new projects

```js
// Hash (cost factor 12 - takes ~0.1-0.3 seconds)
const hash = await bcrypt.hash(password, 12);

// Verify
const isValid = await bcrypt.compare(plaintextPassword, hash);
```

**Salting** ensures identical passwords produce different hashes, preventing rainbow table attacks.

---

### Q14: Authentication vs Authorization - explain with examples.

**Answer:**

|                | Authentication            | Authorization             |
| -------------- | ------------------------- | ------------------------- |
| **Question**   | "Who are you?"            | "What can you do?"        |
| **Happens**    | First                     | After auth                |
| **Example**    | Login with email/password | Checking if user is admin |
| **HTTP codes** | 401 Unauthorized          | 403 Forbidden             |

**Real example:** Airport security

- Authentication = Showing your passport (proving identity)
- Authorization = Boarding pass (allowed to board specific flight)

---

### Q15: Implement a role-based access control (RBAC) middleware.

**Answer:**

```js
// Middleware factory
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Role ${req.user.role} not allowed. Requires: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

// Usage
app.delete(
  "/users/:id",
  auth, // First authenticate
  requireRoles("admin", "moderator"),
  deleteUserController,
);
```

---

### Q16: What is SQL injection and how do you prevent it?

**Answer:**

**SQL injection** occurs when user input is concatenated directly into SQL queries, allowing attackers to modify query structure.

**Bad (vulnerable):**

```js
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

**Good (parameterized):**

```js
// MySQL with placeholders
const result = await db.query("SELECT * FROM users WHERE email = ?", [
  userEmail,
]);

// OR with ORM (Sequelize/Prisma)
const user = await User.findOne({ where: { email: userEmail } });
```

**Additional protection:** Input validation, least privilege DB accounts, escaping input if parameters aren't available.

---

### Q17: What is CORS and how do you fix CORS errors?

**Answer:**

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that restricts web pages from making requests to a different domain than the one that served the page.

**The error:** `https://myfrontend.com` tries to call `https://api.mybackend.com` without proper CORS headers.

**Fix in Express:**

```js
const cors = require("cors");

app.use(
  cors({
    origin: "https://myfrontend.com", // Allow specific origin
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

**For development:** `origin: "*"` (but never in production unless it's a public API).

---

## Rate Limiting & Scaling

### Q18: How do you implement rate limiting for an API endpoint?

**Answer:**

```js
const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "rate-limit:",
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "Too many requests, please try again later.",
  keyGenerator: (req) => req.user?.id || req.ip, // Use user ID when available
});

// Apply to specific routes
app.post("/login", limiter, loginController);
app.use("/api/", limiter); // Apply to all API routes
```

**Why Redis?** In a multi-process/container environment, in-memory rate limits don't share state. Redis provides shared counters across all instances.

---

### Q19: One Node process uses only one CPU core. How do you scale Node.js applications?

**Answer:**

**Option 1: Cluster Module (built-in)**

```js
const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) cluster.fork();
  cluster.on("exit", (worker) => cluster.fork()); // Auto-restart
} else {
  app.listen(3000);
}
```

**Option 2: Container orchestration**

- Deploy multiple containers (Docker) behind a load balancer (Nginx, ALB)
- Each container runs a Node process
- Scale horizontally by adding more containers

**Option 3: Process managers**

- PM2 with cluster mode: `pm2 start app.js -i max`

**Shared state consideration:** Use Redis for sessions, rate limits, and caching when running multiple processes.

---

## Architecture & Code Organization

### Q20: What folder structure would you recommend for a large Express API?

**Answer:**

```
src/
├── config/
│   ├── database.js
│   ├── redis.js
│   └── env.js
├── controllers/
│   └── userController.js      // Only request/response handling
├── services/
│   └── userService.js         // Business logic
├── repositories/
│   └── userRepository.js      // Database operations
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── rateLimit.js
├── models/
│   └── User.js                // Database models (Prisma/Sequelize)
├── routes/
│   └── userRoutes.js
├── validators/
│   └── userValidator.js       // Input validation (Joi/Zod)
├── utils/
│   ├── logger.js
│   └── jwt.js
├── app.js                     // Express app setup
└── server.js                  // Start server
```

**Key principle:** Keep controllers thin. Business logic goes in services. Database access goes in repositories.

---

### Q21: Why should business logic not be in controllers?

**Answer:**

**Bad (200 lines in controller):**

```js
router.get("/users/:id", async (req, res) => {
  // Validation logic (20 lines)
  // Database query (10 lines)
  // Business rules (50 lines)
  // Email sending (30 lines)
  // Logging (10 lines)
  // Response formatting (20 lines)
});
```

**Good (separation of concerns):**

```js
// Controller (10 lines)
router.get("/users/:id", async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Service (business logic)
async function getUserById(id) {
  await validateUserAccess(id);
  const user = await userRepository.findById(id);
  if (user.isDeleted) throw new AppError("User not found", 404);
  await auditLogService.logAccess(id);
  return sanitizeUser(user);
}
```

**Benefits:** Testable, reusable, maintainable, and you can change databases without touching business logic.

---

## The Master Scenario

### Q22: Design a complete authentication API end-to-end, including security considerations.

**Answer:**

**Registration Endpoint (`POST /auth/register`):**

- Validate email format + password strength (min 8 chars, mix of cases/numbers/symbols)
- Check if user already exists
- Hash password with bcrypt (salt rounds 12)
- Store user in DB with default role "user"
- Return 201 Created (no password in response)

**Login Endpoint (`POST /auth/login`):**

- Rate limit: 5 attempts per 15 minutes (prevent brute force)
- Find user by email
- Compare password with bcrypt.compare()
- Generate access token (JWT, 15 min expiry, includes `{ userId, role }`)
- Generate refresh token (random string, store hash in DB)
- Set access token as HttpOnly, Secure, SameSite=Strict cookie
- Return refresh token in response body (or separate cookie)

**Refresh Endpoint (`POST /auth/refresh`):**

- Receive refresh token
- Verify it exists in DB and not expired
- Generate new access token
- Return via cookie or body

**Logout Endpoint (`POST /auth/logout`):**

- Delete refresh token from DB
- Clear access cookie
- (Optional) Add access token to blacklist Redis set until expiry

**Protected Route Example (`GET /users/me`):**

```js
router.get("/users/me", authMiddleware, async (req, res) => {
  res.json(await userService.getUserById(req.user.userId));
});
```

**Auth Middleware:**

```js
async function authMiddleware(req, res, next) {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error();

    const decoded = jwt.verify(token, JWT_SECRET);

    // Optional: Check blacklist (Redis)
    if (await redisClient.sismember("token:blacklist", token))
      throw new Error();

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
```

**Security features included:**

- Password hashing (bcrypt)
- Rate limiting on login
- HttpOnly cookies (XSS protection)
- SameSite=Strict (CSRF protection)
- Refresh token rotation (optional: invalidate old on refresh)
- Token blacklisting for logout
- HTTPS in production
