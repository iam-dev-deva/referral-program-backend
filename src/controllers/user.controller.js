const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeleted = true;
    await user.save();

    res.json({ message: 'User soft-deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const generateReferralCode = (name) => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${name.slice(0, 3).toUpperCase()}${randomNum}`;
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, referralCode } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const newUser = new User({
      name,
      email,
      password,
      referralCode: generateReferralCode(name),
    });

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });

      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }

      if (referrer.email === email) {
        return res.status(400).json({ message: 'You cannot refer yourself' });
      }

      newUser.referrer = referrer._id;

      referrer.referrals.push(newUser._id);
      referrer.rewardPoints += 10;
      await referrer.save();
    }

    await newUser.save();

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        referralCode: newUser.referralCode,
      },
      token: generateToken(newUser._id),
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      rewardPoints: user.rewardPoints
    });
  } catch (err) {
    next(err);
  }
};
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

exports.getMyReferralInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('referrals', 'name email')
      .select('-password');

    res.json({
      referralCode: user.referralCode,
      rewardPoints: user.rewardPoints,
      referrals: user.referrals,
    });
  } catch (err) {
    next(err);
  }
};

exports.redeemReward = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.rewardPoints < 50) {
      return res.status(400).json({ message: 'Not enough points to redeem' });
    }

    user.rewardPoints -= 50;
    await user.save();

    res.json({ message: 'Reward redeemed successfully', rewardPoints: user.rewardPoints });
  } catch (err) {
    next(err);
  }
};

exports.checkAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    next(err);
  }
};