import "./App.css";
import { AppRouter } from "./components/AppRouter";
import { AuthProvider } from "./context/auth/AuthContextProvider";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
