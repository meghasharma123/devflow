# Backend

| Week   | Topics                                                                                   | Status              |
| ------ | ---------------------------------------------------------------------------------------- | ------------------- |
| Week 1 | Node.js, Express, middleware, routes, controllers, services, APIs, error handling basics | Completed           |
| Week 2 | PostgreSQL, SQL, Prisma, relationships, indexes, migrations, transactions                | Completed           |
| Week 3 | Advanced DB, concurrency, isolation, query optimization, pooling                         | Partially completed |
| Week 4 | Redis and caching                                                                        | Not started         |
| Week 5 | Queues and background jobs                                                               | Not started         |
| Week 6 | Testing and reliability                                                                  | Not started         |
| Week 7 | System design and scalability                                                            | Not started         |
| Week 8 | Docker, deployment and production                                                        | Not started         |

## Backend Filesystem

`Middleware`: common request processing.
`Controller`: handles HTTP request and response.
`Service`: contains business logic.
`Repository`: handles database operations.

### Basic request path

What happen when user send a request to node js backend `POST /api/auth/login`?

1. Incoming HTTP request _[Node.js HTTP server receives the request.]_
2. Middleware execution _[Express runs middleware such as JSON parsing, logging and authentication (if required).]_
3. Route matching _[Express matches POST + /api/auth/login.]_
4. Controller _[Extracts and validates email and password.]_
5. Service layer _[Business logic checks whether the user exists and verifies the password.]_
6. Database _[Fetches the user record from PostgreSQL.]_
7. Response _[Returns an appropriate HTTP status and JSON response.]_

### benefits of centralized error-handling middleware

- code reusability
- maintainability
- consistent error response

`Remember: Express error-handling middleware has four parameters: err, req, res, next.`

**Important: next() passes control to the next middleware or route handler. Without it, the request may remain hanging.**

## Types of middleware

1. Application-level middleware -> `Used across the entire Express application.`
   Example: Logging every incoming request.

2. Router-level middleware -> `Used for specific routes or groups of routes.`
   Example: Authentication.

3. Error-handling middleware -> `Used to handle errors centrally.`

Authentication vs Authorization
Scenario | Status | Reason
--------|----------|-----------
Invalid JWT | 401 | User is not authenticated
Valid JWT, but MEMBER accesses ADMIN route | 403 | User lacks permission
Valid JWT and ADMIN accesses ADMIN route | 200 | Access permitted

## Backend Architecture

1. `Routes` [Defines endpoints and middleware] _GET /api/users_
2. `Controllers` [Handles HTTP request and response] _getUsersController()_
3. `Services` [Contains business logic] _getUsersService()_
4. `Repository` [Communicates with the database] _findAllUsers()_
5. `PostgreSQL`

**Suppose tomorrow we change PostgreSQL to another database. We can change the repository implementation without rewriting our controller or business logic, provided the repository interface remains the same.**

## Backend Pagiation

I would implement server-side pagination to avoid fetching thousands of records at once. The API would accept page and limit query parameters, calculate the offset, and retrieve only the required records. On the frontend, I could use virtualization to render only visible rows and improve UI performance.

The backend calculates the database offset like this => `offset/skip = (page-1)*limit`

I would validate pagination `query parameters` using validation `middleware` [Zod], before the controller executes. The service would handle the pagination business logic, and the repository would execute the database query.

| Property   | Used for            | Example                |
| ---------- | ------------------- | ---------------------- |
| req.params | URL path parameters | /users/:id             |
| req.query  | Query parameters    | /users?page=1&limit=50 |
| req.body   | Request body        | POST request data      |

## Database

#### Why do we create one reusable Prisma client instead of writing new PrismaClient() separately inside every repository function?

=> Every new PrismaClient() creates a new client instance and can manage its own database connection pool.

Creating multiple instances unnecessarily can lead to:

- Too many database connections.
- Increased resource consumption.
- Connection exhaustion.
- Performance issues.

#### Prisma query for fetching users and get the total count

1. prisma.user.findMany({skip, take)}; [take is limit]
2. prisma.user.count()

`Prisma schema → SQL migration → PostgreSQL table`

**Route → Controller → Service → Repository → Prisma → PostgreSQL**

