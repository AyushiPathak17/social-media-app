import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Register = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // To show success message
  const navigate = useNavigate(); // To redirect the user to login page

  const handleRegister = async (e) => {
    e.preventDefault();

    // Simple validation to ensure fields are filled
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password,
      });

      setToken(response.data.token); // Set the token (if you want to auto-login, else you can skip this)
      localStorage.setItem('token', response.data.token); // Store token in local storage
      setError('');  // Clear error message on success
      setSuccessMessage('Registration successful! Redirecting to login...');

      // Redirect to the login page after a short delay
      setTimeout(() => {
        navigate('/login'); // Redirect to the login page
      }, 2000); // Redirect after 2 seconds to give user time to see the success message

    } catch (err) {
      console.error(err);
      // If the error comes from the server, display it
      if (err.response) {
        setError(err.response.data.message || 'Failed to register');
      } else {
        setError('Network error, please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center p-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Register</h2>

        {/* Display error or success messages */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? 
            <a href="/login" className="text-blue-600 hover:text-blue-700"> Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
