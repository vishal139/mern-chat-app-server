import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;


const MessageSchema = new mongoose.Schema({
    sender: {
        type: ObjectId,
        ref: 'User'
    },
    content:{
        type: String,
        trim: true,
    },
    chat:{
        type: ObjectId,
        ref: 'Chat',
    },

},{timestamps: true});



const Message = mongoose.model('Message', MessageSchema);

export default Message;