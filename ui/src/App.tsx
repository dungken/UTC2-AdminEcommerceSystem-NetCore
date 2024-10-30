import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserProfile from './components/UserProfile/UserProfile';
import Settings from './components/Settings/Settings';
import Login from './components/Login/Login';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import LayoutContainer from './components/LayoutContainer/LayoutContainer';
import Dashboard from './components/Dashboard/Dashboard';
import Menu from './components/Menu/Menu';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated && <Menu />}
      <LayoutContainer>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute redirectTo="/login" />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            {/* Add more routes as needed */}
          </Route>
        </Routes>
      </LayoutContainer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;