import mongoose from "mongoose";

const nodeStateSchema = new mongoose.Schema(
  {
    name: String,
    status: {
      type: String,
      enum: ["pending", "running", "success", "failed", "waiting_approval"],
      default: "pending"
    },
    retries: { type: Number, default: 0 },
    error: String,
    output: mongoose.Schema.Types.Mixed
  },
  { _id: false }
);

const workflowSchema = new mongoose.Schema(
  {
    candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    workflow_spec_id: { type: String, default: "default-hiring-workflow" },
    current_state: { type: String, default: "resume_parser" },
    status: {
      type: String,
      enum: ["pending", "running", "waiting_approval", "completed", "failed", "rejected"],
      default: "pending"
    },
    nodes: [nodeStateSchema],
    context: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

workflowSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Workflow = mongoose.model("Workflow", workflowSchema);
