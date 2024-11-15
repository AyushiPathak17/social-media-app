import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For redirecting after login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      setToken(res.data.token); // Save the token
      localStorage.setItem('token', res.data.token); // Store the token in localStorage
      setError('');  // Clear any previous error message
      navigate('/'); // Redirect to the homepage
    } catch (err) {
      console.log(err);
      if (err.response) {
        setError(err.response.data.message || 'Failed to login');
      } else {
        setError('Network error, please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center p-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 text-white rounded-md hover:bg-gradient-to-r hover:from-teal-500 hover:via-blue-600 hover:to-indigo-700 focus:outline-none"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? 
            <a href="/register" className="text-blue-600 hover:text-blue-700"> Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
