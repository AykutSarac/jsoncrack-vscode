import React from "react";
import { Graph } from "./components/Graph";
import useGraph from "./hooks/store/useGraph";
import { parser } from "./utils/jsonParser";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "./constants/theme";
import GlobalStyle from "./constants/globalStyle";
import { NodeModal } from "./containers/Modals/NodeModal";

const isWidget = false;

const App: React.FC = () => {
  const setGraphValue = useGraph((state) => state.setGraphValue);

  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<[string, string][]>(
    []
  );

  const openModal = React.useCallback(() => setModalVisible(true), []);

  const collapsedNodes = useGraph((state) => state.collapsedNodes);
  const collapsedEdges = useGraph((state) => state.collapsedEdges);

  React.useEffect(() => {
    const nodeList = collapsedNodes.map((id) => `[id$="node-${id}"]`);
    const edgeList = collapsedEdges.map((id) => `[class$="edge-${id}"]`);

    const hiddenItems = document.querySelectorAll(".hide");
    hiddenItems.forEach((item) => item.classList.remove("hide"));

    if (nodeList.length) {
      const selectedNodes = document.querySelectorAll(nodeList.join(","));
      const selectedEdges = document.querySelectorAll(edgeList.join(","));

      selectedNodes.forEach((node) => node.classList.add("hide"));
      selectedEdges.forEach((edge) => edge.classList.add("hide"));
    }
  }, [collapsedNodes, collapsedEdges]);

  React.useEffect(() => {
    window.addEventListener("message", (event) => {
      const jsonData = event.data.json;
      const { nodes, edges } = parser(jsonData);

      setGraphValue("nodes", nodes);
      setGraphValue("edges", edges);
    });
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <Graph
        openModal={openModal}
        setSelectedNode={setSelectedNode}
        isWidget={isWidget}
      />
      {!isWidget && (
        <NodeModal
          selectedNode={selectedNode}
          visible={isModalVisible}
          closeModal={() => setModalVisible(false)}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
