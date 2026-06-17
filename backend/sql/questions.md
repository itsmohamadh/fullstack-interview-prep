# 1. SQL Execution Order (Very Common)

Question:
How does a SQL query execute?

```SQL
SELECT name, COUNT(_)
FROM users
WHERE active = true
GROUP BY name
HAVING COUNT(_) > 1
ORDER BY name;
```

Logical execution order:

1. FROM
2. WHERE
3. GROUP BY
4. HAVING
5. SELECT
6. ORDER BY
7. LIMIT

Why it matters:

Explains why you cannot use aggregate functions inside WHERE.

---

# 2. WHERE vs HAVING

Question:
What is the difference?

WHERE:
Filters rows BEFORE grouping.

Example:

SELECT \*
FROM orders
WHERE status = 'completed';

HAVING:
Filters groups AFTER aggregation.

Example:

```SQL
SELECT user_id, COUNT(_)
FROM orders
GROUP BY user_id
HAVING COUNT(_) > 10;
```

Shortcut:

WHERE = rows
HAVING = groups

---

# 3. JOINs (Must Know)

Question:
Explain INNER, LEFT, RIGHT, and FULL JOIN.

INNER JOIN:
Only matching rows.

LEFT JOIN:
All rows from left table + matches.

Example:

Users
id name
1 John
2 Sarah

Orders
user_id amount
1 100

LEFT JOIN result:

John 100
Sarah NULL

Common production usage:

"Give me all users, even those without orders."

---

# 4. Finding Duplicate Records

Question:
How do you find duplicate emails?

```SQL
SELECT email, COUNT(_)
FROM users
GROUP BY email
HAVING COUNT(_) > 1;
```

Real-world:

Finding bad data before adding a UNIQUE constraint.

---

# 5. Primary Key vs Foreign Key

Primary Key:
Uniquely identifies a row.

Example:
users.id

Foreign Key:
References another table.

Example:
orders.user_id -> users.id

Purpose:

Maintains referential integrity.

---

# 6. Database Normalization

Question:
Why do we normalize databases?

Benefits:

- Reduce duplication
- Avoid inconsistent data
- Easier updates

Example:

Bad:

orders:
id | customer_name | customer_address

Good:

customers:
id, name, address

orders:
id, customer_id

---

# 7. When Would You Denormalize?

Senior-level question.

Use denormalization when:

- Reads are much more frequent than writes
- JOINs become expensive
- Reporting/analytics queries need speed

Examples:

- Caching total order count on user table
- Materialized views
- Analytics tables

Tradeoff:

Faster reads, harder consistency.

---

# 8. Indexes (Extremely Common)

Question:
What is an index?

An additional data structure that allows faster lookups.

Good candidates:

```SQL
WHERE
JOIN
ORDER BY
```

Example:

```SQL
SELECT \*
FROM users
WHERE email = 'john@test.com';
```

Add:

INDEX(email)

Tradeoff:

Faster reads.
Slower inserts/updates.
More storage.

---

# 9. How Do You Debug a Slow Query?

Great senior question.

Steps:

1. Check execution plan (EXPLAIN)
2. Look for full table scans
3. Add appropriate indexes
4. Avoid SELECT \*
5. Reduce unnecessary joins
6. Add pagination

---

# 10. OFFSET Pagination vs Cursor Pagination

Very relevant for APIs.

OFFSET:

```SQL
SELECT \*
FROM posts
LIMIT 20 OFFSET 10000;
```

Problem:

Database still scans skipped rows.

Cursor:

```SQL
SELECT \*
FROM posts
WHERE id > 10000
LIMIT 20;
```

Benefits:

- Faster at scale
- Stable results

Common in social feeds.

---

# 11. Transactions & ACID

Question:
What is a transaction?

A group of operations that succeed or fail together.

Example:

Transfer money:

```SQL
BEGIN;

UPDATE accounts SET balance = balance - 100;

UPDATE accounts SET balance = balance + 100;

COMMIT;
```

ACID:

Atomicity:
All or nothing.

Consistency:
Valid data remains valid.

Isolation:
Concurrent transactions don't conflict.

Durability:
Committed data survives crashes.

---

# 12. DELETE vs TRUNCATE vs DROP

DELETE:
Remove rows.
Can use WHERE.
Can rollback.

TRUNCATE:
Remove all rows.
Faster.

DROP:
Deletes the entire table.

---

# 13. EXISTS vs IN

EXISTS:

Checks whether a matching row exists.

Good for large subqueries.

IN:

Compares against a list of values.

Good for small lists.

---

# 14. What Causes Wrong Query Results?

Senior debugging question.

Common reasons:

- Wrong JOIN condition
- Missing WHERE clause
- Duplicate rows from one-to-many joins
- Incorrect GROUP BY
- Wrong business assumptions

Approach:

Break the query into smaller pieces and validate each part.

---

# 15. Most Complex Query You've Written

Interviewers care about:

- Business requirement
- Your thought process
- Tradeoffs
- Debugging

Good answer from your experience:

"I built server-side search and filtering for large dealership inventories. The query had multiple filters, sorting options, pagination, and joins. I built it incrementally, tested edge cases, and optimized it with indexes where necessary."

---

# 16. SQL Injection

Bad:

SELECT \* FROM users WHERE email = '${email}'

Good:

Parameterized queries.

Example:

SELECT \* FROM users WHERE email = ?

ORMs like Drizzle and Sequelize handle this safely.

---

# 17. COUNT(\*) vs COUNT(column)

COUNT(\*):
Counts all rows.

COUNT(column):
Ignores NULL values.

---

# 18. GROUP BY

Question:
What does GROUP BY do?

It groups rows and allows aggregate calculations.

Example:

SELECT category, AVG(price)
FROM products
GROUP BY category;

---

# 19. Common API Database Design Scenario

Question:

Design a comments API.

Tables:

users

- id

posts

- id

comments

- id
- user_id
- post_id
- content
- created_at

Relationships:

User -> Many comments

Post -> Many comments

---

# 20. SQL Topics That Separate Mid from Senior

Mid-level knows:

- CRUD
- JOINs
- GROUP BY
- Basic indexes

Senior discusses:

- Index strategy
- Query plans
- Pagination tradeoffs
- Transactions
- Normalization vs denormalization
- Data consistency
- Performance bottlenecks
- Schema design