| Field            | Meaning                                 |
| ---------------- | --------------------------------------- |
| id               | Unique identifier for every user        |
| @id              | Primary key                             |
| @default(uuid()) | Automatically generates a unique ID     |
| @unique          | No two users can have the same email    |
| @default(now())  | Automatically stores creation time      |
| @updatedAt       | Automatically updates modification time |

#### Filter users by name

```
SELECT * FROM "Users"
where name = 'Megha';
```

#### Sort by createdAt descending

```
SELECT * from "Users"
ORDER BY "createdAt" DESC;
```

#### Return only 5 records

```
SELECT * from "Users"
LIMIT 5;
```

#### You want to change the email of the user whose ID is 123 to new@gmail.com

```
UPDATE "Users"
SET email="new@gmail.com"
Where id='123';
```

#### Suppose you want to delete a user whose email is megha@gmail.com.

```
DELETE from "Users"
WHERE email='megha@gmail.com';
```

### Quick recap of SQL CRUD

| Operation | SQL            |
| --------- | -------------- |
| Create    | INSERT INTO    |
| Read      | SELECT         |
| Update    | UPDATE ... SET |
| Delete    | DELETE FROM    |

## Advanced database engineering:

| Topic                     | Learnings                             |
| ------------------------- | ------------------------------------- |
| 1. Database relationships | Primary keys, foreign keys            |
| 2. Relationship types     | One-to-one, one-to-many, many-to-many |
| 3. Prisma relations       | Implement relationships in our schema |
| 4. Indexes                | Improve query performance             |
| 5. Transactions           | Maintain data consistency             |

### PK and FK

A primary key uniquely identifies a record within its own table, whereas a foreign key establishes a relationship between two tables by referencing the primary key of another table.

A foreign key also helps maintain referential integrity, ensuring that a record cannot reference a parent record that doesn't exist

### Relationship types

1. One-to-One (1:1) -> One user has one profile, and one profile belongs to one user.
2. One-to-many (1:N) -> One user can create multiple projects, but each project belongs to one user.

```
model Organization {
  id    String @id @default(uuid())
  name  String
  users User[]
}

model User {
  id             String @id @default(uuid())
  name           String
  email          String @unique

  organizationId String
  organization   Organization @relation(
    fields: [organizationId],
    references: [id]
  )
}
```

3. Many-to-Many (M:N) -> One user can belong to multiple projects, and one project can have multiple users.

```
model User {
  id             String             @id @default(uuid())
  name           String
  organizations  UserOrganization[]
}

model Organization {
  id    String             @id @default(uuid())
  name  String
  users UserOrganization[]
}

model UserOrganization {
  userId         String
  organizationId String

  user         User         @relation(fields: [userId], references: [id])
  organization Organization @relation(fields: [organizationId], references: [id])

  @@id([userId, organizationId])
}
```

In this relationship we generally make an extra table `join table(junction table)`, @@id([userId, organizationId]) creates a `composite primary key`. It prevents the same user from being linked to the same organization twice.

The main reason for using a junction table is to `maintain relational integrity and make relationships easier to query and manage.`

For example, storing organization IDs as an array inside User:

```
{
  "id": "U1",
  "name": "Megha",
  "organizationIds": ["O1", "O2"]
}
```

Problems:

1. Enforcing foreign-key constraints on individual array elements is difficult.
2. Adding, removing, and querying relationships becomes harder.
3. Maintaining relationship-specific information becomes difficult.
4. Preventing duplicate combinations requires additional handling.
   With a junction table, each relationship gets its own row, and database constraints protect it.

In Prisma, `select` picks `specific scalar fields` and relations to return, whereas `include` returns `all default scalar fields` on the main model plus the specified relations

```
 const resp = await prisma.user.findUnique({
      where: {
        email: "ravi@gmail.com",
      },
      select: {
        name: true,
        organizations: {
          select: {
            role: true,
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
```

### Database indexes

A database index is a supplementary data structure that speeds up data retrieval operations by allowing the database engine to locate specific rows without scanning an entire table.

In PostgreSQL, adding @unique creates a unique constraint backed by a unique `B-tree index` by default.

