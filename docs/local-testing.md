# Local Testing Flow

Use the app as each actor:

1. Recruiter signs up at `http://localhost:3000/signup`.
2. Recruiter creates a job at `http://localhost:3000/dashboard/jobs/create`.
3. Candidate opens the generated public route at `http://localhost:3000/jobs/[jobId]/apply`.
4. Candidate uploads a PDF resume.
5. The backend automatically starts the workflow.
6. Recruiter monitors and approves the workflow at `http://localhost:3000/dashboard/workflows`.

The candidate routes are public. Dashboard routes are protected by JWT auth.
