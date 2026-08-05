import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        
        {/* The Authentication Route */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* The Main IDE Route */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;