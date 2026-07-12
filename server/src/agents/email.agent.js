import { Resend } from "resend";
import { loadSpec } from "../utils/spec-loader.js";

function render(template, values) {
  return template.replaceAll("{{candidateName}}", values.candidateName).replaceAll("{{jobTitle}}", values.jobTitle);
}

export async function runEmailAgent({ candidate, job, shortlisting }) {
  const templates = await loadSpec("specs/email/templates.json");
  const selected = shortlisting.status === "rejected" ? templates.rejection : templates.interview;
  const message = {
    to: candidate.email,
    subject: render(selected.subject, { candidateName: candidate.name, jobTitle: job.title }),
    body: render(selected.body, { candidateName: candidate.name, jobTitle: job.title })
  };

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Recruitment <onboarding@resend.dev>",
      to: message.to,
      subject: message.subject,
      text: message.body
    });
  }

  return { success: true, data: { sent: Boolean(process.env.RESEND_API_KEY), message } };
}
