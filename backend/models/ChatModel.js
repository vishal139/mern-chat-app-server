import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    latestMsg: {
      type: ObjectId,
      ref: "Message",
    },
    groupAdmin:
      {
        type: ObjectId,
        ref: "User",
      },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
