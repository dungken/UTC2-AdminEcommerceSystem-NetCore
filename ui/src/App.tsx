// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/vendor/css/core.css';
import './assets/vendor/css/theme-default.css';
import './assets/css/demo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Dashboard from './components/Pages/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Security/ForgotPassword';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import Navbar from './components/Layout/Navbar';
import AuthLayout from './components/Layout/AuthLayout';
import MyProfile from './components/Account/MyProfile';
import AccountNotification from './components/Account/AccountNotification';
import AccountConnection from './components/Account/AccountConnection';
import AccountLayout from './components/Layout/AccountLayout';
import SecurityLayout from './components/Layout/SecurityLayout';
import ChangePassword from './components/Security/ChangePassword';
import TwoStepsVerification from './components/Security/TwoStepsVerification';
import UserList from './components/User/UserList';
import RoleList from './components/Role/RoleList';
import PermissionList from './components/Permission/PermissionList';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
          <Route path="*" element={
            <div className="layout-wrapper layout-content-navbar">
              <div className="layout-container">
                <Sidebar />
                <div className="layout-page">
                  <Navbar />
                  <div className="content-wrapper">
                    <div className="container-xxl flex-grow-1 container-p-y">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users" element={<UserList />} />
                        <Route path="/my-profile" element={<AccountLayout><MyProfile /></AccountLayout>} />
                        <Route path="/account-notification" element={<AccountLayout><AccountNotification /></AccountLayout>} />
                        <Route path="/account-connection" element={<AccountLayout><AccountConnection /></AccountLayout>} />
                        <Route path="/change-password" element={<SecurityLayout><ChangePassword /></SecurityLayout>} />
                        <Route path="/2fa" element={<SecurityLayout><TwoStepsVerification /></SecurityLayout>} />
                        <Route path="/roles" element={<RoleList />} />
                        <Route path="/permissions" element={<PermissionList />} />
                        {/* Add other routes here */}
                      </Routes>
                    </div>
                    <Footer />
                  </div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;