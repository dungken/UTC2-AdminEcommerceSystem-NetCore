// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/vendor/css/core.css';
import './assets/vendor/css/theme-default.css';
import './assets/css/demo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import ConfirmEmail from './components/Auth/ConfirmEmail';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './components/Security/ResetPassword';
import OAuthResponse from './components/Auth/OAuthResponse';
import SocialLogin from './components/Auth/SocialLogin';
import { AvatarProvider } from './context/AvatarContextType';
import ProductCategory from './components/Product/ProductCategory';
import ProductChildrentCategory from './components/Product/ProductChildrentCategory';
import HierarchyCategory from './components/Product/HierarchyCategory';
import SupportChat from './components/Support/SupportChat';
import PermissionListByCate from './components/Permission/PermissionList';
import PermissionList from './components/Permission/PermissionList';
import ProductList from './components/Product/ProductList';
import ProductListByCate from './components/Product/ProductListByCate';
import ProductManagement from './components/Product/ProductManagement';
import DiscountCodeManagement from './components/Product/DiscountCodeManagement';
import InventoryManagement from './components/Product/InventoryManagement';
import OrderManagementPage from './components/Order/OrderManagementPage';
import ProductDetail from './components/Product/ProductDetail';
import ProductFormEdit from './components/Product/ProductFormEdit';
import OrderDetail from './components/Order/OrderDetail';
import UserInfo from './components/UserProfile/UserInfo';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AvatarProvider>
          <ToastContainer />
          <Routes>
            <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/social-login" element={<AuthLayout><SocialLogin /></AuthLayout>} />
            <Route path="/oauth-response" element={<OAuthResponse />} />
            <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
            <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />

            <Route path="*" element={
              <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                  <Sidebar />
                  <div className="layout-page">
                    <Navbar />
                    <div className="content-wrapper">
                      <div className="container-xxl flex-grow-1 py-2 py-1">
                        <Routes>
                          {/* Protected routes */}
                          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                          <Route path="/user" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
                          <Route path="/customer" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
                          <Route path="/my-profile" element={<ProtectedRoute><AccountLayout><MyProfile /></AccountLayout></ProtectedRoute>} />
                          <Route path="/account-notification" element={<ProtectedRoute><AccountLayout><AccountNotification /></AccountLayout></ProtectedRoute>} />
                          <Route path="/account-connection" element={<ProtectedRoute><AccountLayout><AccountConnection /></AccountLayout></ProtectedRoute>} />
                          <Route path="/change-password" element={<ProtectedRoute><SecurityLayout><ChangePassword /></SecurityLayout></ProtectedRoute>} />
                          <Route path="/2fa" element={<ProtectedRoute><SecurityLayout><TwoStepsVerification /></SecurityLayout></ProtectedRoute>} />
                          <Route path="/role" element={<ProtectedRoute><RoleList /></ProtectedRoute>} />
                          <Route path="/permission" element={<ProtectedRoute><PermissionList /></ProtectedRoute>} />

                          {/* PRODUCT */}
                          <Route path="/product-category" element={<ProtectedRoute><ProductCategory /></ProtectedRoute>} />
                          <Route path="/product-list-by-category/:categoryId" element={<ProtectedRoute><ProductListByCate /></ProtectedRoute>} />
                          <Route path="/children-category/:parentCategoryId" element={<ProtectedRoute><ProductChildrentCategory /></ProtectedRoute>} />
                          <Route path="/hierarchy-category" element={<ProtectedRoute><HierarchyCategory /></ProtectedRoute>} />
                          <Route path="/product" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
                          <Route path="/product-detail/:productId" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                          <Route path="/product/create" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
                          <Route path="/product/edit/:productId" element={<ProtectedRoute><ProductFormEdit /></ProtectedRoute>} />
                          <Route path="/discount" element={<ProtectedRoute><DiscountCodeManagement /></ProtectedRoute>} />
                          <Route path="/inventory" element={<ProtectedRoute><InventoryManagement /></ProtectedRoute>} />

                          <Route path="/support" element={<ProtectedRoute><SupportChat /></ProtectedRoute>} />

                          <Route path="/order" element={<ProtectedRoute><OrderManagementPage /></ProtectedRoute>} />
                          <Route path="/order/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                          <Route path="/customer/:userId" element={<ProtectedRoute><UserInfo /></ProtectedRoute>} />
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
        </AvatarProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;