_One important point: indexes improve read performance but consume storage and add overhead to INSERT, UPDATE and DELETE operations._

In Prisma, we use `@@index` to create a database index without enforcing uniqueness.

```
model User {
  id             String   @id @default(uuid())
  name           String
  email          String   @unique
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organizations UserOrganization[]

  @@index([name])
}
```

#### Difference between @unique and @@index

| Feature                     | @unique | @@index |
| --------------------------- | ------- | ------- |
| Prevents duplicate values   | Yes     | No      |
| Improves search performance | Yes     | Yes     |
| Allows duplicate names      | No      | Yes     |
| Prisma syntax               | @unique | @@index |

**`npx prisma generate` -> whenever you add models, change fields, or update generator settings**

```
SELECT * FROM "User"
WHERE name = 'Megha'
ORDER BY "createdAt" DESC;
```

Index will be `@@index([name, createdAt])`

_When designing a composite B-tree index, column order matters._

A useful starting principle is:

- Put equality-filter columns first.
- Then consider range or sorting columns.
  This is a guideline, not a universal rule. Always verify with real query plans.

### Database transactions

A transaction is a group of database operations treated as one logical unit.
It follows ACID properties:

| Property    | Meaning                                            |
| ----------- | -------------------------------------------------- |
| Atomicity   | All operations succeed or none do                  |
| Consistency | Database remains valid                             |
| Isolation   | Concurrent transactions don't improperly interfere |
| Durability  | Committed changes survive failures                 |

Ex:

```
await prisma.$transaction(async (tx) => {
  await tx.account.update({
    where: { id: "megha" },
    data: { balance: { decrement: 1000 } },
  });

  await tx.account.update({
    where: { id: "samarth" },
    data: { balance: { increment: 1000 } },
  });
});
```

Here:

- Both operations succeed → commit.
- Either operation fails → rollback.
  tx is the transaction-scoped Prisma client.

**Transactions are useful when multiple database operations must succeed or fail together to maintain data consistency. If operations are independent, we may not need a transaction.**

Suppose the customer clicks Place Order twice because the frontend is slow. How would you prevent the backend from creating two identical orders?

=> I would implement idempotency using a unique `idempotency key`. The backend stores the key with the order and returns the existing order if the same key is received again. This prevents duplicate orders even when requests are retried.

What if two identical requests arrive at the backend at exactly the same time, before either request has saved the idempotency key? How would you prevent both from creating an order?

=> If two requests arrive simultaneously:

1. Request A checks the idempotency key → not found.
2. Request B checks the same key → not found.
3. Both proceed to create an order.

This is called a `race condition`.
Correct solution
Use a unique constraint on the idempotency key in PostgreSQL.

- Both requests attempt to insert the same key.
- PostgreSQL allows only one insert.
- The other request gets a unique constraint violation.
- Backend fetches and returns the already-created order.

_The database guarantees uniqueness even under concurrent requests._

Application-level checks alone cannot guarantee uniqueness because two concurrent requests can both pass the check before either inserts the record. A database unique constraint ensures atomic enforcement of uniqueness, even under concurrent requests.

Suppose two users try to book the last available seat at exactly the same time. How can the database prevent both users from booking it?

=> Two common approaches

1. Conditional UPDATE (recommended for simple inventory/seat booking)

```
UPDATE seats
SET available = false
WHERE id = 101 AND available = true;
```

2. Row-level locking
   Use SELECT ... FOR UPDATE inside a transaction to lock the seat row while checking and updating it.

#### What is the N+1 query problem, and how would you solve it?

=> The N+1 query problem occurs when we execute one query to fetch records and then additional queries for each record to fetch related data. This creates unnecessary database round trips and impacts performance. I would solve it using Prisma's include or select to fetch related data efficiently.

ex: Suppose you have 100 users, and you want to display each user's organization name.
=> Fetch all 100 users and their organizations together using Prisma include.

### Connection Pooling

If 1,000 requests each create a new database connection:

1. PostgreSQL has to manage too many connections.
2. Memory and CPU usage increase.
3. The database may reach its maximum connection limit.
4. New requests may fail or become slow.

**Instead of creating a new connection for every request, maintain a pool of reusable database connections.**

