# 1️⃣ [Cookies vs Local Storage vs Session Storage](https://www.youtube.com/watch?v=GihQAC1I39Q)

This is probably the most commonly asked browser-storage question.

---

## Cookies

Small pieces of data stored by the browser.

```http
Set-Cookie: token=abc123
```

Automatically sent with every matching request.

```http
Cookie: token=abc123
```

Typical uses:

- authentication
- sessions
- CSRF protection
- preferences

---

### Pros

- automatically included in requests
- can be HttpOnly
- can be Secure

---

### Cons

- small size (~4KB)
- sent on every request

---

## Local Storage

```js
localStorage.setItem("theme", "dark");
```

Persists until explicitly removed.

Typical uses:

- UI preferences
- cached non-sensitive data

---

### Pros

- larger storage (~5-10MB)
- simple API

---

### Cons

- accessible by JavaScript
- vulnerable to XSS

---

## Session Storage

```js
sessionStorage.setItem("step", "2");
```

Cleared when the tab closes.

Typical uses:

- multi-step forms
- temporary UI state

---

### Good interview summary

> Cookies are automatically sent with requests and are commonly used for authentication. Local storage persists across browser sessions and is useful for client-side data, while session storage lasts only for a single tab session.

---

# 2️⃣ [Sessions vs JWT Authentication](https://www.youtube.com/watch?v=UBUNrFtufWo)

Extremely common.

---

## Session-based auth

User logs in.

Server creates:

```txt
sessionId = xyz
```

Stored in database or Redis.

Browser receives:

```txt
cookie -> sessionId
```

Future requests:

```txt
Cookie -> sessionId
```

Server looks up session.

---

### Pros

- easy logout
- easy revocation
- very secure

---

### Cons

- requires server-side storage

---

## JWT Authentication

Server creates:

```txt
header.payload.signature
```

Example:

```txt
eyJhb...
```

Stored in cookie or client storage.

Server validates signature.

---

### Pros

- stateless
- scales easily

---

### Cons

- difficult revocation
- larger payloads

---

### Good interview summary

> Sessions store user state on the server and are easier to revoke. JWTs store claims inside signed tokens and enable stateless authentication but introduce token invalidation challenges.

---

# 3️⃣ [CORS](https://www.youtube.com/watch?v=4KHiSt0oLJ0)

One of the most frequently asked web questions.

---

Browser security policy.

Prevents:

```txt
evil.com
```

from reading data from:

```txt
bank.com
```

without permission.

---

Example:

Frontend:

```txt
localhost:3000
```

Backend:

```txt
api.example.com
```

Different origins.

Browser blocks request unless backend allows it.

---

Server response:

```http
Access-Control-Allow-Origin:
https://app.example.com
```

---

## Preflight Request

Before some requests:

```http
OPTIONS
```

Browser asks:

```txt
Can I send this request?
```

Server responds with allowed methods/headers.

---

### Good interview summary

> CORS is a browser security mechanism that controls cross-origin requests. The server explicitly decides which origins, methods, and headers are allowed.

---

# 4️⃣ Same-Origin Policy

Frequently asked together with CORS.

Origin consists of:

```txt
protocol + domain + port
```

Example:

```txt
https://app.com
```

Different origin:

```txt
http://app.com
```

Different protocol.

---

### Purpose

Prevents websites from accessing data belonging to another origin.

CORS is effectively a controlled relaxation of this policy.

---

### Good interview summary

> The Same-Origin Policy prevents one origin from accessing another origin's resources. CORS allows exceptions through explicit server configuration.

---

# 5️⃣ [HTTP vs HTTPS](https://www.youtube.com/watch?v=j9QmMEWmcfo)

Very common.

---

## HTTP

Plain text.

```txt
Browser <-> Server
```

Can be intercepted.

---

## HTTPS

HTTP over TLS.

Provides:

- encryption
- integrity
- authentication

---

Benefits:

- prevents eavesdropping
- prevents tampering
- required by many browser APIs

---

### Good interview summary

> HTTPS encrypts communication using TLS, protecting data confidentiality and integrity while verifying server identity through certificates.

---

# 6️⃣ [HTTP Methods](https://www.youtube.com/watch?v=AlkDbnbv7dk)

Asked constantly.

---

## GET

Retrieve data.

```http
GET /users
```

