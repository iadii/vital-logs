import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogDetail from './pages/BlogDetail';
import AuthSuccess from './pages/AuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import Profile from './pages/Profile';
import About from './pages/About';
import Privacy from './pages/Privacy';
import ScrollToTop from './components/ScrollToTop';

import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

const MainLayout = () => {
  const location = useLocation();
  const { loading } = useAuth();
  const isFullPageRoute = ['/', '/login', '/dashboard', '/create', '/profile'].includes(location.pathname) || location.pathname.startsWith('/blog/');

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="large" />
        <p className="text-zinc-500 font-serif italic text-sm animate-pulse">Synchronizing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans antialiased text-zinc-100 selection:bg-white selection:text-black">
      <div className="grid-bg" />
      <ScrollToTop />
      <Navbar />
      <main className={isFullPageRoute ? 'w-full' : 'pt-24 pb-12 px-4 w-full max-w-7xl mx-auto'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blog/:id/edit" 
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/blog/:id" 
            element={
              <ProtectedRoute>
                <BlogDetail />
              </ProtectedRoute>
            } 
          />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#18181b', // zinc-900
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            padding: '12px 24px',
            fontSize: '14px',
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: '0.05em',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#18181b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <MainLayout />
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;
