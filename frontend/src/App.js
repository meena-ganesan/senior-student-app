import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardStudent from './pages/DashboardStudent';
import DashboardSenior from './pages/DashboardSenior';
import ChoreListPage from './pages/ChoreListPage';
import ChoreDetailPage from './pages/ChoreDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// CSS
import './App.css';

function App() {
  const { currentUser, userType } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const DashboardRouter = () => {
    if (userType === 'student') {
      return <DashboardStudent />;
    } else if (userType === 'senior') {
      return <DashboardSenior />;
    }
    return <Navigate to="/login" />;
  };

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } />

          <Route path="/chores" element={
            <ProtectedRoute>
              <ChoreListPage />
            </ProtectedRoute>
          } />

          <Route path="/chores/:id" element={
            <ProtectedRoute>
              <ChoreDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
