

```
Questions based on my resume: mohamadh.xyz/resume.md

1. Explain the dealership platform you worked on
2. What was your role in the team?
3. What was the architecture of the system?
4. How was the backend deployed?
5. How did your services communicate?
6. How did you structure your database?
7. Explain a feature you built end-to-end
8. Explain a difficult production issue you solved
9. How did you handle production support?
10. Explain a feature where you worked across frontend and backend
11. How did you collaborate with senior engineers?
```

---

# 1. Explain the Project You Worked On

This is the most important question.

Strong answer:

"I worked on a large used car dealership CMS platform serving over 1,000 dealerships.

Each dealership had an admin panel where they managed inventory, sales workflows, customers, financing, documents, and third-party marketplace integrations.

Every dealership also had its own public website built with Next.js, where customers could browse inventory and contact the dealership.

A typical dealership managed around 300–700 vehicles, with larger ones having over 1,000, so the system handled hundreds of thousands of vehicle listings.

I started as a frontend developer and gradually moved into a frontend-focused full-stack role. I built features end-to-end using React, Node.js, and Sequelize, including database models, APIs, frontend interfaces, and production debugging."

---

## Follow-up: What was the scale of the system?

Answer:

* 1,000+ dealerships
* Hundreds of thousands of vehicles
* Each dealership had multiple employee roles
* Hundreds of public websites with traffic from search engines
* Many third-party marketplace integrations

---

## Follow-up: What made this project technically challenging?

Good points:

* Large inventory datasets
* Maintaining fast website performance
* Complex filtering and search
* Synchronizing inventory with external marketplaces
* Handling image processing and document generation
* Managing different user permissions
* Supporting many independent dealership websites

---

# 2. What Was Your Role?

Answer:

"I was a frontend-focused full-stack engineer.

Initially, my work was primarily React and Next.js, converting Figma designs into production interfaces.

Over time, I started working across the stack. I built complete features involving frontend pages, API endpoints, business logic, database tables, and integrations with existing services.

I was comfortable owning a feature from the UI down to the backend implementation, while larger architectural decisions and infrastructure were usually designed collaboratively with senior engineers."

---

## Follow-up: Did you design the whole system?

Good answer:

"No. The platform already had an established architecture with services like Redis caching, RabbitMQ workers, image services, and marketplace synchronization.

My contribution was building features on top of that architecture, extending existing systems, and understanding how those components interacted."

---

# 3. Explain the Architecture

High-level:

```
                    Next.js Websites
                           |
                      REST APIs
                           |
                    Node.js Services
                           |
      -------------------------------------
      |              |                    |
 PostgreSQL       Redis               RabbitMQ
      |                                   |
      |                          ----------------
      |                          |              |
      |                    Email Worker   Image Worker
      |
      |
     AWS S3
```

---

## Follow-up: Was it a monolith or microservices?

Answer:

"It was closer to a service-oriented architecture.

We had multiple Node applications, including the main API, chat functionality, image processing, email services, and scheduled integration jobs.

They were independently deployed and communicated through APIs and queues where appropriate."

---

## Follow-up: Why not keep everything in one API?

Because different workloads have different requirements.

Examples:

Image processing:

* CPU-intensive
* Can take several seconds
* Does not need an immediate response

Email:

* Depends on external providers
* Can fail temporarily
* Needs retries

Moving them to workers keeps the API fast and more reliable.

---

# 4. How Was Production Deployed?

Answer:

"Our production environment used Docker containers running on a server. We used GitHub Actions as our CI/CD pipeline to build and deploy updates.

Multiple services such as the API, workers, Redis, RabbitMQ, and supporting services were containerized."

---

## Follow-up: You mentioned multiple Node instances. Why?

Node.js runs JavaScript in a single thread.

If a server has multiple CPU cores, a single Node process cannot fully utilize all of them.

Running multiple instances allows the application to handle more concurrent requests.

Example:

```
               Load Balancer
                     |
        ----------------------------
        |              |            |
      Node 1        Node 2       Node 3
```

---

## Follow-up: The backend went down under load. How would you improve it?

Good answer:

"The first step would be identifying the bottleneck through monitoring.

If the issue was CPU or memory, vertical scaling to a larger server might be the fastest solution.

For the API layer, we could run additional instances behind a load balancer.

We could also optimize database queries, improve caching strategies, and separate workloads that should not run on the main API."

---

# 5. How Did You Work With Existing Infrastructure?

This is a very important interview question for your situation.

Answer:

"I didn't design every infrastructure component from scratch, but I regularly worked with them.

For example, when implementing inventory-related features, I worked with Redis caching behavior and cache invalidation.

For image workflows, I integrated with the existing image processing pipeline that used RabbitMQ workers and S3 storage.

For frontend development, I worked with APIs that interacted with these systems and understood the data flow end-to-end."

---

# 6. Explain a Feature You Owned End-to-End

Good examples:

### Car rental feature

"I implemented a car rental workflow from the database to the frontend.

