import "../styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './HomePage';
import SignUp from './SignUpPage';
import LogIn from './LogInPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </Router>
  );
}

export default App;
