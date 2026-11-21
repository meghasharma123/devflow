# Backend

## Backend Filesystem
`Middleware`: common request processing.
`Controller`: handles HTTP request and response.
`Service`: contains business logic.
`Repository`: handles database operations.

### Basic request path
What happen when user send a request to node js backend `POST /api/auth/login`?

1. Incoming HTTP request *[Node.js HTTP server receives the request.]*
2. Middleware execution *[Express runs middleware such as JSON parsing, logging and authentication (if required).]*
3. Route matching *[Express matches POST + /api/auth/login.]*
4. Controller *[Extracts and validates email and password.]*
5. Service layer *[Business logic checks whether the user exists and verifies the password.]*
6. Database *[Fetches the user record from PostgreSQL.]*
7. Response *[Returns an appropriate HTTP status and JSON response.]*

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
Scenario |	Status |	Reason
--------|----------|-----------
Invalid JWT |	401 | 	User is not authenticated
Valid JWT, but MEMBER accesses ADMIN route |	403 |	User lacks permission
Valid JWT and ADMIN accesses ADMIN route |	200 |	Access permitted

## Backend Architecture

1. `Routes` [Defines endpoints and middleware] *GET /api/users*
2. `Controllers` [Handles HTTP request and response] *getUsersController()*
3. `Services` [Contains business logic] *getUsersService()*
4. `Repository` [Communicates with the database] *findAllUsers()*
5. `PostgreSQL`

**Suppose tomorrow we change PostgreSQL to another database. We can change the repository implementation without rewriting our controller or business logic, provided the repository interface remains the same.**

## Backend Pagiation

I would implement server-side pagination to avoid fetching thousands of records at once. The API would accept page and limit query parameters, calculate the offset, and retrieve only the required records. On the frontend, I could use virtualization to render only visible rows and improve UI performance.

The backend calculates the database offset like this => `offset = (page-1)*limit`

I would validate pagination `query parameters` using validation `middleware` [Zod], before the controller executes. The service would handle the pagination business logic, and the repository would execute the database query.



# Code

1. To setup `npm init -y`
2. install dependencies 
```
npm install express dotenv cors helmet
npm install -D typescript tsx @types/node @types/express @types/cors
```
3. To configure ts: `npx tsc --init`
4. package.json script update:
```
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```











```
devflow-backend/
    src/
        config/
        controllers/
        services/
        repositories/
        routes/
        middlewares/
        utils/
        app.ts
            server.ts
    tests/
    package.json
        tsconfig.json
```