import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/loginForm/LoginForm";
import {
  PublicRoutes,
  PrivateRoutes,
} from "./utilities/protectedRoutes/authRoutes";
import HomePage from "./components/HomePage";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          {/* Private routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Route>

        {/* Public routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginForm />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
