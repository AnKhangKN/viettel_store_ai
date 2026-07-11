# Project Rules

Architecture

Router
↓
Controller
↓
Service
↓
Repository

Repository:
- SQL only

Service:
- Business logic only

Controller:
- Validate request
- Return response

Database:
- PostgreSQL

Never use ORM.

Use async.

Read only files related to the task.