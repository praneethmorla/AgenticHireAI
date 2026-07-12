import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    resume_url: { type: String, required: true },
    resume_path: { type: String, required: true },
    parsed_resume_json: { type: mongoose.Schema.Types.Mixed },
    match_score: { type: Number, default: 0 },
    ats_score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["applied", "processing", "waiting_approval", "shortlisted", "hold", "rejected", "interviewing", "completed", "failed"],
      default: "applied"
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

candidateSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Candidate = mongoose.model("Candidate", candidateSchema);
