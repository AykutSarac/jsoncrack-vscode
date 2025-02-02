import { useEffect, useState } from "react";
import { Anchor, Box, MantineProvider, Text } from "@mantine/core";
import { ThemeProvider } from "styled-components";
import { NodeModal } from "./components/NodeModal";
import GlobalStyle from "./jsoncrack/constants/globalStyle";
import { darkTheme, lightTheme } from "./jsoncrack/constants/theme";
import { GraphView } from "./jsoncrack/features/editor/views/GraphView";
import useGraph from "./jsoncrack/features/editor/views/GraphView/stores/useGraph";

function getTheme() {
  const theme = document.body.getAttribute("data-vscode-theme-kind");
  if (theme?.includes("light")) return "light";
  return "dark";
}

const App: React.FC = () => {
  const [json, setJson] = useState(JSON.stringify(""));
  const selectedNode = useGraph(state => state.selectedNode);
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const [nodeModalOpened, setNodeModalOpened] = useState(false);
  const theme = getTheme();

  useEffect(() => {
    const vscode = window?.acquireVsCodeApi?.();
    vscode?.postMessage("ready");

    window.addEventListener("message", event => {
      const jsonData = event.data.json;
      setJson(jsonData);
    });
  }, []);

  useEffect(() => {
    if (selectedNode) setNodeModalOpened(true);
  }, [selectedNode]);

  return (
    <MantineProvider forceColorScheme={theme}>
      <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <GraphView json={json} isWidget={false} />
        <GlobalStyle />
        {selectedNode && (
          <NodeModal opened={nodeModalOpened} onClose={() => setSelectedNode(null)} />
        )}

        <Anchor
          pos="fixed"
          bottom={0}
          left={0}
          href="https://todiagram.com?utm_source=vscode&utm_campaign=attribute"
          target="_blank"
        >
          <Box px="12" py="4" bg="dark">
            <Text c="white">❤ ToDiagram</Text>
          </Box>
        </Anchor>
      </ThemeProvider>
    </MantineProvider>
  );
};

export default App;

declare global {
  interface Window {
    acquireVsCodeApi?: () => any;
  }
}
