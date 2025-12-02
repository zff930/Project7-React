import "../styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "./HomePage";
import SignUp from "./SignUpPage";
import LogIn from "./LogInPage";
import PostPage from "./PostPage";
import Profile from "./ProfilePage";

function App() {
  return (
    // Enable React Router to track the URL in the browser and render the correct component for each path.
    <Router>
      <Routes>
        // When the user visits /, the Home component is rendered.
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// To be rendered in index.js
export default App;
