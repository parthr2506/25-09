import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import AuthRoutes from './AuthRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthRoutes />
      </AuthProvider>
    </Router>
  );
}
export default App;

