An Express + MongoDB REST API for user authentication and CRUD operations on articles.

Features
User signup + login (JWT based)
Create / read / update / delete articles
Search articles (text search)
Request validation with Joi
Authentication middleware (requireAuth)
Project Structure
server.js – app entrypoint
app.js – Express app + middleware + routes
connectDB.js – MongoDB connection
routes – route definitions
controllers – request handlers
models – Mongoose schemas
validations – Joi validation middleware
middlewares – logger / auth / error handler
utils – helper utilities (bcrypt hash helper)

Getting Started
1) Install dependencies
2) Configure environment
Create a .env with at least:

3) Run the server
Available Scripts
npm start — run node server.js
npm run dev — run nodemon server.js
API Endpoints
Auth (no token required)
POST /api/auth/signup — register user
POST /api/auth/login — login user
(Validations are in user.validation.js)

Articles (requires auth)
All routes under /api are protected with requireAuth:

POST /api/articles — create article
GET /api/articles — list articles (supports limit + page)
GET /api/articles/search?q=<query> — search articles
GET /api/articles/:id — get article by id
PUT /api/articles/:id — update article
DELETE /api/articles/:id — delete article
Validation for articles lives in post.validation.js.

Notes:
Passwords are hashed with bcrypt before saving.
JWT is issued at login and expected by requireAuth.
The API currently returns the user password in the login response (for learning only). Remove that in production
