import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/userSlice';
import { loginWithEmail, registerWithEmail } from '../firebase/auth';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const AuthPage = ({ type = 'login' }) => {
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const user = await loginWithEmail(email, password);
      dispatch(signInSuccess(user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const user = await registerWithEmail(email, password);
      dispatch(signInSuccess(user));
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {type === 'login' ? (
        <Login onLogin={handleLogin} error={error} />
      ) : (
        <Register onRegister={handleRegister} error={error} />
      )}
    </div>
  );
};

export default AuthPage;