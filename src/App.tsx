import React from "react";
import { Graph } from "./components/Graph";
import useGraph from "./hooks/store/useGraph";
import { parser } from "./utils/jsonParser";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./constants/theme";
import GlobalStyle from "./constants/globalStyle";

const App: React.FC = () => {
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
      <Graph isWidget openModal={() => {}} setSelectedNode={() => {}} />
    </ThemeProvider>
  );
};

export default App;
