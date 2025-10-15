import { useEffect, useState } from "react";
import { Anchor, Box, MantineProvider, Text } from "@mantine/core";
import { ThemeProvider } from "styled-components";
import { NodeModal } from "./components/NodeModal";
import GlobalStyle from "./jsoncrack/constants/globalStyle";
import { darkTheme, lightTheme } from "./jsoncrack/constants/theme";
import { GraphView } from "./jsoncrack/features/editor/views/GraphView";
import useGraph from "./jsoncrack/features/editor/views/GraphView/stores/useGraph";
import useConfig from "./jsoncrack/store/useConfig";

function getTheme(): "light" | "dark" {
  const theme = document.body.getAttribute("data-vscode-theme-kind");
  if (theme?.includes("light")) return "light";
  return "dark";
}

const App: React.FC = () => {
  const [json, setJson] = useState(JSON.stringify(""));
  const selectedNode = useGraph(state => state.selectedNode);
  const toggleDarkMode = useConfig(state => state.toggleDarkMode);
  const [nodeModalOpened, setNodeModalOpened] = useState(false);
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    const vscode = window?.acquireVsCodeApi?.();
    vscode?.postMessage("ready");

    window.addEventListener("message", event => {
      const jsonData = event.data.json;
      setJson(jsonData);
    });

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const newTheme = getTheme();
      setTheme(newTheme);
      toggleDarkMode(newTheme === "dark");
      useGraph.getState().setGraph();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-vscode-theme-kind"],
    });

    return () => {
      observer.disconnect();
    };
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
          <NodeModal opened={nodeModalOpened} onClose={() => setNodeModalOpened(false)} />
        )}
        <Anchor
          pos="fixed"
          bottom={0}
          left={0}
          href="https://jsoncrack.com/editor?utm_source=vscode&utm_campaign=attribute"
          target="_blank"
        >
          <Box px="12" py="4" bg="dark">
            <Text fz="sm" c="white">
              Open Web Editor
            </Text>
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
