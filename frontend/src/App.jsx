import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import AuthRoutes from './AuthRoutes';
import Navbar from './Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <AuthRoutes />
      </AuthProvider>
    </Router>
  );
}
export default App;

