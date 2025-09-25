import './App.css';
/*router*/
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './components/login';
import SignUpScreen from './components/signup';
import ForgotPasswordScreen from './components/forgot-password';
function App() {
  return (
    <div className="App">
      <Router>
        <LoginScreen />
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/signup" element={<SignUpScreen/>} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen/>} />
      </Routes>
    </Router> 
    </div>
  );
}

export default App;
