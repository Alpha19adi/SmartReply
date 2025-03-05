"use client"
import React, { useState, useEffect, useRef } from 'react';
import ChatQuestionnaire from './ChatQuestionnaire';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number,
  content: string,
  type: 'bot' | 'user',
  timestamp: Date
}

interface ChatWindowProps {
  messages: Message[],
  onSendMessage: (message: string, context?: any) => void;
  chatName: string;
  chatData?: {  
    relation?: string;
    mood?: string;
  };
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, chatName , chatData  }) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className='h-full flex flex-col pt-16 md:pt-0 max-h-screen'>
      <div className='mb-4 bg-white rounded-lg shadow-lg p-4'>
        <h2 className='text-xl md:text-2xl font-bold mb-2'>{chatName}</h2>
        {chatData && (
          <div className='flex items-center gap-4 text-sm text-gray-600'>
            {chatData.relation && (
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-green-400 rounded-full'></span>
                {chatData.relation}
              </div>
            )}
            {chatData.mood && (
              <div className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-blue-400 rounded-full'></span>
                {chatData.mood}
              </div>
            )}
          </div>
        )}
      </div>
      <div className='flex-1 bg-white rounded-lg shadow-lg p-4 md:p-6 flex flex-col min-h-0'>
        <div className='flex-1 overflow-y-auto space-y-4 mb-4'>
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className='break-words'>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className='flex-shrink-0'>
          <div className='flex gap-2'>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className='flex-1 rounded-lg border border-gray-300 p-3 focus:outline-none focus:border-blue-500'
            />
            <button
              type="submit"
              className='bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center'
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
