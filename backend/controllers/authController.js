const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('Register attempt:', { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed, creating user...');

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    console.log('User created:', { id: user._id, email: user.email });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          _id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User found:', user ? { id: user._id, email: user.email } : null);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);

      if (isMatch) {
        res.json({
          token: generateToken(user._id),
          user: {
            _id: user.id,
            name: user.name,
            email: user.email
          }
        });
      } else {
        res.status(400).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };
