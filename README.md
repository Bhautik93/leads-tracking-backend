Make sure you have installed:

Node.js
npm

npm install
nodemon server.js or node server.js

Tech Stack :-
Node.js
Express.js
SQLite
better-sqlite3
bcrypt
JWT


API Documentation

Base URL:

http://localhost:5000

Admin Signup
curl -X POST http://localhost:5000/api/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "password123"
  }'


Admin Login
curl -X POST http://localhost:5000/api/admin/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'


Get Leads
curl http://localhost:5000/api/leads

Search Leads
curl "http://localhost:5000/api/leads?search=john"

Filter Leads by Status
curl "http://localhost:5000/api/leads?status=qualified"

Create Lead
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "status": "new"
  }'


Get Lead by ID
curl http://localhost:5000/api/leads/:id


Update Lead
curl -X PATCH http://localhost:5000/api/leads/:id \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "status": "contacted"
  }'


Delete Lead
curl -X DELETE http://localhost:5000/api/leads/:id


Get Lead Notes
curl http://localhost:5000/api/leads/:id/notes


Add Note
curl -X POST http://localhost:5000/api/leads/:id/notes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Follow up with the lead next week."
  }'

Delete Notes
curl -X DELETE http://localhost:5000/api/leads/:id/notes/:noteId


Lead Statuses

The following statuses are supported:

new
contacted
qualified
lost
Database

SQLite is used as the database.

Tables:

admin
leads
notes

The notes.leadId field is related to leads.id.