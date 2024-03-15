import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/loginForm/LoginForm";
import {
  PublicRoutes,
  PrivateRoutes,
} from "./utilities/protectedRoutes/authRoutes";
import HomePage from "./components/HomePage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" exact element={<HomePage />} />
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginForm />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
