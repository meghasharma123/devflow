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


# Code

1. To setup `npm init -y`
2. install dependencies 
```
npm install express dotenv cors helmet
npm install -D typescript tsx @types/node @types/express @types/cors
```
3. To configure ts: `npx tsc --init`













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