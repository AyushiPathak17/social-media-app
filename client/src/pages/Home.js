import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([]); // To track followed users

  // Directly getting userId from localStorage
  const userId = localStorage.getItem('userId');

  // Fetch posts
  useEffect(() => {
    const storedToken = token || localStorage.getItem('token');

    if (storedToken) {
      axios
        .get('http://localhost:5000/posts', {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          setPosts(response.data);
          setError('');
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load posts');
        });
    }
  }, [token]);

  // Handle creating a post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    const storedToken = token || localStorage.getItem('token');

    try {
      const response = await axios.post(
        'http://localhost:5000/posts',
        { content },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setPosts([response.data, ...posts]); // Add the new post at the beginning of the posts list
      setContent(''); // Clear content after posting
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError('Failed to create post');
      setLoading(false);
    }
  };

  // Handle liking a post
  const handleLikePost = async (postId) => {
    const storedToken = token || localStorage.getItem('token');

    try {
      const response = await axios.post(
        `http://localhost:5000/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      const updatedPosts = posts.map((post) =>
        post._id === postId ? { ...post, likes: response.data.likes } : post
      );
      setPosts(updatedPosts); // Update the likes for the post
    } catch (err) {
      console.log(err);
      setError('Failed to like the post');
    }
  };

  // Handle following a user
  const handleFollowUser = async (userIdToFollow) => {
    const storedToken = token || localStorage.getItem('token');

    try {
      // Check if the user is already followed
      if (followedUsers.includes(userIdToFollow)) {
        setError('You are already following this user');
        return; // Do not proceed if already following
      }

      const response = await axios.post(
        `http://localhost:5000/users/${userIdToFollow}/follow`,
        {},
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      console.log(response.data);
      setError('');
      setFollowedUsers((prevState) => [...prevState, userIdToFollow]); // Add to followed users list
    } catch (err) {
      console.log(err);
      setError('Failed to follow user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 p-4 rounded-lg shadow-md mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Social Media App</h1>
          <div className="flex space-x-6">
            <Link
              to="/login"
              className="text-white hover:text-teal-100 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white hover:text-teal-100 transition-all duration-300"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6 mb-12">
        {/* Welcome heading with colorful gradient text */}
        <h2 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          Welcome to the Social Media App
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 transition-all duration-300">{error}</p>
        )}

        {/* Create Post Section */}
        <div className="bg-white shadow-xl rounded-lg p-6 mb-6 transition-all hover:scale-105 hover:shadow-2xl transform duration-300">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">Create a Post</h3>
          <form onSubmit={handleCreatePost}>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-md mb-4 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              required
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 text-white rounded-md transition-colors duration-300 ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>

        {/* Display Posts */}
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white shadow-xl rounded-lg p-6 mb-6 transition-all hover:scale-105 hover:shadow-2xl transform duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  {/* Ensure post.user exists and has a username */}
                  <h3 className="text-lg font-semibold">{post.user?.username || 'Anonymous'}</h3>
                  <span className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mb-4 text-gray-700">{post.content}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">{post.likes.length} likes</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLikePost(post._id)}
                      className={`text-sm font-semibold py-2 px-4 rounded-md transition-all duration-300 ${
                        post.likes.includes(userId)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {post.likes.includes(userId) ? 'Unlike' : 'Like'}
                    </button>
                    <button
                      onClick={() => handleFollowUser(post.user._id)} // Follow the user who created the post
                      disabled={followedUsers.includes(post.user._id)} // Disable the button if already followed
                      className={`text-sm font-semibold py-2 px-4 rounded-md ${
                        followedUsers.includes(post.user._id)
                          ? 'bg-gray-400 text-white'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      } transition-all duration-300`}
                    >
                      {followedUsers.includes(post.user._id) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