I designed the required database tables and relationships, implemented API endpoints and business logic in Node.js, and built the React interfaces used by dealership employees.

This included validation, state management, API communication, and testing the complete workflow."

---

### Bill of sale feature

"I worked on document workflows where different regions had different business rules.

Some documents were generated completely from our system, while others used templates with placeholders that could be filled dynamically.

I implemented the data flow from the UI to the backend generation process and ensured users could generate the correct documents based on their dealership configuration."

---

# 7. Tell Me About a Difficult Problem You Solved

A realistic answer:

"One recurring challenge was debugging production issues because I worked night support aligned with Canadian business hours.

Many issues were difficult because they involved understanding the complete flow between the frontend, API, database, and external services.

My approach was to reproduce the issue, inspect logs, check API requests and database data, isolate where the failure occurred, and implement a fix without affecting existing dealership workflows."



---

# 8. Explain Your Database Design

## Why did you have separate Vehicle and DealershipVehicle tables?

Answer:

"The same physical vehicle could move between dealerships over time, so storing all vehicle information in a single dealership table would create duplication.

We separated static vehicle data such as VIN, make, model, year, and body type into the Vehicle table.

DealershipVehicle stored dealership-specific information such as price, status, description, featured state, website visibility, and dealership relationship."

---

## What were the benefits of this design?

* Reduced duplicated data
* Better normalization
* Easier updates to vehicle information
* Supported vehicle history across dealerships

---

## What relationships did you have?

Examples:

```
Dealership
     |
     |
DealershipVehicle
     |
     |
Vehicle
```

Other relationships:

```
User
 |
Role
 |
Permissions
```

```
Dealership
 |
Users
```

---

# 9. Explain Search and Filtering

## How did search work in your admin panel?

Answer:

"The admin panel had a different use case from public websites.

A dealership usually had a few hundred vehicles, so we loaded inventory data once and used client-side filtering and searching using React Table.

This provided instant filtering without additional API requests."

---

## Why not use server-side filtering in the admin panel?

Because:

* Data size was manageable
* Better user experience
* Less backend traffic

If the data grew significantly, I would consider moving filtering server-side.

---

# 10. Explain Website Search

## Why was website search server-side?

Because public traffic was much higher and we did not want to send hundreds of vehicle records to every visitor.

Flow:

```
User applies filters
        |
Frontend sends request
        |
API builds SQL query
        |
Database returns paginated results
        |
Frontend displays data
```

---

## What filters did you support?

Examples:

* Make
* Model
* Year
* Price range
* Mileage
* Body type
* Color
* Status

---

## How did pagination work?

We used offset pagination.

Example:

```
LIMIT 20 OFFSET 40
```

Meaning:

* Skip 40 records
* Return the next 20

---

## Why not cursor pagination?

Cursor pagination performs better for very large datasets.

Example:

```
WHERE id > 5000
LIMIT 20
```

But for dealerships with hundreds or low thousands of vehicles, offset pagination was simple and sufficient.

---

# 11. What Database Optimizations Did You Use?

Indexes.

Examples:

```
dealership_id
VIN
status
price
created_at
```

Composite indexes could also be useful:

```
(dealership_id, status)

(dealership_id, price)
```

because those fields were commonly queried together.

---

## How would you find a slow query?

Tools:

* Database logs
* EXPLAIN / EXPLAIN ANALYZE in PostgreSQL
* Monitoring tools

You would look for:

* Full table scans
* Missing indexes
* Expensive joins

---

# 12. Explain Redis in Your Project

Answer:

"We used Redis to cache dealership inventory because it was frequently requested but did not change constantly.

The API first checked Redis. On a cache miss, it queried PostgreSQL, stored the result in Redis with a TTL, and returned it."

---

## What did your Redis keys look like?

Example:

```
inventory:dealership:123
```

---

## What happened when inventory changed?

We invalidated the cache.

Flow:

```
Update database
       |
Delete Redis key
       |
Next request rebuilds cache
```

---

## Why not update Redis directly?

You can, but invalidation is simpler and reduces the chance of the cache becoming inconsistent with the database.

---

# 13. Explain RabbitMQ in Your Project

## Why did you use RabbitMQ?

Because some tasks were expensive or depended on external systems.

Examples:

* Image processing
* Sending emails
* Marketplace synchronization

---

## Explain image processing.

Flow:

```
User uploads image
       |
API stores metadata
       |
Create RabbitMQ job
       |
Image worker consumes job
       |
Resize image
       |
Generate thumbnails
       |
Apply overlays
       |
Upload files to S3
       |
Update database
```

---

## What if processing failed?

Common strategy:

* Retry several times
* Log the error
* Mark the operation as failed
* Notify the user if necessary

---

# 14. Explain S3

## Why use S3 instead of PostgreSQL?

Databases are not designed for storing large files.

S3 provides:

* Cheap storage
* Scalability
* Durability
* Fast file delivery

---

## What did the database store?

Metadata:

```
Image
-----
id
vehicle_id
s3_key
url
type
status
```

The actual image lived in S3.

---

