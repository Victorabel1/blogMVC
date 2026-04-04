An Express API for user authentication and CRUD operations on articles blog.

Features
User signup + login (JWT based)
Create / read / update / delete articles
Search articles (text search)
File upload support (multer & Cloudinary for image uploads)
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
uploads/ – directory for uploaded files

Getting Started
1) Install dependencies
npm install

2) Configure environment
Create a .env with at least:

3) Run the server
npm run dev

Required Packages
The following packages are installed via npm install:

Core Framework
- express (^5.2.1) – Web server framework
- cors (^2.8.6) – Cross-origin resource sharing middleware

Authentication & Security
- jsonwebtoken (^9.0.3) – JWT token generation and verification
- bcrypt (^6.0.0) – Password hashing
- dotenv (^17.2.4) – Environment variables management

Database
- mongoose (^9.1.6) – MongoDB object modeling

Validation
- joi (^18.0.2) – Data validation schema

File Upload
- multer (^2.1.1) – Middleware for file uploads
- cloudinary (^2.9.0) – Cloud storage for images
- multer-storage-cloudinary (^4.0.0) – Integration between multer and Cloudinary

Utilities
- cookie-parser (^1.4.7) – Cookie parsing middleware
- nodemon (^3.1.11) – Development server auto-restart on file changes

Available Scripts
npm start — run node server.js
npm run dev — run nodemon server.js
API Endpoints
Auth (no token required)
POST /api/auth/signup — register user
POST /api/auth/login — login user
(Validations are in user.validation.js)

Articles (requires auth)
All routes under /api are protected with requireAuth. Include "Authorization: Bearer <token>" in headers.

POST /api/articles — create article
GET /api/articles — list articles (supports limit + page)
GET /api/articles/search?q=<query> — search articles
GET /api/articles/:id — get article by id
PUT /api/articles/:id — update article
DELETE /api/articles/:id — delete article
Validation for articles lives in post.validation.js.

File Upload
POST /upload — upload a single image file (multer)
POST /api/auth/upload — upload a single image file (multer, under auth routes)

Notes:
Passwords are hashed with bcrypt before saving.
JWT is issued at login and expected by requireAuth as "Bearer <token>".
The API currently returns the user password in the login response (for learning only). Remove that in production.
Uploaded files are stored in the uploads/ directory in Cloudinary.