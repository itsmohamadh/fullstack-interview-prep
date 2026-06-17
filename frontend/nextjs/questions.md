## Params and SearchParams

While page.tsx has access to both params and searchParams, layout.tsx only has access to params

#### Server Component

```javascript
export default async function NewsArticle({
params, searchParams,
｝：｛
params: Promise<t articleld: string }>;
searchParams: Promise<{ lang?: "en" | "es" | "fr" }>;
｝）
const { articleld} = await params;
const { lang = "en" } = await searchParams;
```

#### Client Component

```javascript
import { use } from "react" ;

export default function NewsArticle({
params,
searchParams,
｝：｛
params: Promise<t articleld: string }>;
searchParams: Promise<{ lang?: "en" | "es" | "fr" }>;
}) {
const { articleld } = use (params) ;
const { lang = "en" } =use(searchParams);
```


## Template vs Layout
While navigating Layout preserves the state , but template creates a new ,
template can be used for page transitions etc...



Here are some of the most common **mid-to-senior level Next.js practical interview questions** that companies ask in real interviews — especially for SaaS, dashboard, full-stack, and production-scale applications.

I grouped them by topic so you can study systematically.

---

# Next.js Architecture & Fundamentals

### 1. What is the difference between CSR, SSR, SSG, and ISR in Next.js?

You should explain:

* Client-Side Rendering
* Server-Side Rendering
* Static Site Generation
* Incremental Static Regeneration

Also discuss:

* performance
* SEO
* caching
* use cases

---

### 2. When would you choose SSR over SSG?

Interviewers want practical thinking.

Example:

* Dashboard → CSR/SSR
* Marketing page → SSG
* News/blog → ISR

---

### 3. Explain how routing works in Next.js App Router.

Topics:

* nested layouts
* route groups
* dynamic routes
* parallel routes
* intercepting routes

---

### 4. What are Server Components in Next.js?

Important senior-level topic.

You should explain:

* why they exist
* how they reduce bundle size
* when to use client components
* limitations of server components

---

### 5. What is the difference between:

* `"use client"`
* Server Components
* Client Components

Very common.

---

# Data Fetching

### 6. Explain different ways to fetch data in Next.js.

Examples:

* fetch in Server Components
* Route Handlers
* Server Actions
* React Query
* SWR

---

### 7. How does caching work in Next.js App Router?

You should know:

* default fetch caching
* `cache: "no-store"`
* `revalidate`
* dynamic rendering
* static rendering

---

### 8. What is ISR and how does revalidation work?

You should explain:

* time-based revalidation
* on-demand revalidation
* stale content flow

---

### 9. When would you use React Query in Next.js?

Strong answer:

* real-time data
* mutations
* optimistic updates
* client-side synchronization

---

# Performance Optimization

### 10. How do you optimize a slow Next.js application?

Excellent senior question.

Mention:

* code splitting
* dynamic imports
* image optimization
* reducing client components
* memoization
* caching
* database optimization
* edge rendering

---

### 11. What problems does Server Components solve?

Discuss:

* bundle size
* waterfall fetching
* performance

---

### 12. Explain dynamic imports in Next.js.

Example:

* charts
* editors
* heavy components

---

### 13. How does the Next.js Image component improve performance?

Discuss:

* lazy loading
* responsive images
* modern formats
* resizing

Entity: Next.js

---

# Authentication & Security

### 14. How would you implement authentication in Next.js?

You should know:

* JWT
* cookies
* session handling
* middleware
* protected routes

---

### 15. What is NextAuth/Auth.js and when would you use it?

Explain:

* OAuth
* credentials provider
* session management

Entity: Auth.js

---

### 16. How do you protect API routes?

Topics:

* middleware
* validation
* rate limiting
* authorization

---

### 17. What security issues should you consider in Next.js?

Examples:

* XSS
* CSRF
* leaking secrets
* server/client boundaries
* environment variables

---

# Backend & Full-Stack Questions

