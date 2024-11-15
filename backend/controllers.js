// controllers.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Post = require('./models/Post');

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Both fields are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Post content is required' });
  }

  try {
    const newPost = new Post({ user: req.userId, content });
    await newPost.save();

    res.json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username email');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    post.likes.push(req.userId);
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Follow a user
exports.followUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userToFollow = await User.findById(id);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.userId);
    if (currentUser.following.includes(id)) {
      return res.status(400).json({ message: 'You already follow this user' });
    }

    currentUser.following.push(id);
    await currentUser.save();

    res.json(currentUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
