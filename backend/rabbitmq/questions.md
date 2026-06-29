# 1. What is RabbitMQ and why would you use it?

RabbitMQ is a message broker.

It allows different parts of a system to communicate asynchronously.

Without RabbitMQ:

User uploads image
↓
API receives request
↓
Generate thumbnails (5 seconds)
↓
Return response

The user waits.

With RabbitMQ:

User uploads image
↓
API saves image
↓
Send "process-image" message
↓
Return response immediately

Background worker:
↓
Consumes message
↓
Generates thumbnails

Benefits:

- Faster user responses
- Decoupled services
- Better scalability
- Ability to retry failed jobs

---

# 2. Explain Producer, Queue, and Consumer.

Producer:

Creates messages and sends them to RabbitMQ.

Example:

Image service sends:

{
"imageId": 123,
"type": "generate-thumbnail"
}

Queue:

Stores messages until they are processed.

Consumer:

Worker that receives messages and performs the task.

Flow:

Producer
↓
RabbitMQ Queue
↓
Consumer

---

# 3. Why not just call another API directly?

Direct API:

Service A
↓
HTTP request
↓
Service B

Problems:

- A waits for B
- If B is down, A fails
- Traffic spikes affect both services

RabbitMQ:

Service A
↓
Message Queue
↓
Service B

Benefits:

- Services are decoupled
- Consumers can process later
- Better handling of traffic spikes

---

# 4. What kinds of tasks should use RabbitMQ?

Good candidates:

- Sending emails
- Image processing
- PDF generation
- Notifications
- Video processing
- Data synchronization
- Third-party API integrations

Bad candidates:

- Operations requiring immediate response

Example:

User logs in → check password

This should happen synchronously.

---

# 5. What happens if the consumer crashes while processing a message?

This is a very common interview question.

Solution:

Acknowledgements (ACKs).

Bad:

Consumer receives message
↓
RabbitMQ deletes it immediately
↓
Consumer crashes
↓
Message is lost

Good:

Consumer receives message
↓
Processes it
↓
Sends ACK
↓
RabbitMQ removes message

If the consumer crashes before ACK:

RabbitMQ can deliver the message again.

---

# 6. What happens if a message fails?

Example:

Generate PDF fails because a third-party API is down.

Common strategies:

Retry:

Message fails
↓
Wait
↓
Retry

Dead Letter Queue (DLQ):

After maximum retries:

Message
↓
DLQ

Developers can inspect:

- Why it failed
- Whether it should be replayed

---

# 7. Can a message be processed more than once?

Yes.

RabbitMQ usually provides **at-least-once delivery**.

Example:

Consumer processes payment
↓
Payment succeeds
↓
Consumer crashes before ACK
↓
RabbitMQ sends the message again

The same message may execute twice.

---

# 8. How do you prevent duplicate processing?

This is called idempotency.

An operation is idempotent if running it multiple times produces the same result.

Example:

Bad:

Message:
"Add $100 to account"

Processing twice:

$100 → $200

Better:

Transaction ID:

payment_123

Before processing:

Check if payment_123 already exists.

If yes:

Ignore it.

Common approaches:

- Unique database constraints
- Idempotency keys
- Tracking processed message IDs

---

# 9. How do you scale RabbitMQ consumers?

Example:

One worker:

Queue
↓
Worker A

High traffic:

Queue
↓
Worker A
Worker B
Worker C

RabbitMQ distributes messages between consumers.

Benefits:

- More throughput
- Handle spikes

---

# 10. What if messages arrive faster than consumers can process them?

This is called back pressure.

The queue grows.

Solutions:

- Add more consumers
- Optimize the processing job
- Increase consumer resources
- Use message priorities (if appropriate)

---

# 11. What information should be inside a message?

Good:

Small, necessary information.

Example:

{
"imageId": 123,
"userId": 456
}

Consumer:

Fetches full image data from the database.

Avoid:

Sending a 10MB image in the message.

Why?

- Larger messages use more memory
- Slower transfer
- Harder retries

---

# 12. What is an Exchange?

RabbitMQ has an extra layer.

Simple view:

Producer
↓
Queue
↓
Consumer

Actual RabbitMQ:

Producer
↓
Exchange
↓
Queue
↓
Consumer

The exchange decides where messages go.

Common types:

Direct:
Route by exact key.

Example:
"email.created" → Email queue

Fanout:
Send to every queue.

Example:
User created → Analytics + Email + Logging

Topic:
Route using patterns.

Example:
user.\*

For interviews, knowing the idea is enough.

---

# 13. How do you make messages survive a server restart?

Use durability.

Queue:

Durable queue

Message:

Persistent message

Otherwise:

RabbitMQ restart
↓
Messages disappear

---

# 14. RabbitMQ vs Redis as a queue

RabbitMQ:

- Built specifically for messaging
- Better routing
- ACKs and retries
- Dead-letter queues
- Strong reliability

Redis:

- Very fast
- Simpler
- Good for lightweight jobs and temporary queues

Choose RabbitMQ when reliability matters.

---

# 15. Explain a RabbitMQ feature from your own experience

Strong answer:

"We used RabbitMQ to move long-running tasks out of the HTTP request cycle. Instead of blocking the user request, the API would publish a message containing the necessary identifiers, and background workers consumed the message and performed the heavy processing.

This improved response times, allowed retries for failures, and let us scale workers independently from the API."

---

# 16. Topics that separate Mid from Senior

Mid-level understands:

- Producers and consumers
- Async processing
- ACKs
- Retries
- DLQs
- Scaling consumers

More senior discussions:

- Exactly-once vs at-least-once delivery
- Idempotency
- Message ordering trade-offs
- Exchange design
- Monitoring queue health
- Throughput and back pressure

For your interviews, confidently knowing the mid-level topics is enough.
