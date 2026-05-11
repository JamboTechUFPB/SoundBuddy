import userModel from "../models/userModel";
import ChatModel from "../models/chatModel.js";
import { v4 as uuidv4 } from "uuid";

export const chatController = {
  async createChat(req, res) {
    try {
      const { userId } = req.body;
      const chatId = uuidv4();
      const chat = new ChatModel({
        chatId,
        users: [req.user.id, userId],
        messages: [],
      });
      await chat.save();
      return res.status(201).json(chat);
    } catch (error) {
      console.error("Error creating chat:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getChat(req, res) {
    try {
      const chats = await ChatModel.find({ users: req.user.id }).populate("users", "name profileImage");
      return res.status(200).json(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async sendMessage(req, res) {
    try {
      const { chatId, message } = req.body;
      const chat = await ChatModel.findOne({ chatId });
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      chat.messages.push({ sender: req.user.id, text: message });
      await chat.save();
      return res.status(200).json(chat);
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  async getMessages(req, res) {
    try {
      const { chatId } = req.params;
      const chat = await ChatModel.findOne({ chatId }).populate("messages.sender", "name profileImage");
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      return res.status(200).json(chat.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
}
