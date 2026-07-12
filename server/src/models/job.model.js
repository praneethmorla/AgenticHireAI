import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    required_skills: [{ type: String, required: true }],
    preferred_skills: [{ type: String }],
    min_experience: { type: Number, required: true, min: 0 },
    workflow_spec_id: { type: String, default: "default-hiring-workflow" },
    hiring_spec_id: { type: String, default: "frontend-developer" },
    recruiter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

jobSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Job = mongoose.model("Job", jobSchema);