# 15. Explain Marketplace Integrations

## How did they work?

Each dealership could enable different integrations.

Examples:

* Facebook Marketplace
* CarGurus
* Kijiji

A scheduled process would:

```
Find enabled dealerships
          |
Generate synchronization jobs
          |
Transform inventory format
          |
Send data through API/SFTP
          |
Store success or failure status
```

---

## Why use queues for synchronization?

Because:

* Thousands of dealerships could sync
* External systems could be slow
* Failures needed retries

---

# 16. Explain WebSocket Chat

## How did your chat architecture work?

A shared chat package was used by both the dealership websites and the admin panel.

Flow:

```
Website visitor opens chat
          |
Socket connection created
          |
User assigned to dealership room
          |
Admin dashboard receives event
          |
Messages flow in real time
```

---

## How did you know which dealership received the message?

The website knew its dealership ID.

The socket connection joined a room such as:

```
dealership:123
```

Admins listening to that room received messages.

---

## Where was chat history stored?

Typically in PostgreSQL:

```
Conversation
    |
Messages
```

---

## What if no admin was online?

The message would still be stored.

An admin could view it later when they logged in.

---

# 17. Explain Authentication

## How did login work?

```
User enters email/password
          |
Backend verifies bcrypt hash
          |
Generate JWT
          |
Send token as HTTP-only cookie
          |
Future requests include cookie
```

---

## Why use HTTP-only cookies?

Because JavaScript cannot access them, reducing the impact of XSS attacks.

---

## What is inside a JWT?

Typically:

```
user_id
role
expiration time
```

---

## How did permissions work?

Example:

```
Admin
- Manage users
- Manage inventory
- Manage settings

Salesperson
- Manage customers
- View inventory

Accountant
- Access financial data
```

The backend checked permissions before executing protected actions.

---

# 18. Explain React Query

## Why did you use React Query?

To manage server state.

It handles:

* Data fetching
* Caching
* Loading states
* Error states
* Refetching

---

## What happened after a mutation?

Example:

Update vehicle.

Flow:

```
PUT /vehicle/123
        |
Success
        |
Invalidate query
        |
Refetch fresh data
```

Example:

```
queryClient.invalidateQueries(["inventory"])
```

---

## What are optimistic updates?

Updating the UI before the server confirms the change.

Example:

User changes vehicle status:

```
Click "Sold"
       |
UI immediately shows Sold
       |
API request happens
       |
Success -> keep change
Failure -> rollback
```

---

# 19. Why React Query and Redux Together?

Redux handled client-side application state.

Examples:

* UI state
* Modals
* Complex local workflows
* Shared frontend state

React Query handled server state.

Examples:

* Inventory
* Users
* Dealership data

---

# 20. Explain Next.js Websites

## Why use Next.js?

Benefits:

* Server-side rendering
* Better SEO
* Faster initial page loads
* Routing and optimization features

---

## How did websites know which dealership they belonged to?

The domain was mapped to a dealership.

Example:

```
www.abcdealer.com
        |
Request includes host header
        |
Backend finds dealership
        |
Returns dealership-specific data
```

---

## What performance improvements did you make?

Examples:

* Removed unused packages
* Removed unused components
* Reduced bundle size
* Used WebP images
* Optimized image loading
* Improved Lighthouse scores

---

## Would ISR have been a good choice?

Potentially, yes.

For pages that changed less frequently, ISR could reduce server load by serving cached generated pages and regenerating them periodically.

---

# 21. Explain PDF Generation

## What types of PDFs did you generate?

Two categories:

### Generated documents

The system created the entire PDF.

Example:

* Bill of sale with dealership information
* Vehicle details
* Pricing
* Signatures

---

### Template-based documents

The PDF already existed with placeholders.

The system filled dynamic fields.

---

## Was PDF generation synchronous or background?

Depends on the operation.

Small PDFs could be generated synchronously.

Large batches or expensive operations could be moved to a background worker.

---

## What is a background job?

Instead of:

```
Request
   |
Long operation
   |
Response
```

you do:

```
Request
   |
Create job
   |
Return immediately

Worker processes later
```

---

# 22. Explain a Production Issue You Solved

Strong answer:

"Because I worked night support aligned with Canadian business hours, I often investigated production issues.

My process was to reproduce the problem, inspect frontend behavior, check network requests, review backend logs, verify database data, isolate the root cause, and deploy a safe fix."

---

# 23. What Was Your Biggest Contribution?

Strong answer:

"I was primarily responsible for building product features end-to-end. My strongest area was the frontend architecture and user experience, but I was also comfortable working in the backend.

I built features involving React interfaces, API endpoints, database changes, authentication flows, document workflows, and real-time communication.

For larger infrastructure decisions like the overall queue architecture or caching strategy, I worked within systems established by the team and extended them when building new features."

---

# 24. What Did You Learn From This Project?

Good final interview answer:

"I learned how to work with a production system at scale. It taught me how frontend decisions affect backend performance, how to think about caching, asynchronous processing, database design, and how to debug issues across the entire stack."

