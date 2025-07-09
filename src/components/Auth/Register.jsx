
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import Input from '../UI/Input';
import SocialAuth from './SocialAuth';
import img from '../../assets/0.png';

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onRegister(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-md md:max-w-4xl">
        <div className="flex flex-col  md:flex-row h-full">
          
          <div className="w-full md:w-1/3 h-64 md:h-auto relative overflow-hidden">
            <img 
              src={img}
              alt="Fashion" 
              className="absolute w-full h-full object-cover"
            />
          </div>
          
          <div className="w-full  md:w-2/3 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
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
                label="Create a password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="must be a distraction"
                required
              />
              <Input
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="request password"
                required
              />
              
              <div className="flex justify-center mt-6">
                <Button 
                  type="submit" 
                  className="w-full md:w-3/4 px-6 py-3"
                >
                  Create Account
                </Button>
              </div>
            </form>
            
            <SocialAuth />
            <p className="mt-4 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;