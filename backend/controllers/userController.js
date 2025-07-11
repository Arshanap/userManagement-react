import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from '../utils/generateToken.js'


// auth user/set token
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; 

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
    });
  } else {
    res.status(400);
    throw new Error('Invalid email and password');
  }
});



// register a new user
const registerUser = asyncHandler(async (req,res)=>{
    const { name, email, password} = req.body;

    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400);
        throw new Error('User alread exists.....');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if(user){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    }else{
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// logout user
const logoutUser = asyncHandler(async (req,res)=>{

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: "user logged out"})
});

// get user profile
const getUserProfile = asyncHandler(async (req,res)=>{
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    };

    res.status(200).json(user)
});

// update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// get users to dashboard
const getUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const users = await User.find({ ...keyword });
  res.json(users);
});

// @desc    Delete user (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID (admin only)
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user by admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const createUserByAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin: isAdmin || false,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});




export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUserByAdmin,
  createUserByAdmin
};