import { useAuth } from "./AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Postpage from "./pages/Postpage";
import Dashboard from "./Hero";

function App() {
  const { user, authReady } = useAuth();

  if (!authReady) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        <Route path="/post/:id" element={<Postpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
