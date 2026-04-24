# Support Chat — Frontend Integration Guide

This document covers everything a frontend developer needs to integrate the customer support chat system: REST endpoints, WebSocket events, authentication flows, and all request/response payloads.

---

## Table of Contents

1. [Authentication Overview](#1-authentication-overview)
2. [Customer REST Endpoints](#2-customer-rest-endpoints)
3. [Admin / Agent REST Endpoints](#3-admin--agent-rest-endpoints)
4. [Media Upload](#4-media-upload)
5. [WebSocket (Socket.io)](#5-websocket-socketio)
6. [Conversation Status Reference](#6-conversation-status-reference)
7. [Common Response Envelope](#7-common-response-envelope)
8. [Error Codes](#8-error-codes)

---

## 1. Authentication Overview

### 1.1 Customer (Anonymous)

When an anonymous visitor starts a chat, the server returns a short-lived **chat token** in the response. Store it (e.g. `sessionStorage`) and send it as a `Bearer` token on all subsequent REST calls and as the socket handshake token.

The token is scoped to that specific conversation — it cannot be used for any other conversation.

### 1.2 Customer (Registered Buyer)

Use the existing buyer JWT (same token used for all buyer endpoints). No additional token is issued.

### 1.3 Admin / Agent

Use the existing admin JWT.

### 1.4 Token header format (REST)

```
Authorization: Bearer <token>
```

---

## 2. Customer REST Endpoints

Base path: `/support/conversations`

---

### POST `/support/conversations`  
**Start a new conversation**  
No auth required. Rate-limited to ~3 requests / minute per IP.

> If the customer already has an active (non-closed) conversation, the server returns that existing conversation instead of creating a new one.

**Request body**

```json
{
  "email": "user@example.com",
  "phone": "+2348012345678",
  "name": "John Doe",
  "subject": "Order issue",
  "message": "Hi, I have a problem with my order #12345"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | string | Conditional | At least one of `email` or `phone` is required |
| `phone` | string (7–32 chars) | Conditional | At least one of `email` or `phone` is required |
| `name` | string (max 100) | No | Display name |
| `subject` | string (max 255) | No | Short topic summary |
| `message` | string (1–5000) | Yes | First message content |

**Response `201`**

```json
{
  "status": true,
  "message": "Conversation started",
  "data": {
    "conversation": {
      "id": 42,
      "referenceCode": "SUP-20260413-B7F1",
      "customerType": "anonymous",
      "chatCustomerId": 7,
      "buyerId": null,
      "assignedAgentId": 3,
      "status": "open",
      "subject": "Order issue",
      "createdAt": "2026-04-13T10:00:00.000Z",
      "updatedAt": "2026-04-13T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

> `token` is only present for anonymous customers. Registered buyers authenticated via buyer JWT will not receive a token.

---

### GET `/support/conversations/:id`  
**Get conversation details**  
Auth: Chat token or Buyer JWT

**Response `200`**

```json
{
  "status": true,
  "data": {
    "conversation": {
      "id": 42,
      "referenceCode": "SUP-20260413-B7F1",
      "customerType": "anonymous",
      "chatCustomerId": 7,
      "buyerId": null,
      "assignedAgentId": 3,
      "status": "open",
      "subject": "Order issue",
      "createdAt": "2026-04-13T10:00:00.000Z",
      "updatedAt": "2026-04-13T10:00:00.000Z"
    }
  }
}
```

---

### GET `/support/conversations/:id/messages`  
**List messages (paginated)**  
Auth: Chat token or Buyer JWT

**Query parameters**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `page` | number | 1 | |
| `limit` | number | 20 | Max 100 |
| `since` | ISO 8601 datetime | — | Only return messages after this timestamp (for polling) |

**Response `200`**

```json
{
  "status": true,
  "data": {
    "messages": [
      {
        "id": 101,
        "conversationId": 42,
        "senderType": "customer",
        "senderId": 7,
        "content": "Hi, I have a problem with my order #12345",
        "contentType": "text",
        "attachmentUrl": null,
        "attachmentMimeType": null,
        "attachmentSize": null,
        "readAt": null,
        "createdAt": "2026-04-13T10:00:00.000Z",
        "updatedAt": "2026-04-13T10:00:00.000Z"
      },
      {
        "id": 102,
        "conversationId": 42,
        "senderType": "agent",
        "senderId": 3,
        "content": "Hi John, let me look into that for you.",
        "contentType": "text",
        "attachmentUrl": null,
        "attachmentMimeType": null,
        "attachmentSize": null,
        "readAt": "2026-04-13T10:02:00.000Z",
        "createdAt": "2026-04-13T10:01:30.000Z",
        "updatedAt": "2026-04-13T10:02:00.000Z"
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 2
  }
}
```

---

### POST `/support/conversations/:id/messages`  
**Send a message as customer**  
Auth: Chat token or Buyer JWT  
Rate-limited.

**Request body**

```json
{
  "content": "Here is a screenshot of the error",
  "contentType": "image",
  "attachmentUrl": "https://cdn.example.com/uploads/abc123.png",
  "attachmentKey": "uploads/abc123.png",
  "attachmentMimeType": "image/png",
  "attachmentSize": 204800
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `content` | string (max 5000) | Conditional | At least one of `content` or `attachmentUrl` is required |
| `contentType` | `"text"` \| `"image"` \| `"file"` | No | Defaults to `"text"` |
| `attachmentUrl` | string (URL) | Conditional | Required if `content` is absent |
| `attachmentKey` | string (max 255) | No | Provider key (for deletion) |
| `attachmentMimeType` | string (max 100) | No | e.g. `"image/png"`, `"application/pdf"` |
| `attachmentSize` | number (bytes) | No | |

**Response `201`**

```json
{
  "status": true,
  "message": "Message sent",
  "data": {
    "message": {
      "id": 103,
      "conversationId": 42,
      "senderType": "customer",
      "senderId": 7,
      "content": "Here is a screenshot of the error",
      "contentType": "image",
      "attachmentUrl": "https://cdn.example.com/uploads/abc123.png",
      "attachmentMimeType": "image/png",
      "attachmentSize": 204800,
      "readAt": null,
      "createdAt": "2026-04-13T10:05:00.000Z",
      "updatedAt": "2026-04-13T10:05:00.000Z"
    }
  }
}
```

---

### PUT `/support/conversations/:id/messages/:msgId/read`  
**Mark a message as read**  
Auth: Chat token or Buyer JWT

No request body required.

**Response `200`**

```json
{
  "status": true,
  "message": "Message marked as read",
  "data": {
    "id": 102,
    "readAt": "2026-04-13T10:10:00.000Z"
  }
}
```

---

## 3. Admin / Agent REST Endpoints

Base path: `/admin/support`  
All endpoints require an **Admin JWT** (`Authorization: Bearer <admin-token>`).  
Write endpoints (`POST`, `PATCH`, `PUT`) additionally require one of: `support_admin`, `operations_admin`, `super_admin` roles.

---

### GET `/admin/support/conversations`  
**List all conversations**

**Query parameters**

| Param | Type | Notes |
|-------|------|-------|
| `status` | `"open"` \| `"waiting"` \| `"resolved"` \| `"closed"` | Filter by status |
| `agentId` | number | Filter by assigned agent |
| `page` | number | Default: 1 |
| `limit` | number | Default: 20, max 100 |

**Response `200`**

```json
{
  "status": true,
  "data": {
    "conversations": [
      {
        "id": 42,
        "referenceCode": "SUP-20260413-B7F1",
        "customerType": "anonymous",
        "chatCustomerId": 7,
        "buyerId": null,
        "assignedAgentId": 3,
        "status": "open",
        "subject": "Order issue",
        "createdAt": "2026-04-13T10:00:00.000Z",
        "updatedAt": "2026-04-13T10:05:00.000Z"
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

---

### GET `/admin/support/conversations/:id`  
**Get a single conversation**

Response shape is the same as [GET `/support/conversations/:id`](#get-supportconversationsid).

---

### GET `/admin/support/conversations/:id/messages`  
**List messages in a conversation**

Same query parameters and response shape as [GET `/support/conversations/:id/messages`](#get-supportconversationsidmessages).

---

### POST `/admin/support/conversations/:id/messages`  
**Send a reply as agent**  
Roles: `support_admin`, `operations_admin`, `super_admin`

Request body and response shape are identical to [POST `/support/conversations/:id/messages`](#post-supportconversationsidmessages), except `senderType` in the response will be `"agent"`.

---

### PUT `/admin/support/conversations/:id/messages/:msgId/read`  
**Mark a message as read (agent side)**  
Roles: `support_admin`, `operations_admin`, `super_admin`

Same as [PUT `/support/conversations/:id/messages/:msgId/read`](#put-supportconversationsidmessagesmsgidread).

---

### PATCH `/admin/support/conversations/:id/status`  
**Change conversation status**  
Roles: `support_admin`, `operations_admin`, `super_admin`

**Request body**

```json
{
  "status": "resolved"
}
```

| Field | Type | Required | Allowed values |
|-------|------|----------|----------------|
| `status` | string | Yes | `"open"` \| `"waiting"` \| `"resolved"` \| `"closed"` |

**Allowed transitions**

| From | Can transition to |
|------|-------------------|
| `open` | `waiting`, `closed` |
| `waiting` | `open`, `resolved`, `closed` |
| `resolved` | `open`, `closed` |
| `closed` | _(none — terminal state)_ |

**Response `200`**

```json
{
  "status": true,
  "message": "Status updated",
  "data": {
    "conversation": {
      "id": 42,
      "status": "resolved",
      "resolvedAt": "2026-04-13T11:00:00.000Z",
      "updatedAt": "2026-04-13T11:00:00.000Z"
    }
  }
}
```

> Triggers a `support:conversation-updated` socket event to all participants.

---

### PATCH `/admin/support/conversations/:id/assign`  
**Reassign conversation to another agent**  
Roles: `support_admin`, `operations_admin`, `super_admin`

**Request body**

```json
{
  "agentId": 5
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `agentId` | number | Yes | Must be a valid support agent ID |

**Response `200`**

```json
{
  "status": true,
  "message": "Conversation reassigned",
  "data": {
    "conversation": {
      "id": 42,
      "assignedAgentId": 5,
      "updatedAt": "2026-04-13T11:05:00.000Z"
    }
  }
}
```

> Triggers `support:conversation-updated` to all conversation participants and `support:new-conversation` to the newly assigned agent's personal room.

---

### PUT `/admin/support/availability`  
**Toggle own availability (agent sets themselves online/offline)**  
Roles: `support_admin`, `operations_admin`, `super_admin`

**Request body**

```json
{
  "isAvailable": true
}
```

**Response `200`**

```json
{
  "status": true,
  "message": "You are now available",
  "data": {
    "availability": {
      "id": 1,
      "agentId": 3,
      "isAvailable": true,
      "maxConcurrentChats": 10,
      "lastAssignedAt": "2026-04-13T10:00:00.000Z",
      "updatedAt": "2026-04-13T11:10:00.000Z"
    }
  }
}
```

---

### GET `/admin/support/availability`  
**Get all agents' availability status**

**Response `200`**

```json
{
  "status": true,
  "data": {
    "agents": [
      {
        "id": 1,
        "agentId": 3,
        "isAvailable": true,
        "maxConcurrentChats": 10,
        "lastAssignedAt": "2026-04-13T10:00:00.000Z",
        "updatedAt": "2026-04-13T11:10:00.000Z"
      },
      {
        "id": 2,
        "agentId": 4,
        "isAvailable": false,
        "maxConcurrentChats": 10,
        "lastAssignedAt": null,
        "updatedAt": "2026-04-13T09:00:00.000Z"
      }
    ]
  }
}
```

---

### GET `/admin/support/stats`  
**Dashboard stats**

**Response `200`**

```json
{
  "status": true,
  "data": {
    "stats": {
      "open": 12,
      "waiting": 5,
      "resolved": 30,
      "closed": 200,
      "unassigned": 3,
      "avgResponseTimeMs": 180000
    }
  }
}
```

---

## 4. Media Upload

### POST `/support/upload`  
**Upload an attachment before sending a message**  
Auth: Chat token or Admin JWT  
Max file size: **5 MB**  
Allowed types: `image/*`, `application/pdf`

**Request** — `multipart/form-data`

| Field | Type | Notes |
|-------|------|-------|
| `file` | binary | The file to upload |

**Response `200`**

```json
{
  "status": true,
  "data": {
    "url": "https://cdn.example.com/uploads/abc123.png",
    "key": "uploads/abc123.png",
    "mimeType": "image/png",
    "sizeBytes": 204800
  }
}
```

Use the returned `url`, `key`, and `mimeType` directly in the `POST .../messages` body.

---

## 5. WebSocket (Socket.io)

### 5.1 Connection

The server uses the **default Socket.io namespace** (`/`).

```js
import { io } from "socket.io-client";

const socket = io("https://api.example.com", {
  auth: {
    token: "<chat-token | buyer-jwt | admin-jwt>",
  },
});
```

Authentication is validated server-side before the connection is accepted. If the token is missing or invalid the connection will be rejected with an error.

**Token types accepted:**

| Who | Token |
|-----|-------|
| Anonymous customer | Chat token returned by `POST /support/conversations` |
| Registered buyer | Existing buyer JWT |
| Support agent / admin | Existing admin JWT |

---

### 5.2 Automatic Room Joining

After successful connection the server auto-joins rooms based on the token type — no client action needed:

| User type | Auto-joined rooms |
|-----------|------------------|
| Agent / admin | `agents`, `agent:{adminId}` |
| Anonymous customer | `conversation:{conversationId}` |
| Registered buyer | None — must emit `support:join` |

---

### 5.3 Client → Server Events

#### `support:join`  
Join a specific conversation room. Required for **registered buyers** (not needed for anonymous customers since they are auto-joined at connection time).

**Payload**

```json
{
  "conversationId": 42
}
```

Emits `support:error` if the conversation is not found or the buyer does not own it.

---

#### `support:message`  
Send a message in a conversation.

**Payload**

```json
{
  "conversationId": 42,
  "content": "Can you check my order?",
  "contentType": "text",
  "attachmentUrl": null,
  "attachmentKey": null,
  "attachmentMimeType": null,
  "attachmentSize": null
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `conversationId` | number | Yes | |
| `content` | string (max 5000) | Conditional | At least one of `content` or `attachmentUrl` is required |
| `contentType` | `"text"` \| `"image"` \| `"file"` | No | Defaults to `"text"` |
| `attachmentUrl` | string | Conditional | |
| `attachmentKey` | string | No | |
| `attachmentMimeType` | string | No | |
| `attachmentSize` | number | No | Bytes |

Rate limit: **30 messages per 60 seconds** per socket connection.

---

#### `support:read`  
Mark a specific message as read.

**Payload**

```json
{
  "messageId": 102
}
```

---

### 5.4 Server → Client Events

#### `support:message`  
Broadcast to everyone in `conversation:{id}` when a new message is sent (via REST or WebSocket).

**Payload**

```json
{
  "message": {
    "id": 103,
    "conversationId": 42,
    "senderType": "agent",
    "senderId": 3,
    "content": "Hi John, let me look into that for you.",
    "contentType": "text",
    "attachmentUrl": null,
    "attachmentMimeType": null,
    "attachmentSize": null,
    "readAt": null,
    "createdAt": "2026-04-13T10:01:30.000Z",
    "updatedAt": "2026-04-13T10:01:30.000Z"
  }
}
```

---

#### `support:read-receipt`  
Broadcast to `conversation:{id}` when a message is marked as read.

**Payload**

```json
{
  "messageId": 102,
  "readAt": "2026-04-13T10:10:00.000Z"
}
```

---

#### `support:conversation-updated`  
Broadcast to `conversation:{id}` when the conversation's status or assignment changes.

**Payload**

```json
{
  "conversationId": 42,
  "status": "resolved",
  "assignedAgentId": 5
}
```

Fields are only present if they changed — e.g. a status update won't include `assignedAgentId` and vice versa.

---

#### `support:new-conversation`  
Sent to the `agents` room and to `agent:{agentId}` when a new conversation is created or reassigned to that agent.

**Payload**

```json
{
  "conversation": {
    "id": 42,
    "referenceCode": "SUP-20260413-B7F1",
    "customerType": "anonymous",
    "chatCustomerId": 7,
    "buyerId": null,
    "assignedAgentId": 3,
    "status": "open",
    "subject": "Order issue",
    "createdAt": "2026-04-13T10:00:00.000Z",
    "updatedAt": "2026-04-13T10:00:00.000Z"
  }
}
```

---

#### `support:error`  
Sent directly to the socket that caused an error.

**Payload**

```json
{
  "message": "Rate limit exceeded. Slow down.",
  "code": "RATE_LIMITED"
}
```

| Code | Meaning |
|------|---------|
| `RATE_LIMITED` | Too many messages in the window |
| `INVALID_PAYLOAD` | Missing or malformed fields |
| `FORBIDDEN` | Token is not valid for this conversation |
| `SEND_FAILED` | Server-side error persisting the message |
| `READ_FAILED` | Server-side error marking the message as read |

---

### 5.5 Suggested Client Integration Pattern

```js
// 1. Start conversation (anonymous)
const { data: { conversation, token } } = await api.post("/support/conversations", {
  email: "user@example.com",
  message: "Hello, I need help",
});
sessionStorage.setItem("chatToken", token);

// 2. Connect socket
const socket = io(API_URL, { auth: { token } });

// 3. Listen for incoming messages
socket.on("support:message", ({ message }) => {
  appendMessageToUI(message);
});

// 4. Listen for conversation updates
socket.on("support:conversation-updated", (update) => {
  if (update.status === "closed") showClosedBanner();
});

// 5. Listen for read receipts
socket.on("support:read-receipt", ({ messageId, readAt }) => {
  markMessageRead(messageId, readAt);
});

// 6. Handle errors
socket.on("support:error", ({ message, code }) => {
  showError(message);
});

// 7. Send a message via socket
socket.emit("support:message", {
  conversationId: conversation.id,
  content: "Here is more detail",
  contentType: "text",
});

// 8. Mark a message as read
socket.emit("support:read", { messageId: 102 });

// 9. REST fallback — poll for messages if socket is disconnected
const { data } = await api.get(`/support/conversations/${conversation.id}/messages`, {
  params: { since: lastMessageTimestamp },
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## 6. Conversation Status Reference

| Status | Meaning | Who can set it |
|--------|---------|----------------|
| `open` | Customer is waiting for an agent reply | System (on creation or customer reply to a resolved conversation), Agent |
| `waiting` | Agent has replied; awaiting customer | Agent |
| `resolved` | Agent closed the issue; customer can still reply (reopens to `open`) | Agent |
| `closed` | Terminal — customer must start a new conversation | Agent |

---

## 7. Common Response Envelope

All REST responses follow this structure:

```json
{
  "status": true,
  "message": "Human-readable description",
  "data": { }
}
```

Error responses:

```json
{
  "status": false,
  "message": "Error description",
  "errors": [ ]
}
```

---

## 8. Error Codes

| HTTP Status | When |
|-------------|------|
| `400` | Validation error (missing/invalid fields) |
| `401` | Missing or invalid/expired token |
| `403` | Token valid but not authorised for this resource |
| `404` | Conversation or message not found |
| `422` | Business rule violation (e.g. invalid status transition) |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
