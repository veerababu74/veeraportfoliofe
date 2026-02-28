import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Portfolio pages
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Chatbot widget
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A3E',
            color: '#fff',
            border: '1px solid rgba(108, 99, 255, 0.3)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* Chatbot widget on all public pages */}
      <ChatbotWidget />
    </>
  );
}

export default App;
