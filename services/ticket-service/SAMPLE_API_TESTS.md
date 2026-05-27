# Ticket Service API Sample Requests

Base URL:

- http://localhost:3002/tickets

## Authentication

All protected endpoints require an `Authorization` header:

```
Authorization: Bearer <ACCESS_TOKEN>
```

The JWT payload should include at least:

- `userId`
- `role` (`admin` or `user`)

---

## Endpoints

### 1. Create a ticket

POST `/tickets`

Request JSON:

```json
{
  "subject": "Wi-Fi not working",
  "complaint": "Office Wi-Fi is dropping every 10 minutes since morning.",
  "priority": "high",
  "location": "2nd floor, east wing"
}
```

Response:

- `201 Created` with created ticket details

---

### 2. Get tickets for the authenticated user

GET `/tickets/mine`

Response:

- `200 OK` with the list of tickets created by the current user

---

### 3. Get a single ticket by ID

GET `/tickets/:id`

Example:

`GET /tickets/12`

Response:

- `200 OK` if ticket exists and belongs to the user, or if the user is admin
- `403 Forbidden` if the user tries to access another user's ticket

---

### 4. Get all tickets

GET `/tickets`

Response behavior:

- Admin: returns all tickets
- Non-admin user: returns only the user's tickets

---

### 5. Update ticket status (admin only)

PUT `/tickets/:id`

Request JSON:

```json
{
  "status": "resolved"
}
```

Allowed status values:

- `open`
- `in_progress`
- `resolved`
- `closed`

Example:

`PUT /tickets/12`

Response:

- `200 OK` when status updates successfully
- `403 Forbidden` if the requester is not admin

---

### 6. Delete a ticket

DELETE `/tickets/:id`

Example:

`DELETE /tickets/12`

Response:

- `200 OK` when the ticket is deleted
- `404 Not Found` if the ticket does not exist or belongs to another user

---

## Sample test data payloads

### Create ticket sample data

```json
{
  "subject": "Printer paper jam",
  "complaint": "Printer in room 305 keeps jamming even after clearing.",
  "priority": "medium",
  "location": "Room 305"
}
```

```json
{
  "subject": "Email server down",
  "complaint": "Cannot send or receive email since 09:00 AM.",
  "priority": "urgent",
  "location": "Main office"
}
```

### Update status sample data

```json
{
  "status": "in_progress"
}
```

```json
{
  "status": "closed"
}
```
