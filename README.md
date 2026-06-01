# 🔗 Pendek URL Shortener

A high-performance URL shortening service leveraging the Bun ecosystem and MongoDB. This project focuses on native speed, secure token-based access, and efficient identifier generation.

## 🛠️ Tech Stack

* **Runtime:** Bun (Fast all-in-one JavaScript & TypeScript runtime)
* **Process Manager:** BPM2 (Process manager designed specifically for the Bun runtime)
* **Framework:** Hono (Lightweight, web standards-based application framework)
* **Database:** MongoDB (NoSQL Object Data Modeling)
* **ORM:** Mongoose
* **Auth:** Token-Based Authentication (JWT / HTTP-only Secure Cookies)
* **Hasher:** Bun.CryptoHasher (Native utility for highly randomized URL identifier generation)

## 🔑 Key Features

* **Native Bun Hashing:** Utilizes Bun's built-in cryptographic hasher (`SHA256`) to extract randomized, high-entropy 5-character slugs from full hashes, ensuring minimal collision rates without external packages.
* **Production-Grade Process Management:** Powered by BPM2 to manage application state, handle automated crashes/restarts, and ensure the server remains immortal during deployment.
* **Secure API:** Implements Next.js middleware-compatible token flows and schema validation via Zod to safeguard creation and user dashboard routes.
* **Mongoose Integration:** Structured modeling for users, links, and quick-read analytics mapping (e.g., total click tracking).

## 🚀 Deployment & Process Management

This application uses **BPM2** to manage background execution on production servers.

## 📖 API Specification

The detailed endpoints for authentication, link creation, and analytics tracking are fully documented. 

👉 *docs/*
