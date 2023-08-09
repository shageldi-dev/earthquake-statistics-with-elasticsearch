import { useSelector } from "react-redux";
import "./App.css";
import PageRoutes from "./routes/PageRoutes";
import { theme, ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";
import { RootState } from "./store";
import { darkTheme, lightTheme } from "./styles/theme";

const { defaultAlgorithm, darkAlgorithm } = theme;
const queryClient = new QueryClient();
function App() {
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: currentTheme === "dark" ? darkAlgorithm : defaultAlgorithm,
          ...(currentTheme === "dark" ? darkTheme : lightTheme),
        }}
      >
        <QueryClientProvider client={queryClient}>
          <PageRoutes />
        </QueryClientProvider>
      </ConfigProvider>
    </>
  );
}

export default App;
