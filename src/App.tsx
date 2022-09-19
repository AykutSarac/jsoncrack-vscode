import React from "react";
import { ThemeProvider } from "styled-components";
import { Graph } from "./jc-root/src/components/Graph";
import GlobalStyle from "./jc-root/src/constants/globalStyle";
import { darkTheme } from "./jc-root/src/constants/theme";
import useGraph from "./jc-root/src/hooks/store/useGraph";
import { parser } from "./jc-root/src/utils/jsonParser";

const App: React.FC = () => {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<[string, string][]>(
    []
  );
  const setGraphValue = useGraph((state) => state.setGraphValue);

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
        openModal={() => setModalVisible(true)}
        setSelectedNode={setSelectedNode}
        isWidget={false}
      />
    </ThemeProvider>
  );
};

export default App;
