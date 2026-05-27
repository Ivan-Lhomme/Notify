import "./assets/css/index.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Login from "./pages/login";
import NotLogedRoute from "./components/NotLogedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute reqAuth="user">
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute reqAuth="user">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <NotLogedRoute>
                <Login />
              </NotLogedRoute>
            }
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
