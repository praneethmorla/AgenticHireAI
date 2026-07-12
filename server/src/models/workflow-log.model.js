import mongoose from "mongoose";

const workflowLogSchema = new mongoose.Schema(
  {
    workflow_id: { type: mongoose.Schema.Types.ObjectId, ref: "Workflow", required: true },
    agent_name: { type: String, required: true },
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    status: { type: String, enum: ["running", "success", "failed"], required: true },
    error: String,
    stack: String
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

workflowLogSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const WorkflowLog = mongoose.model("WorkflowLog", workflowLogSchema);
