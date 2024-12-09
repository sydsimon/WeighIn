import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreatePoll from './pages/CreatePoll';
import PollPage from './pages/PollPage';
import LandingPage from './pages/LandingPage';
import { useAuth } from './AuthContext';

// Create a wrapper component for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/landing" />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/create-poll" element={
            <ProtectedRoute>
              <CreatePoll />
            </ProtectedRoute>
          } />
          <Route path="/poll/:id" element={
            <ProtectedRoute>
              <PollPage />
            </ProtectedRoute>
          } />

          {/* Redirect root to landing if not logged in, home if logged in */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;