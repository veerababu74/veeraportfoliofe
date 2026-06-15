import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Portfolio pages
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Chatbot widget
import ChatbotWidget from './components/ChatbotWidget';
import ConnectionLoader from './components/ConnectionLoader';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <ConnectionLoader />}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#1A1A2E',
            border: '1px solid rgba(46, 76, 245, 0.3)',
          },
        }}
      />
      {!isLoading && (
        <>
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
      )}
    </>
  );
}

export default App;
