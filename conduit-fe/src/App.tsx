import AppRouter from "@/router/route";
import ErrorBoundary from "./provider/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
};

export default App;
