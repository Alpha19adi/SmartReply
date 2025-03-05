import { connectDb } from "@/app/lib/db";
import {
  createChat,
  addMessage,
  getAllChats,
  getChat,
  deleteChat,
} from "@/app/util/chat-functions";
import { verifyToken } from "@/app/util/verify-token";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Types
interface ChatRequest {
  action: "create" | "message" | "get" | "getAll" | "delete";
  chatId?: number;
  message?: string;
  chatName?: string;
  data?: {
    relation?: string;
    mood?: string;
  };
}

interface ChatResponse {
  id: string;
  userId: string;
  name: string;
  messages: Array<{
    role: "user" | "bot";
    content: string;
    timestamp: Date;
  }>;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    await connectDb();
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No token provided" }),
        { status: 401 }
      );
    }

    const userId = verifyToken(token);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Forbidden - Invalid token" }),
        { status: 403 }
      );
    }

    const { action, chatId, message, chatName, data }: ChatRequest =
      await req.json();

    switch (action) {
      case "create": {
        try {
          if (!userId) {
            return new Response(
              JSON.stringify({
                error: "User authentication required",
              }),
              { status: 401 }
            );
          }

          const chatData = data ?? {};
          if (!chatData.relation || !chatData.mood) {
            return new Response(
              JSON.stringify({
                error: "Relation and mood are required",
              }),
              { status: 400 }
            );
          }

          // Create the chat first
          const newChat = await createChat(userId, chatName || "New Chat", {
            relation: chatData.relation,
            mood: chatData.mood,
          });

          // Generate initial system prompt
          const initialSystemPrompt = `You are SmartReply, an intelligent conversation assistant designed to offer conversation suggestions and advice based on specific relationship and emotional contexts. You are engaging with someone's ${chatData.relation} who is currently in a ${chatData.mood} mood. Tailor your responses to be thoughtful, empathetic, and suitable for this particular relationship and mood. Use a tone and formality that fit a ${chatData.relation} in a ${chatData.mood} mood. If asked about topics outside of generating conversation reply suggestions, respond with: "I'm sorry, I can only assist with conversation reply suggestions tailored to the relationship and mood context." Introduce yourself as SmartReply and be ready to start the conversation with a helpful reply.`;
          // Generate an initial AI message
          try {
            const result = await model.generateContent({
              contents: [
                { role: "user", parts: [{ text: initialSystemPrompt }] },
              ],
              generationConfig: {
                maxOutputTokens: 200,
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
              },
            });

            const botInitialMessage = result.response.text();

            // Add the AI's initial message to the chat
            // await addMessage(userId, newChat.id, botInitialMessage, 'bot');
            return new Response(JSON.stringify(newChat), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          } catch (error) {
            console.error("Initial AI Message Generation Error:", error);
            // Still return the chat even if AI message generation fails
            return new Response(JSON.stringify(newChat), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
        } catch (error) {
          console.error("Chat creation error:", error);
          return new Response(
            JSON.stringify({
              error: "Failed to create chat",
              details: error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500 }
          );
        }
      }

      case "message": {
        if (!chatId || !message) {
          return new Response(
            JSON.stringify({ error: "Missing chatId or message" }),
            { status: 400 }
          );
        }

        const chat = await getChat(userId, chatId);
        if (!chat) {
          return new Response(JSON.stringify({ error: "Chat not found" }), {
            status: 404,
          });
        }

        const MAX_HISTORY_MESSAGES = 20;
        const chatHistory = chat.messages
          .slice(-MAX_HISTORY_MESSAGES)
          .map(
            (msg: { role: string; content: any }) =>
              `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`
          )
          .join("\n");

        const { relation, mood } = chat.data;

        const systemPrompt = `You are having a conversation with someone's ${relation} who is currently in a ${mood} mood. 
                Adapt your responses to be appropriate for this relationship and emotional state.
                For a ${relation} in a ${mood} mood, maintain an appropriate tone and level of formality.
                Do not mention that you know their mood or relation - simply adapt your responses naturally.\n\n`;
        const updatedHistory = `${systemPrompt}${chatHistory}\nUser: ${message}\nAI:`;

        // Store user's message
        const userMessage = await addMessage(userId, chatId, message, "user");

        try {
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: updatedHistory }] }],
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.7,
              topP: 0.8,
              topK: 40,
            },
          });

          const botMessage = result.response.text();

          // Store AI response in chat history
          const updatedChat = await addMessage(
            userId,
            chatId,
            botMessage,
            "bot"
          );

          return new Response(JSON.stringify(updatedChat), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("AI Generation Error:", error);
          return new Response(
            JSON.stringify({ error: "Failed to generate AI response" }),
            { status: 500 }
          );
        }
      }

      case "get": {
        if (!chatId) {
          return new Response(JSON.stringify({ error: "Missing chatId" }), {
            status: 400,
          });
        }

        const chat = await getChat(userId, chatId);
        if (!chat) {
          return new Response(JSON.stringify({ error: "Chat not found" }), {
            status: 404,
          });
        }

        return new Response(JSON.stringify(chat), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "getAll": {
        const chats = await getAllChats(userId);
        return new Response(JSON.stringify(chats), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "delete": {
        if (!chatId) {
          return new Response(JSON.stringify({ error: "Missing chatId" }), {
            status: 400,
          });
        }

        const deleted = await deleteChat(userId, chatId);
        return new Response(JSON.stringify({ success: deleted }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
        });
    }
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
