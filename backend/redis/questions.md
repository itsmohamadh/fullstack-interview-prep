# 1. What is Redis and Why Would You Use It?

Redis is an in-memory key-value database.

Because data lives in RAM, reads and writes are extremely fast (often microseconds).

Common use cases:

- Caching database queries
- Storing sessions
- Rate limiting
- Temporary data
- Real-time features

Example:

Without Redis:

Browser
  ↓
Backend
  ↓
PostgreSQL (every request)


With Redis:

Browser
  ↓
Backend
  ↓
Redis (cache hit)
  ↓
Database only on cache miss


---

# 2. Why Is Redis Faster Than PostgreSQL?

Redis is faster because:

- Data is stored in memory
- Simpler data model (key-value)
- No complex query planner or disk reads in the common path

PostgreSQL:

- Rich querying
- Joins
- ACID transactions
- Persistent storage


Redis:

- Extremely fast access
- Simple lookups
- Temporary or frequently accessed data


They solve different problems.

---

# 3. Explain a Cache Hit vs Cache Miss

Cache Hit:

Requested data exists in Redis.

Flow:

Request
 ↓
Redis
 ↓
Return data


Cache Miss:

Data is not in Redis.

Flow:

Request
 ↓
Redis (miss)
 ↓
Database
 ↓
Store in Redis
 ↓
Return response


This pattern is called cache-aside (lazy loading).

---

# 4. Explain the Cache-Aside Pattern

Most common caching strategy.

Flow:

Read:

1. Check Redis
2. If found → return it
3. If missing → query database
4. Store result in Redis
5. Return response


Example:

GET /cars/123

First request:

Redis: ❌
Database: ✅
Redis SET car:123


Second request:

Redis: ✅
Database: skipped


---

# 5. What Happens When Database Data Changes?

This is the famous cache invalidation problem.

Example:

Update car price:

PostgreSQL:
UPDATE cars SET price = 20000


Redis still has:

car:123 = {
  price: 18000
}


Solutions:

Option 1: Delete cache after update

Update DB
 ↓
DELETE Redis key
 ↓
Next request rebuilds cache


Option 2: Set TTL

Redis automatically removes stale data.


Tradeoff:

Short TTL:
- More accurate
- More database traffic


Long TTL:
- Better performance
- Higher chance of stale data


---

# 6. What Is TTL?

TTL = Time To Live.

It is an expiration time for a Redis key.


Example:

Cache dealership inventory for 5 minutes.

Redis:

car:123
expires in 300 seconds


After expiration Redis removes the key.

The next request fetches fresh data from PostgreSQL.

---

# 7. How Would You Choose a Good TTL?

There is no universal answer.

Depends on:

How often data changes.

Examples:

User profile:
5–30 minutes


Product inventory:
30 seconds–5 minutes


Country list:
Hours or days


Interviewers care about tradeoffs.

Ask:

"How fresh does the data need to be?"

---

# 8. What Redis Data Structures Should You Know?

For your level, know these:

String

Most common.

Examples:

user:123 → JSON data

---

Hash

Store fields inside an object.

Example:

user:123
name = John
role = admin


---

List

Ordered collection.

Examples:

Notifications
Queues


---

Set

Unique values.

Examples:

User permissions
Online users


---

Sorted Set

Values with scores.

Examples:

Leaderboards
Ranking systems

---

You do not need deep knowledge beyond common use cases.

---

# 9. Should You Cache Everything?

No.

Bad candidates say:

"Put everything in Redis."

Good candidates understand tradeoffs.

Do cache:

- Expensive database queries
- Frequently requested data
- Data that changes infrequently


Avoid caching:

- Highly dynamic data
- Data with low request frequency
- Sensitive information without proper consideration

---

# 10. What Problems Can Caching Create?

Common issues:

1. Stale data

Redis has old information.


2. Cache stampede

Many requests miss the cache simultaneously and overload the database.


Solutions:

- Randomized TTLs
- Locking strategies
- Background refresh


3. Increased complexity

You now have two sources of data.

---

# 11. Explain a Redis Caching Strategy You Implemented

This is very likely based on your resume.

Strong answer:

"In our dealership platform we had inventory data that was frequently requested but didn't change every second.

We used Redis as a cache layer between our API and PostgreSQL. The API first checked Redis. On a cache miss, it queried the database, stored the result with an expiration time, and returned the response.

When inventory changed, we invalidated relevant cache keys to prevent stale data."

---

# 12. How Do You Name Redis Keys?

Good naming prevents chaos.

Examples:

user:123

car:532

inventory:dealer:45

session:abc123


Avoid:

123

data1


Use namespaces and predictable patterns.

---

# 13. How Would You Implement Rate Limiting with Redis?

Store a counter.

Example:

login_attempts:user_123


Request arrives:

INCR counter


Set expiration:

EXPIRE 60 seconds


If count > 5:

Reject request


Why Redis?

Because counters are extremely fast and shared across multiple servers.

---

# 14. How Is Redis Useful in a Scaled Application?

Imagine:

API Server A
API Server B
API Server C


If each has memory cache:

Server A does not know what B has.


Redis provides a shared cache:

Server A
      \
Server B → Redis
      /
Server C


All instances read and write the same cache.

---

# 15. Redis Topics That Separate Mid from Senior


Mid-level knows:

- What Redis is
- Cache-aside pattern
- TTL
- Basic data structures
- Cache invalidation
- Rate limiting


More senior discussion:

- Cache stampede prevention
- Distributed locking
- Persistence options
- Eviction policies
- Replication and clustering


For your interview, knowing the mid-level topics confidently is enough.