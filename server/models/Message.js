import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    text: String,
    senderId: String,
    status: {
      type: String,
      default: "sent",
    },
    time: Date,
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
