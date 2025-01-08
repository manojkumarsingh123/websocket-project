- Environment Variables
  Create a .env file at the root of your project:

plaintext
Copy code
DB_NAME=chatapp
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_token_secret

PORT=3000

- Install Dependencies (mentioned in package.json file)

- Create the Database in PostgreSQL:

- Create db tables (mentioned in sqlQuery.sql file)

* Start the Server

node src/server.js

- Testing Endpoints
  You can test the API using Postman or cURL.

Register a User

POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
"username": "manoj singh",
"email": "manoj@examplue.com",
"password": "password1234",
"organizationName": "Acme SN Corp",
"role": "admin"
}

- Login

POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
"email": "Test@example.com",
"password": "password123"
}

- Refresh Token

POST http://localhost:3000/api/auth/refresh-token
Content-Type: application/json

{
"refreshToken": "your_refresh_token"
}

Fetch Chat Rooms:

GET http://localhost:3000/api/chat
Authorization: Bearer <access_token>

Create a Chat Room:

POST http://localhost:3000/api/chat
Authorization: Bearer <access_token>
Content-Type: application/json

{
"name": "General Discussion"
}

- src/websockets/socketHandler.js
  This file implements WebSocket logic for:

Joining/Leaving Rooms
Sending/Receiving Messages
Broadcasting Notifications
Typing Indicators

- src/server.js
  Initialize the Socket.IO server and attach it to the HTTP server:

Postman: Supports WebSocket testing (built-in WebSocket client).

Testing with Postman
Open Postman and select New Tab.

Choose the WebSocket Request option.

Connect to the WebSocket server:

ws://localhost:3000
Join a Chat Room
Send the following JSON message to join a room:

json
Copy code
{
"event": "joinRoom",
"data": {
"roomId": 1,
"userId": 123
}
}

Task 1 : Implement user registration with the following fields:
○ username (unique)
○ email
○ password (hashed with bcrypt or similar library)
○ role (e.g., admin, moderator, user)

ex: {
"username": "manoj singh",
"email": "manoj@examplue.com",
"password": "password1234",
"organizationName": "Acme SN Corp",
"role": "admin"
}

<<Done>>

Task 2 : Create a login endpoint that issues a short-lived JWT access token and a long-lived
refresh token.

ex: {
"email": "manoj@examplue.com",
"password": "password1234"
}

<<Done>>

Task 3 : Implement token refresh functionality (POST /refresh-token).

{
"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzM2MjY3MTAzLCJleHAiOjE3MzY4NzE5MDN9.R_KTo6xRXhAnluRL6Kw6CrOt4qIBM96O0nRJE3mlrCc"
}

<<Done>>

Task 4 : Protect all WebSocket connections and REST API endpoints using JWT-based
authentication.

<<Done>>

Task 5 :

Design PostgreSQL schema :
○ Organizations (id, name, created_at)
○ Users (id, username, email, password, organization_id, role)
○ Chat Rooms (id, name, organization_id, created_by, created_at)
○ Messages (id, chat_room_id, user_id, content, created_at,
is_encrypted)

<<Done>>

Task 6 :

Real-Time Communication (WebSocket)
● Use WebSocket to implement the following:
○ Private Chats: Allow one-on-one real-time messaging.

ex: {
"event": "joinRoom",
"data": {
"roomId": "1",
"userId": 1
}
}

{
"event": "joinRoom",
"data": {
"roomId": "1",
"userId": 2
}
}

{
"event": "sendMessage",
"data": {
"roomId": "1",
"userId": 1,
"content": "Hello, User B!"
}
} // Send FROM user 1 then it will recieve to user 2

{
"event": "sendMessage",
"data": {
"roomId": "1",
"userId": 1,
"content": "Hello, User B!"
}
} // Send FROM user 2 then it will recieve to user 1

<<Done>>

Task 7 :
○ Group Chats: Support group chat rooms where multiple users can communicate.

let joined 3 user with userid 1,2,3

{
"event": "joinRoom",
"data": {
"roomId": "1",
"userId": 1
}
}

{
"event": "joinRoom",
"data": {
"roomId": "1",
"userId": 2
}
}

{
"event": "joinRoom",
"data": {
"roomId": "1",
"userId": 3
}
}

