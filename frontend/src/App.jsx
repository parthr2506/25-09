import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';
import AuthRoutes from './AuthRoutes';
import Navbar from './Navbar';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <AuthRoutes />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
