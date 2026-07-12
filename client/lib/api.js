const isProd = typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
const API_URL = process.env.NEXT_PUBLIC_API_URL || (isProd ? "https://agentic-hire-backend.onrender.com" : "http://localhost:5001");

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

async function request(path, options = {}) {
  const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message || "Request failed");
  }

  return payload.data;
}

export const api = {
  signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  jobs: () => request("/jobs"),
  job: (id) => request(`/jobs/${id}`),
  createJob: (body) => request("/jobs", { method: "POST", body: JSON.stringify(body) }),
  candidates: () => request("/candidates"),
  workflows: () => request("/workflow"),
  workflow: (id) => request(`/workflow/${id}`),
  approveWorkflow: (body) => request("/workflow/approve", { method: "POST", body: JSON.stringify(body) }),
  retryWorkflow: (body) => request("/workflow/retry", { method: "POST", body: JSON.stringify(body) }),
  uploadCandidate: (formData) => request("/candidates/upload", { method: "POST", body: formData })
};
