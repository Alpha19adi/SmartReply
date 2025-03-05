import { chatSchema } from "@/app/models/chat";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

async function createChat(
  userId: string,
  chatName: string,
  data: {
    relation: string;
    mood: string;
  }
) {
    try {
        const newChat = new Chat({
          name: chatName,
          id: generateUniqueChatId(),
          userId: userId,
          messages: [],
          data: {
            relation: data.relation,
            mood: data.mood
          }
        });
      
        const savedChat = await newChat.save();
        return savedChat;
      } catch (error) {
        console.error('Error creating chat:', error);
        throw error;
      }
}

function generateUniqueChatId() {
  return uuidv4();
}

async function addMessage(
  userId: string,
  chatId: number,
  content: string,
  type: "user" | "bot"
) {
  const chat = await Chat.findOne({ id: chatId, userId });

  if (!chat) {
    return null;
  }

  const newMessage = {
    content,
    type,
    timestamp: new Date(),
  };

  chat.messages.push(newMessage);
  await chat.save();
  return chat;
}

// Get all chats
async function getAllChats(userId: string) {
  return await Chat.find({ userId }).sort({ id: 1 });
}

// Get a specific chat
async function getChat(userId: string, chatId: number) {
  return await Chat.findOne({ id: chatId, userId });
}

async function deleteChat(userId: string, chatId: number) {
  const result = await Chat.deleteOne({ id: chatId, userId });
  return result.deletedCount > 0;
}

export { createChat, addMessage, getAllChats, getChat, deleteChat };