if we send any mesaage from 3rd user it will visible to all user beacuse all joined same room

{
"event": "sendMessage",
"data": {
"roomId": "1",
"userId": 1,
"content": "Hello, All User"
}
}

<<Done>>

Task 8 :

○ Broadcast notifications to all users when:
■ A user joins or leaves a chat room.

join :

{
"event": "joinRoom",
"data": {
"roomId": "1",
"userId": 1
}
}

leave :

{
"event": "leaveRoom",
"data": {
"roomId": "1",
"userId": 1
}
}

<<Done>>

Task 9 :

■ A new chat room is created in the organization.

{
"event": "newChatRoom",
"data": {
"roomName": "Project Updates",
"invitedUsers": [2, 3],
"roomId":"2",
"organizationId":3
}
}

this mesaage will apper to user id 2 and 3

<<Done>>

Task 10:

○ Real-time typing indicators for active users in a room.

ex : {
"event": "typing",
"data": {
"roomId": "1",
"userId": 1
}
}

this is send by user1 which will visible to user 2 and 3

<<Done>>

Task 11 : Allow users to react to messages (e.g., 👍, ❤️).

ex : {
"event": "reactMessage",
"data": {
"userId": 1,
"messageId": "message-123",
"reaction": "👍"
}
}

this emoji should be visible to user2 and 3

<<Done>>

Task 12 : Each user is linked to an organization.

check the db

<<Done>>

Task 13 :
-- Added pagination to get chatrooms details

http://localhost:3000/api

let output :

{
"total": 11,
"pages": 2,
"currentPage": 1,
"data": [
{
"id": 32,
"name": "z y a p l",
"createdAt": "2025-01-08T11:35:04.618Z",
"updatedAt": "2025-01-08T11:35:04.618Z",
"organization_id": 3
},
{
"id": 31,
"name": "z y a p",
"createdAt": "2025-01-08T11:34:51.091Z",
"updatedAt": "2025-01-08T11:34:51.091Z",
"organization_id": 3
},
{
"id": 30,
"name": "z y a",
"createdAt": "2025-01-08T11:34:28.589Z",
"updatedAt": "2025-01-08T11:34:28.589Z",
"organization_id": 3
},
{
"id": 29,
"name": "z y a",
"createdAt": "2025-01-08T11:26:30.739Z",
"updatedAt": "2025-01-08T11:26:30.739Z",
"organization_id": 3
},
{
"id": 28,
"name": "z y",
"createdAt": "2025-01-07T18:34:11.566Z",
"updatedAt": "2025-01-07T18:34:11.566Z",
"organization_id": 3
},
{
"id": 27,
"name": "z y",
"createdAt": "2025-01-07T18:32:21.908Z",
"updatedAt": "2025-01-07T18:32:21.908Z",
"organization_id": 3
},
{
"id": 26,
"name": "z y",
"createdAt": "2025-01-07T18:32:14.715Z",
"updatedAt": "2025-01-07T18:32:14.715Z",
"organization_id": 3
},
{
"id": 25,
"name": "z y",
"createdAt": "2025-01-07T18:31:39.198Z",
"updatedAt": "2025-01-07T18:31:39.198Z",
"organization_id": 3
},
{
"id": 24,
"name": "z y",
"createdAt": "2025-01-07T18:30:26.634Z",
"updatedAt": "2025-01-07T18:30:26.634Z",
"organization_id": 3
},
{
"id": 23,
"name": "z y",
"createdAt": "2025-01-07T18:18:36.348Z",
"updatedAt": "2025-01-07T18:18:36.348Z",
"organization_id": 3
}
]
}

to go for page 2

http://localhost:3000/api/chat?page=2&pageSize=10

{
"total": 11,
"pages": 2,
"currentPage": 2,
"data": [
{
"id": 22,
"name": "z y",
"createdAt": "2025-01-07T18:12:37.324Z",
"updatedAt": "2025-01-07T18:12:37.324Z",
"organization_id": 3
}
]
}

<<Done>>

Task 14 : Applied rate limiting for http://localhost:3000/api/chat : Get

<<Done>>

Task 15 : Use efficient indexing strategies for frequently queried fields (e.g., organization_id,
chat_room_id, created_at).

<<Done>>
