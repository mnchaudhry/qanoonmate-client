# QanoonMate V1.0 Architecture Documentation

## Overview
QanoonMate is a legal technology platform for the Pakistani market, connecting clients with lawyers and providing AI-powered legal assistance. This document captures the state of the application before a major structural overhaul.

## 🛠 Tech Stack

### Frontend (qanoonmate-client)
- **Framework:** Next.js 15 (App Router), React 19
- **State Management:** Redux Toolkit + Redux Persist
- **Styling:** Tailwind CSS 4, Framer Motion
- **Communication:** Socket.io-client, Axios
- **Editor:** Lexical, EditorJS, MDXEditor
- **Forms:** React Hook Form + Zod

### Backend (qanoonmate-server)
- **Runtime:** Node.js (ESM)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose), Pinecone (Vector DB), Redis
- **AI:** Google Generative AI, OpenAI Agents
- **Task Queue:** BullMQ
- **Real-time:** Socket.io

---

## 📁 Project Structure (V1)

### `qanoonmate-server/src/features` (Modular Monolith)
The backend follows a domain-driven feature structure:
- `auth/`: JWT, 2FA, session management.
- `consultation/`: Booking, notifications, and management.
- `ai/` & `model/`: AI session logic and model interactions.
- `lawyer/` & `client/`: Profile and dashboard specific logic.
- `payment/` & `payouts/`: Stripe integration and financial transactions.
- `caselaw/` & `acts/`: Legal database management with Pinecone.

### `qanoonmate-client/app` (Role-Based Routing)
- `(LandingPage)`: Marketing and SEO-optimized public pages.
- `(Gated)/(Client)`: Dashboard and tools for clients.
- `(Gated)/(Lawyer)`: Practice management for lawyers.
- `(Gated)/(Admin)`: System-wide control and monitoring.
- `(Auth)`: Login and registration flows.

---

## 🚀 Key Achievements in V1.0
1. **Modular Feature Architecture:** Clean separation of business logic on the backend.
2. **AI Integration:** RAG-based legal assistance using Pinecone and Gemini.
3. **Real-time Collaboration:** WebSocket-based chat and status updates.
4. **Financial Infrastructure:** Comprehensive payment and payout system with wallet support.
5. **Practice Management:** Full booking and calendar system for lawyers.

## 📌 Snapshot Info
- **Date:** 2026-02-15
- **Status:** Functional, Feature-Rich
- **Reason for Change:** Structural restructuring to optimize for [User's next goal].
