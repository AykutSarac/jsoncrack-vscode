import React from "react";
import type { NodeData } from "../jsoncrack/types/graph";

interface ModalProps {
  selectedNode: NodeData;
  close: () => void;
}

const dataToString = (data: any) => {
  const text = Array.isArray(data) ? Object.fromEntries(data) : data;
  const replacer = (_: string, v: string) => {
    if (typeof v === "string") return v.replaceAll('"', "");
    return v;
  };

  return JSON.stringify(text, replacer, 2);
};

export const NodeModal: React.FC<ModalProps> = ({ selectedNode, close }) => {
  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100%",
        background: "rgba(0, 0, 0, 0.428)",
      }}
      onClick={close}
    >
      <div
        style={{
          maxWidth: "85%",
          maxHeight: "80%",
          width: "400px",
          height: "fit-content",
          overflow: "auto",
          background: "var(--vscode-input-background)",
          color: "var(--vscode-input-foreground)",
          padding: "10px",
          borderRadius: "4px",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div>Content</div>
        <textarea
          value={dataToString(selectedNode.text)}
          style={{
            boxSizing: "border-box",
            width: "100%",
            color: "var(--vscode-input-foreground)",
            marginTop: "4px",
            background: "rgba(0, 0, 0, 0.4)",
            whiteSpace: "pre-wrap",
            overflowX: "auto",
            padding: "8px",
            borderRadius: "4px",
            marginBottom: "20px",
            outline: "none",
          }}
          rows={14}
          readOnly
        />
        <div>Path</div>
        <textarea
          value={selectedNode.path}
          style={{
            boxSizing: "border-box",
            width: "100%",
            marginTop: "4px",
            background: "rgba(0, 0, 0, 0.4)",
            overflowX: "auto",
            padding: "8px",
            borderRadius: "4px",
            outline: "none",
            color: "var(--vscode-input-foreground)",
          }}
          rows={1}
          readOnly
        />
      </div>
    </div>
  );
};
