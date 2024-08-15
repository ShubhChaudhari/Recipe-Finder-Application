const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../model/user");
const verifyToken = require('../middleware/auth');

router.post("/signup", async (req, res) => {
console.log('req.body', req.body)

  try {
    const existingUser = await User.findOne({ email : req.body.email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    console.log('salt', salt)
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    console.log('hashPassword', hashPassword)

    const newUser = new User({ ...req.body, password: hashPassword });
    console.log('newUser', newUser)
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Please check Email' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Please check Password" });
    }

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );


    res.status(200).json({ user, token }); // Send role upon successful login
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/verify', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Welcome to the home page', user: req.user });
});

module.exports = router;
