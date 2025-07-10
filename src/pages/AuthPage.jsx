import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/userSlice';
import { loginWithEmail, registerWithEmail } from '../firebase/auth';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const AuthPage = ({ type = 'login' }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async (authFn, email, password, customError) => {
    setIsLoading(true);
    setError('');
    try {
      const user = await authFn(email, password);
      dispatch(signInSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0]
      }));
      navigate('/');
    } catch (err) {
      setError(customError || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (email, password) => {
    handleAuth(loginWithEmail, email, password);
  };

  const handleRegister = (email, password, customError) => {
    if (customError) {
      setError(customError);
      setIsLoading(false);
      return;
    }
    handleAuth(registerWithEmail, email, password);
  };

  return (
    <div>
      {type === 'login' ? (
        <Login 
          onLogin={handleLogin} 
          error={error} 
          isLoading={isLoading} 
        />
      ) : (
        <Register 
          onRegister={handleRegister} 
          error={error} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
};

export default AuthPage;