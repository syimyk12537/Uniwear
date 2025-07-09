
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import Input from '../UI/Input';
import SocialAuth from './SocialAuth';
import img from '../../assets/0.png';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-md md:max-w-4xl">
        <div className="flex flex-col md:flex-row h-full">
       
          <div className="w-full md:w-1/3 h-64 md:h-auto relative overflow-hidden">
            <img 
              src={img}
              alt="Fashion"
              className="absolute w-full h-full object-cover"
            />
          </div>
          
          <div className="w-full md:w-2/3 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
            <form onSubmit={handleSubmit}>
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              
              <div className="flex justify-center mt-15">
                <Button 
                  type="submit" 
                  className="w-full md:w-3/4 px-6 py-3"
                >
                  Login
                </Button>
              </div>
            </form>
            
            <SocialAuth />
            <p className="mt-4 text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-black font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;