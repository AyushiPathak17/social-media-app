const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { register, login, createPost, getPosts, likePost, followUser } = require('./controllers');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); 

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Routes
app.post('/register', register);
app.post('/login', login);
app.post('/posts', authMiddleware, createPost);
app.get('/posts', getPosts);
app.post('/posts/:id/like', authMiddleware, likePost);
app.post('/users/:id/follow', authMiddleware, followUser);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
