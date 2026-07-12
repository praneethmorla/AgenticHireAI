# AI Recruitment Organization

Spec-driven multi-agent recruitment platform with a Next.js frontend, Express backend, MongoDB, Qdrant-ready RAG services, and visual workflow monitoring.

## Structure

- `client/` - Next.js 15 App Router frontend
- `server/` - Express.js backend
- `specs/` - business rules, workflow definitions, prompts, and policies

## Quick Start

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Copy environment files:

   ```bash
   copy client\.env.example client\.env.local
   copy server\.env.example server\.env
   ```

3. Start MongoDB and Qdrant. Docker compose is provided for local services:

   ```bash
   docker compose up -d
   ```

4. Start the apps:

   ```bash
   npm run dev
   ```

Frontend: http://localhost:3000  
Backend: http://localhost:5000

## Local Flow

1. Sign up as a recruiter at `/signup`.
2. Create a job from `/dashboard/jobs/create`.
3. Open the public apply route `/jobs/[jobId]/apply`.
4. Upload a resume.
5. Watch workflow state in `/dashboard/workflows`.

All scoring, workflow steps, retries, RAG settings, and prompts are loaded from `specs/`.
