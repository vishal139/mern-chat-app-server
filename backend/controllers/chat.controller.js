import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Chat from "../models/ChatModel.js";

export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("userId param not set with request");
    return res.status(400);
  }

  console.log({ userId, myId: req.user._id });

  const chatPresent = await Chat.find({
    isGroupChat: false,
    $and: [{ users: { $eq: userId } }, { users: { $eq: req.user._id } }],
  })
    .populate("users", "-password")
    .populate("latestMsg");

  const chatData = await User.populate(chatPresent, {
    path: "latestMsg.sender",
    select: "name image email",
  });

  if (chatData.length > 0) {
    res.status(200).json(chatData[0]);
  } else {
    let newChat = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, req.user._id],
    };

    try {
      const createdChat = await Chat.create(newChat);

      const finalChat = await Chat.find({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json(finalChat);
    } catch (error) {}
  }

  res.status(200).json(chatPresent);
});
export const getAllChat = asyncHandler(async (req, res) => {
  try {
    console.log("hello world");
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMsg")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMsg.sender",
          select: "name image email",
        });
        res.json(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
export const createGroupChat = asyncHandler(async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res
        .status(400)
        .send("Please provide group members and group name");
    }

    let users = JSON.parse(req.body.users);

    if (users.length <= 2) {
      return res
        .status(400)
        .send("More than two members are required for group chat");
    }

    users.push(req.user);

    const newGroupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.find({ _id: newGroupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {}
});
export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedGroup);  
  } catch (error) {}
});
export const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

  try {
    const groupPush = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push:{users: userId}
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if(!groupPush)
    {
        res.status(404);

        throw new Error('Chat not found');
    } 
    else{
        res.json(groupPush);
    } 
 
  } catch (error) {}
});
export const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    try {
      const groupPull = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull:{users: userId}
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      if(!groupPull)
      {
          res.status(404);
  
          throw new Error('Chat not found');
      } 
      else{
          res.json(groupPull);
      } 

    } catch (error) {}
});
