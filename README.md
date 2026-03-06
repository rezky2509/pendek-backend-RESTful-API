🔗 Pendek URL Shortener

A high-performance URL shortening service leveraging the Bun ecosystem and MongoDB. This project focuses on native speed, secure token-based access, and efficient identifier generation.
🛠️ Tech Stack

    Runtime: Bun (Fast all-in-one JavaScript runtime)

    Database: MongoDB (NoSQL)

    ORM: Mongoose

    Auth: Token-Based Authentication (JWT/Secure Headers)

    Hasher: Bun built-in hasher (Native utility for random URL generation)

🔑 Key Features

    Native Bun Hashing: Uses Bun crypto hasher to generate high-entropy, collision-resistant URL slugs without external dependencies.

    Secure API: Full token-based authentication flow to protect link creation and management.

    Mongoose Integration: Structured data modeling for URLs, click analytics, and user accounts.

    Optimized Performance: Minimal overhead by utilizing Bun's built-in HTTP server and cryptographic primitives.

📖 API Specification

You can view the api specification 👉 **[View API Specifications](./docs)**