### 18. Explain Route Handlers in Next.js.

Explain:

* GET/POST
* REST APIs
* server-side logic

---

### 19. Would you build backend APIs inside Next.js or separate them?

This is a very common senior discussion question.

Tradeoffs:

* scalability
* deployment
* microservices
* team structure

---

### 20. How would you upload files in Next.js?

Topics:

* multipart forms
* S3
* presigned URLs
* server actions

Entity: Amazon Web Services

---

### 21. How do Server Actions work?

Very important modern Next.js topic.

Explain:

* form handling
* server mutations
* reduced API boilerplate
* security

---

# State Management

### 22. When do you use:

* Context API
* Zustand
* Redux
* React Query

Since you already study Zustand, expect this.

Entity: Zustand

---

### 23. How do you manage global state in large Next.js applications?

Discuss:

* server state vs client state
* UI state
* auth state

---

# Database & ORM

### 24. How would you structure a production Next.js full-stack app?

Great senior-level architecture question.

Mention:

* folders
* services
* repositories
* validation
* reusable layers

---

### 25. Have you used Prisma with Next.js?

Topics:

* migrations
* schema
* relations
* connection pooling

Entity: Prisma

---

### 26. What problems happen with database connections in serverless environments?

Very senior-level practical question.

Discuss:

* connection exhaustion
* pooling
* Prisma Data Proxy

---

# Deployment & Production

### 27. How does deployment work in Next.js?

Discuss:

* build step
* SSR hosting
* edge/runtime
* CDN

---

### 28. What is Edge Runtime in Next.js?

You should explain:

* low latency
* middleware
* limitations

---

### 29. How do you monitor production issues in Next.js?

Examples:

* logging
* Sentry
* analytics
* performance monitoring

Entity: Sentry

---

# Practical Scenario Questions

These are the MOST important for senior interviews.

---

### 30. A page is loading slowly. How would you debug it?

Interviewers want your process.

Mention:

* network tab
* bundle analyzer
* React profiler
* database queries
* server timing

---

### 31. Users complain about stale data. How would you fix it?

Discuss:

* caching
* revalidation
* invalidation strategies

---

### 32. [Your Next.js app has hydration errors. What causes them?](./hydration-errors.md)

Common causes:

* browser-only APIs
* random values
* time/date mismatch
* conditional rendering

---

### 33. How would you build a scalable admin dashboard in Next.js?

Great for your goals.

Mention:

* RBAC
* reusable tables/forms
* modular architecture
* API layer
* caching

---

### 34. How would you implement optimistic UI updates?

Very common with React Query or Server Actions.

---

### 35. How would you handle real-time features in Next.js?

Examples:

* WebSockets
* Pusher
* Supabase realtime

Entity: Supabase

---

# Senior-Level Discussion Questions

### 36. What do you dislike about Next.js?

Senior interviews LOVE this.

You can discuss:

* framework complexity
* caching confusion
* server/client mental model

---

### 37. What architectural mistakes have you made in Next.js projects?

Very powerful if answered honestly.

---

### 38. How would you improve an existing messy Next.js codebase?

Discuss:

* folder structure
* shared components
* performance
* testing
* typing

---

### 39. Explain a challenging bug you solved in a Next.js project.

Prepare a STAR-format answer.

---

### 40. If you were starting a SaaS product today, how would you structure the frontend architecture?

Extremely common for senior/full-stack roles.

---

# BONUS — Things Mid/Senior Developers MUST Know

You should be comfortable discussing:

* TypeScript
* Authentication
* Authorization
* Middleware
* Caching
* Server Components
* SEO
* Web Performance
* CI/CD
* Docker basics
* Testing
* Monitoring
* API design
* Database optimization

---

For deep preparation, focus heavily on:

1. App Router
2. Server Components
3. Caching/Revalidation
4. Authentication
5. Production architecture
6. Performance optimization
7. Real project tradeoffs

Those separate junior from mid/senior developers.