Connection pooling maintains a reusable set of database connections instead of creating a new connection for every request. It reduces connection overhead, resource consumption, and database connection exhaustion.

`1,000 API requests -> Connection pool (e.g. 20 connections) -> PostgreSQL`

### Database Isolation Levels

PostgreSQL supports four isolation levels:

| Isolation level  | What it prevents                       |
| ---------------- | -------------------------------------- |
| Read Uncommitted | PostgreSQL treats it as Read Committed |
| Read Committed   | Dirty reads                            |
| Repeatable Read  | Dirty reads and non-repeatable reads   |
| Serializable     | Also prevents serialization anomalies  |

| Problem        | Meaning                                                      |
| -------------- | ------------------------------------------------------------ |
| Dirty read     | Reading uncommitted data from another transaction            |
| Non-repeatable | read Reading the same row twice and getting different values |
| Phantom read   | Repeating a query returns a different set of rows            |

### Deadlock

A deadlock occurs when two or more transactions wait indefinitely for resources locked by each other.

#### How PostgreSQL handles it

PostgreSQL has a `deadlock detector`.

1. It detects the circular waiting condition.
2. It chooses one transaction as the victim.
3. It aborts that transaction and rolls it back.
4. The other transaction can continue.

How can we prevent deadlocks?

- Always acquire database locks in a consistent order.
- Keep transactions short.
- Avoid unnecessary locks.
- Implement retry logic for deadlock errors.

1. **Optimistic locking**
   We assume conflicts are rare. We don't lock the row while reading it. Instead, we check whether the data changed before updating it.
   ex:

```
UPDATE products
SET stock = 5, version = version + 1
WHERE id = 101 AND version = 2;
```

If another transaction already updated the version, this query affects 0 rows. We detect the conflict and retry or return an error.

2. **Pessimistic locking**
   We assume conflicts may happen, so we lock the row before modifying it.
   ex:

```
BEGIN;

SELECT * FROM products
WHERE id = 101
FOR UPDATE;

UPDATE products
SET stock = 5
WHERE id = 101;

COMMIT;
```

Q. Suppose an API takes 5 seconds to fetch 10,000 users from PostgreSQL. What would you investigate first to identify the bottleneck?
=> What would I investigate?

1. Query execution plan: Use `EXPLAIN ANALYZE` to understand how PostgreSQL executes the query.
2. Indexes: Check whether frequently filtered or sorted columns have appropriate indexes.
3. Full table scan: Check whether PostgreSQL is scanning unnecessary rows.
4. Joins: Check whether joins are inefficient.
5. Data volume: Are we fetching 10,000 records when the frontend only needs 20?

```
EXPLAIN ANALYZE
SELECT *
FROM "User"
WHERE name = 'Megha';
```

- EXPLAIN shows the planned execution.
- ANALYZE executes the query and reports actual execution statistics.

1. **Index Scan**
   PostgreSQL uses an index (typically a B-tree) to locate matching rows instead of checking every row.

```
SELECT * FROM "User"
WHERE email = 'megha@gmail.com';
```

2. **Sequential Scan**
   PostgreSQL scans the table's rows one by one to find matching records.

_Important: Sequential scan isn't always bad. For small tables or queries returning a large percentage of rows, it can be faster than an index scan._

### Cursor vs Offset Pagination

**Offset pagination**: This fetches 20 records after skipping the first 100.

```
SELECT * FROM "User"
ORDER BY id
LIMIT 20 OFFSET 100;
```

**Cursor-based pagination**: Instead of skipping rows, we remember the last record's position.

```
SELECT *
FROM "User"
WHERE id > 'last_seen_id'
ORDER BY id
LIMIT 20;
```

| Offset pagination                                  | Cursor pagination                                   |
| -------------------------------------------------- | --------------------------------------------------- |
| Uses LIMIT + OFFSET                                | Uses a cursor                                       |
| Large offsets can be slow                          | Efficient for deep pagination with a suitable index |
| Records inserted before the offset can shift pages | More stable when navigating forward                 |
| Good for small datasets                            | Good for large datasets and feeds                   |

**One important detail: use a stable, indexed cursor, often a combination of createdAt and id, to handle records with identical timestamps.**