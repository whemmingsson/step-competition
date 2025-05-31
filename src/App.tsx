import "./App.css";
import { AppRouter } from "./components/AppRouter";
import { AuthProvider } from "./context/auth/AuthContextProvider";
import { UserProvider } from "./context/user/UserContext";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
