# Real-Time Collaborative Document Editor

This is a full-stack collaborative document editing platform, similar to **Google Docs**, built using **Next.js** and **Node.js**, with **MongoDB** as the database. It enables users to create, edit, and share documents with friends, allowing multiple users to work on the same document simultaneously. Real-time synchronization of changes is powered by **WebSockets**.

## Why This Platform?

In today's remote work and study environments, seamless collaboration on documents is essential. Traditional document-sharing methods often result in version conflicts and inefficiencies. This platform solves these problems by providing **real-time collaborative editing**, allowing multiple users to work on a document simultaneously, with all changes reflected instantly for everyone involved. 

It is ideal for team projects, brainstorming sessions, and academic collaborations where real-time input is crucial.

## Features

### User Panel

- User authentication and account management.
- Create and edit documents.
- Share documents with friends via a unique link.
- Real-time synchronization using **WebSockets**.
- Email verification using **Resend**.

## Tech Stack

- **Frontend:** Next.js, TypeScript, ShadCN UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** NextAuth.js
- **Email Verification:** Resend
- **Real-time Data Sharing:** WebSockets

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+ recommended)
- **MongoDB** (Local or Atlas)

### Steps to Run Locally

1. Clone the repository:

2. Install dependencies:

3. Set up environment variables by creating a `.env` file:

4. Start the development server:

   The app will be available at [http://localhost:3000](http://localhost:3000)

## Development Roadmap

- Improve document history and version control.
- Enhance the user interface and editor features.
- Implement role-based permissions for document access.

## Contributing

Feel free to contribute by opening an issue or submitting a pull request.
