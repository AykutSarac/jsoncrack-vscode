import React from "react";
import { GraphView } from "./jsoncrack/features/editor/views/GraphView";
import { NodeModal } from "./components/NodeModal";
import { MantineProvider } from "@mantine/core";
import GlobalStyle from "./jsoncrack/constants/globalStyle";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./jsoncrack/constants/theme";

function getTheme() {
  const theme = document.body.getAttribute("data-vscode-theme-kind");
  if (theme?.includes("light")) return "light";
  return "dark";
}

const App: React.FC = () => {
  const [json, setJson] = React.useState("");
  const [selectedNode, setSelectedNode] = React.useState<NodeData | null>(null);
  const theme = getTheme();

  React.useEffect(() => {
    const vscode = window?.acquireVsCodeApi?.();

    vscode?.postMessage("ready");

    window.addEventListener("message", (event) => {
      const jsonData = event.data.json;
      setJson(jsonData);
    });
  }, []);

  return (
    <MantineProvider forceColorScheme={theme}>
      <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <GraphView json={json} isWidget={false} />
        <GlobalStyle />
        {selectedNode && (
          <NodeModal
            selectedNode={selectedNode as NodeData}
            close={() => setSelectedNode(null)}
          />
        )}
      </ThemeProvider>
    </MantineProvider>
  );
};

export default App;
