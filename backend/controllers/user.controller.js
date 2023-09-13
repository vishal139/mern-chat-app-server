import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import generateJwtTokenForUser from "../utils/generateJwtToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, image } = req.body;

  const userExist = await User.findOne({ email: email });

  if (userExist) {
    res.status(400);
    throw new Error("User already Exists");
  }

  const newUser = await User.create({
    name,
    email,
    password,
    image,
  });

  if (newUser) {
    const token = generateJwtTokenForUser(newUser._id);
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Faild to creat user");
  }
});

export const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExist = await User.findOne({ email: email });

  if (userExist && (await userExist.matchPassword(password))) {
    res.status(201).json({
      _id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      image: userExist.image,
      token: generateJwtTokenForUser(userExist._id),
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});

export const getAllUser = asyncHandler(async (req, res) => {
  const keyword = req.query?.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};


    const users = await User.find(keyword);
    // const users = await User.find({keyword}).find({_id: {$ne: req.user._id}});

    res.status(201).json(users)
});
