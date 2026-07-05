import React from "react";
import { StudyPathNode } from "./StudyPathNode";
import type { StudyPathMode, StudyPathNodeState } from "../types";
import { Button } from "../ui/Button";

export interface StudyPathNodeData {
  id: string;
  order: number;
  state: StudyPathNodeState;
  title: string;
  subtitle: string;
}

export interface StudyPathProps {
  nodes: StudyPathNodeData[];
  mode: StudyPathMode;
  onModeChange?: (mode: StudyPathMode) => void;
  onSelectNode?: (id: string) => void;
}

/**
 * StudyPath (formerly "Study Tree" in early planning — renamed in the
 * approved Design System v1.0 because the visual language is a
 * straight vertical curriculum line, not a branching map).
 *
 * Product Reasoning: Guided Mode pre-selects a recommended order;
 * Free Mode removes that framing entirely. Crucially, BOTH modes
 * render the exact same node list and the exact same interactivity —
 * switching modes never disables or hides any node. This mirrors the
 * approved principle that the only thing "Guided" changes is emphasis,
 * never access.
 *
 * UX Reasoning: the mode toggle uses plain secondary/primary buttons,
 * not a "settings switch" buried in a menu — mode is a first-class,
 * always-visible choice, reinforcing user control (no game-like
 * "which world do you want to play in" framing).
 */
export function StudyPath({ nodes, mode, onModeChange, onSelectNode }: StudyPathProps) {
  return (
    <div>
      {onModeChange && (
        <div
          role="group"
          aria-label="Study Path mode"
          className="flex gap-2 mb-6"
        >
          <Button
            variant={mode === "guided" ? "primary" : "secondary"}
            size="sm"
            aria-pressed={mode === "guided"}
            onClick={() => onModeChange("guided")}
          >
            Guided Mode
          </Button>
          <Button
            variant={mode === "free" ? "primary" : "secondary"}
            size="sm"
            aria-pressed={mode === "free"}
            onClick={() => onModeChange("free")}
          >
            Free Mode
          </Button>
        </div>
      )}

      <ol aria-label="Study path" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {nodes.map((node, i) => (
          <li key={node.id}>
            <StudyPathNode
              order={node.order}
              state={node.state}
              title={node.title}
              subtitle={node.subtitle}
              isLast={i === nodes.length - 1}
              onSelect={onSelectNode ? () => onSelectNode(node.id) : undefined}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
