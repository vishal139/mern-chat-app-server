import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Chat from "../models/ChatModel.js";
import Message from "../models/MessageModel.js";

export const sendMessage = asyncHandler(async (req, res) => {

    const {content, chatId, user} = req.body;


    if(!content || !chatId)
    {
        console.log('Invalid data passed in the request');

        res.sendStatus(400);
    }
  
    try {

        let newMessage = {
            sender: req.user._id,
            content: content,
            chatId: chatId,

        }

        let chatMessage = await Message.create(newMessage);

         chatMessage = await chatMessage.populate('sender', 'name image');
         chatMessage = await chatMessage.populate('chatId');
         chatMessage = await User.populate(chatMessage, {
            path:'chatId.users',
            select: 'name pic email'
         });

         await Chat.findByIdAndUpdate(req.user._id,{
            latestMsg: chatMessage,
         })

         res.json(chatMessage);

    } catch (error) {
        console.log(error);
    }
});
export const getMessageByChatId = asyncHandler(async (req, res) => {
  const {chatId} = req.params
    try {

        const allMessage = await Message.find({chatId:chatId}).populate("sender", 'name image email').populate('chatId');
        res.json(allMessage);
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
});


