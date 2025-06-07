import "./App.css";
import { Router } from "./components/Router";
import { AuthProvider } from "./context/auth/AuthContextProvider";
import { UserProvider } from "./context/user/UserContext";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router />
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
