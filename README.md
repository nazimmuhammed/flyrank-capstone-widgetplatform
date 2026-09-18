# FlyRank Widget Platform

A multi-tenant embeddable widget platform built for the FlyRank Capstone.

## Features

- Multi-tenant widget management
- JWT authentication
- Widget CRUD APIs
- Public widget configuration API
- Embeddable JavaScript widget
- Public lead submission API
- PostgreSQL persistence
- Submission validation
- Payload size protection
- Rate limiting
- Honeypot spam protection
- IP and geo enrichment
- Graceful enrichment failure
- Dashboard submission API
- Basic submission analytics
- Dockerized PostgreSQL development environment

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Docker
- JWT
- JavaScript
- REST APIs

## Project Structure

```text
flyrank-capstone-widgetplatform/
├── public/
│   ├── widget.js
│   └── test.html
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   └── test-db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── widgets.js
│   │   ├── public.js
│   │   ├── submissions.js
│   │   └── dashboard.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md