import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/loginForm/LoginForm";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </>
  );
}

export default App;