Should not modify state.

---

## POST

Create resource.

```http
POST /users
```

---

## PUT

Replace entire resource.

```http
PUT /users/1
```

---

## PATCH

Partial update.

```http
PATCH /users/1
```

---

## DELETE

Remove resource.

```http
DELETE /users/1
```

---

### Good interview summary

> GET retrieves data, POST creates resources, PUT replaces resources, PATCH partially updates resources, and DELETE removes resources.

---

# 7️⃣ HTTP Status Codes

Almost guaranteed.

---

## 2xx

Success

```txt
200 OK
201 Created
204 No Content
```

---

## 3xx

Redirects

```txt
301
302
304
```

---

## 4xx

Client errors

```txt
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
429 Too Many Requests
```

---

## 5xx

Server errors

```txt
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
```

---

### Common interview question

Difference between:

```txt
401 vs 403
```

401:

```txt
Not authenticated
```

403:

```txt
Authenticated but not allowed
```

---

### Good interview summary

> 4xx errors indicate problems with the client request, while 5xx errors indicate server-side failures. A common distinction is that 401 means authentication is required, whereas 403 means access is denied despite authentication.

---

# 8️⃣ Caching

Very common for senior roles.

---

Browser requests:

```txt
GET /logo.png
```

Server responds:

```http
Cache-Control: max-age=3600
```

Browser stores response.

Future requests may skip network calls.

---

Common headers:

```http
Cache-Control
ETag
Last-Modified
```

---

Benefits:

- faster pages
- reduced bandwidth
- lower server load

---

### Good interview summary

> Caching improves performance by reusing previously fetched resources. Common mechanisms include Cache-Control, ETags, and Last-Modified validation.

---

# 9️⃣ [Core Web Vitals](<(https://www.youtube.com/watch?v=0fONene3OIA)>)

Extremely common in React/Next.js interviews.

---

## LCP

Largest Contentful Paint:

The amount of time it takes till the largest content on your page loads

Measures:

```txt
loading performance
```

Target:

```txt
< 2.5s
```

---

## INP

Interaction to Next Paint

The amount of time it takes for your website to become interactive

Measures:

```txt
responsiveness
```

Target:

```txt
< 200ms
```

---

## CLS

Cumulative Layout Shift

How much your elements move around the screen while loading

Measures:

```txt
visual stability
```

Target:

```txt
< 0.1
```

---

### How to improve

LCP:

- optimize images
- preload important assets
- SSR

INP:

- reduce JS work (bundle size)
- debounce expensive handlers

CLS:

- define image dimensions
- avoid layout jumps

---

### Good interview summary

> Core Web Vitals measure user experience through loading performance (LCP), responsiveness (INP), and visual stability (CLS). They are important for both UX and SEO.

---

# 🔟 [CSR vs SSR vs SSG](https://www.youtube.com/watch?v=mWytwmxLKmo)

Massively common for React and Next.js.

---

## CSR

Client-Side Rendering

Browser receives:

```html
<div id="root"></div>
```

JavaScript builds page.

---

Pros:

- rich interactivity

Cons:

- slower first load
- SEO challenges

---

## SSR

Server-Side Rendering

Server returns:

```html
<h1>Products</h1>
```

Already rendered.

---

Pros:

- SEO
- fast first paint

Cons:

- server cost

---

## SSG

Static Site Generation

Generated during build.

```txt
npm run build
```

---

Pros:

- extremely fast
- CDN-friendly

Cons:

- content can become stale

---

### Good interview summary

> CSR renders in the browser, SSR renders per request on the server, and SSG pre-renders pages at build time. The choice depends on SEO, performance, freshness requirements, and infrastructure tradeoffs.

---

# If you're interviewing this week, prioritize these first

**Tier 1 (shows up constantly)**

1. Cookies vs LocalStorage vs SessionStorage
2. Sessions vs JWT
3. CORS
4. HTTP methods
5. HTTP status codes
6. HTTPS
7. CSR vs SSR vs SSG

**Tier 2 (very common)**

8. Caching
9. Core Web Vitals
10. Same-Origin Policy

Master these 10 topics and you'll cover the majority of "web fundamentals" questions asked in startup and growth-stage full stack interviews. The next highest ROI category after this would be **REST APIs, API design, and backend architecture**, which arguably appears even more often than some of the web topics above.
