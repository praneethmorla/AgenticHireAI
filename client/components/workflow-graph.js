"use client";

import { ReactFlow, Background, Controls } from "@xyflow/react";

const colors = {
  running: "#2563eb",
  success: "#16a34a",
  failed: "#dc2626",
  waiting_approval: "#ca8a04",
  pending: "#94a3b8"
};

export function WorkflowGraph({ workflow }) {
  const nodes = (workflow?.nodes || []).map((node, index) => ({
    id: node.name,
    position: { x: 40 + index * 180, y: index % 2 === 0 ? 70 : 170 },
    data: { label: `${node.name.replaceAll("_", " ")} (${node.retries || 0})` },
    style: {
      border: `2px solid ${colors[node.status] || colors.pending}`,
      color: "#0f172a",
      background: "#fff",
      minWidth: 150
    }
  }));

  const edges = nodes.slice(1).map((node, index) => ({
    id: `${nodes[index].id}-${node.id}`,
    source: nodes[index].id,
    target: node.id,
    animated: workflow?.current_state === node.id,
    style: { stroke: "#64748b" }
  }));

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-lg border border-border bg-white">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
