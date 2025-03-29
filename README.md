# 🧠 Dynamic Knowledge Base API

A RESTful API for managing hierarchical topics and resources with version control, user roles, and permissions. Built with **TypeScript**, **Express**, and a clean architecture mindset.

---

## 🚀 Getting Started

### ✅ Requirements

- **Node.js** `>=20.9.0`
- **npm**

### 📦 Install dependencies

```bash
npm install
# or
yarn
```

### ▶️ Run the project

```bash
npm run dev
```
Server will start at: http://localhost:3000

## 🧱 Project Structure & Principles
This project is built using Clean Architecture, SOLID and another good practice principles, ensuring modularity, testability, and maintainability.

### ⚙️ Key Architectural Features

#### 🧩 Dependency Injection
Each module receives another module dependencies via constructor:

#### 🏛️ SOLID Principles
Single Responsibility: Each layer has one job.

Open/Closed: Business rules can evolve via strategies & factories.

Liskov: Interfaces are respected across layers.

Interface Segregation: Small, focused interfaces.

Dependency Inversion: High-level modules depend on abstractions.

#### 🏭 Factory Pattern
Used for example to create topics and versions with encapsulated logic.

#### 🧠 Strategy Pattern
Used for example to manage permissions by user role.

#### 🧨 Centralized Error Handling
All errors thrown in services are caught by a global middleware and translated into proper HTTP responses.

Supports custom errors like:

NotFoundError

ValidationError

ConflictError

...

#### 🧪 Testing
✅ Unit Tests

Each controller, service, factory, strategy, and repository has dedicated unit tests with mocked dependencies.

Run all tests with coverage:

```bash
npm run test:coverage
```


#### 🧪 Test Case Example
Sugestion: Simulate the following topic tree and version control:

ID	Name	Version	ParentTopicId
1	Programming	1	null
2	Frontend	1	1
3	Backend	1	1
4	React	1	2
5	React	2	2
6	Node	1	3

#### 📬 Testing with Postman

Use this postman base collection to run the project that is inside root directory.

### 🧠 Summary
This project is a showcase of advanced backend architecture with:

🔁 Version control for hierarchical topics

🧩 Clean, scalable code with SOLID

⚔️ Permissions via strategy pattern

🧪 Robust testing (unit + integration)

🧨 Centralized error handling