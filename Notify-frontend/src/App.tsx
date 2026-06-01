import "./assets/css/index.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Login from "./pages/login";
import NotLogedRoute from "./components/middleware/NotLogedRoute";
import ProtectedRoute from "./components/middleware/ProtectedRoute";
import Home from "./pages/Home";
import Upload from "./pages/Upload";

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
            path="/login"
            element={
              <NotLogedRoute>
                <Login />
              </NotLogedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute reqAuth="artist">
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
