# 📚 Library Management API

A RESTful API built with **Express**, **TypeScript**, **MongoDB** (via Mongoose), and **Zod** to manage books and borrowing operations with proper validation and error handling.

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Modules](#key-modules)
- [ Technologies Used](#️-technologies-used)
- [ API Endpoints](#-api-endpoints)

  - [ Books](#-books)
    - [POST /api/books](#post-apibooks)
    - [GET /api/books](#get-apibooks)
    - [PUT /api/books/:bookId](#put-apibooksbookid)
    - [DELETE /api/books/:bookId](#delete-apibooksbookid)
  - [ Borrow](#-borrow)
    - [POST /api/borrow](#post-apiborrow)
    - [GET /api/borrow](#get-apiborrow)

- [Error Response](##error-response)
- [Deployment](#-deployment)
- [Setup](#-setup)

## Overview

The **Library Management API** allows you to:

- Book management (`CRUD` operations)
- Borrow books with due date tracking and copy control
- Automatically handle book availability logic
- Report summaries using `MongoDB` Aggregation Pipeline

<br/>

#### Key Modules:

- **Books**: Manage book inventory
- **Borrows**: Track book loans
- **Error Handling**: Global middleware
- **Validation**: Request/response schemas

<br/>

## Technologies Used

| Tech           | Purpose                            |
| -------------- | ---------------------------------- |
| **Node.js**    | JavaScript runtime                 |
| **Express.js** | Backend web framework              |
| **TypeScript** | Static typing                      |
| **MongoDB**    | NoSQL database                     |
| **Mongoose**   | MongoDB ODM with schema validation |
| **Zod**        | Input validation                   |
| **Vercel**     | Deployment platform                |

<br/>

## API Endpoints

### 1. Books

#### `POST /api/books`

Create a new book.

**Request Body:**

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

---

#### `GET /api/books`

Fetch all books (Supports filtering, and sorting)

Example Query: <br/>`/api/books?filter=SCIENCE&sortBy=createdAt&sort=desc&limit=5`

**Response:**

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
    {...}
  ]
}
```

---

#### `GET /api/books/:bookId`

Get Book by ID

#### Response:

```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

---

#### `PUT /api/books/:bookId`

Update Book

#### Request:

```json
{
  "copies": 50
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 50,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-20T08:30:00.000Z"
  }
}
```

---

#### `DELETE /api/books/:bookId`

Delete Book

#### Response:

```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

---

### 2. Borrow

#### `POST /api/borrow`

Borrow a Book

#### Request:

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

#### Response:

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
  }
}
```

---

#### `GET /api/borrow`

Return a summary of borrowed books, including:

- Total borrowed quantity per book (`totalQuantity`)
- Book details ()`title` and `isbn`)

**Response:**

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

---

## Error Response

For error handling, a global error handling feture is developed and leveraged in the form of a middleware. Typical error response format looks like this:

```json
{
  "message": "Error message",
  "success": false,
  "error": {
    "statusCode": 400,
    "details": {}
  }
}
```

**Common Errors:**

- `400 Bad Request:` Invalid input

- `404 Not Found:` Resource not found

- `500 Internal Server Error:` Server issues

---

## Deployment

The project is live on Vercel and all API endpoints are accessible at the following base URL:

### [https://level2-library.vercel.app/](https://level2-library.vercel.app/)

You can use this URL as the base for all routes, such as:

- `GET /api/books`
- `POST /api/borrow`
- `GET /api/borrow`

  ...and more.

> ⚠️ Note: Make sure to use tools like **Postman**, to interact with the API, since it doesn't serve a frontend.

---

## Setup

Setup is pretty straight forward. Open a terminal and execute the following commands:

```bash

  git clone git@github.com:tajmin/level2-assingment3.git
  cd librarylevel2-assingment3
  npm install

```
