import React from "react";
import { Graph } from "jsoncrack-react";
import { NodeModal } from "./components/NodeModal";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const vscode = acquireVsCodeApi();

function getTheme() {
  const theme = document.body.getAttribute("data-vscode-theme-kind");
  if (theme?.includes("light")) return "light";
  return "dark";
}

const App: React.FC = () => {
  const [json, setJson] = React.useState("");
  const [selectedNode, setSelectedNode] = React.useState<NodeData | null>(null);

  React.useEffect(() => {
    vscode.postMessage("ready");

    window.addEventListener("message", (event) => {
      const jsonData = event.data.json;
      setJson(jsonData);
    });
  }, []);

  return (
    <>
      <Graph
        json={json}
        onNodeClick={setSelectedNode}
        layout={{ theme: getTheme() }}
        style={{
          height: "100vh",
          width: "100%",
        }}
      />
      {selectedNode && (
        <NodeModal
          selectedNode={selectedNode as NodeData}
          close={() => setSelectedNode(null)}
        />
      )}
    </>
  );
};

export default App;
