import "../styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from '../components/ProtectedRoute';
import Home from "./HomePage";
import SignUp from "./SignUpPage";
import LogIn from "./LogInPage";
import Profile from "./ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
