"use client"
import React, { useState, useEffect, useRef } from 'react'
import SideNav from '../components/SideNav'
import ChatWindow from '../components/ChatWindow'
import { gsap } from 'gsap'
import { Menu } from 'lucide-react'
import axios from 'axios'
import ChatQuestionnaire from '../components/ChatQuestionnaire'

interface Chat {
  data: any
  name: string,
  id: number
  messages: Message[]
}

interface Message {
  id: number,
  content: string,
  type: 'bot' | 'user',
  timestamp: Date
}


const Page = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const sideNavRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  useEffect(() => {

    axios.post('/api/chat',{
      action:"getAll",
    }).then((response) => {
      console.log(response.data);
      setChats(response.data);
    })

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSideNavOpen(false);
      } else {
        setIsSideNavOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSideNav = () => {
    if (sideNavRef.current) {
      if (!isSideNavOpen) {
        gsap.to(sideNavRef.current, {
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(sideNavRef.current, {
          x: '-100%',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
    setIsSideNavOpen(!isSideNavOpen);
  };

  useEffect(() => {
    if (isMobile && (isGenerating || document.activeElement?.tagName === 'INPUT')) {
      gsap.to(sideNavRef.current, {
        x: '-100%',
        duration: 0.3,
        ease: 'power2.out'
      });
      setIsSideNavOpen(false);
    }
  }, [isGenerating, isMobile]);

  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
    if (isMobile) {
      toggleSideNav();
    }
  };

  const handleNewChat = (answers: {
    relation: string;
    mood: string;
  }) => {
    axios.post('/api/chat', {
      action: "create",
      chatName: "New Chat",
      data: {
        relation: answers.relation,
        mood: answers.mood
      }
    }).then((response) => {
      setChats([...chats, response.data]);
      setSelectedChat(response.data.id);
      setIsNewChatModalOpen(false);
    }).catch(error => {
      console.error('Error creating chat:', error);
    });
  };

  const openNewChatModal = () => {
    setIsNewChatModalOpen(true);
  };


  const handleDeleteChat = (chatId: number) => {
    console.log(chatId);
    axios.post('/api/chat', {
      action: "delete",
      chatId
    }).then((response) => {
      if (response.data.success) {
        setChats(chats.filter(chat => chat.id !== chatId));
        if (selectedChat === chatId) {
          const nextChat = chats.find(chat => chat.id !== chatId);
          setSelectedChat(nextChat ? nextChat.id : null);
        }
      }
    }).catch(error => {
      console.error('Error deleting chat:', error);
    });
  };

  const handleSendMessage = (content: string, context?: any) => {
    if (!selectedChat) return;
    setIsGenerating(true);
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat) {
        return {
          ...chat,
          messages: [...chat.messages,
          {
            id: chat.messages.length + 1,
            content: content,
            type: 'user' as const,
            timestamp: new Date()
          }]
        };
      }
      return chat;
    });
    setChats(updatedChats);
  
    axios.post('/api/chat', {
      action: "message",
      chatId: selectedChat,
      message: content,
      context: {
        relation: context?.relation || '',
        mood: context?.mood || '',
        isFirstMessage: context && chats.find(chat => chat.id === selectedChat)?.messages.length === 0
      }
    }).then((response) => {
      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === selectedChat) {
          return response.data;
        }
        return chat;
      }));
      setIsGenerating(false);
    }).catch(error => {
      console.error('Error sending message:', error);
      setIsGenerating(false);
    });
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);


  return (
    <div className='flex w-screen h-screen bg-gray-100 relative overflow-hidden'>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSideNav}
        className='md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg text-white'
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isMobile && isSideNavOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30'
          onClick={toggleSideNav}
        />
      )}

      {/* SideNav */}
      <div
        ref={sideNavRef}
        className={`fixed md:relative z-40 transform ${
          isMobile ? (isSideNavOpen ? 'translate-x-0' : '-translate-x-full') : ''
        } transition-transform duration-300 ease-in-out`}
      >
        <SideNav
          chats={chats}
          onChatSelect={handleChatSelect}
          onNewChat={openNewChatModal}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      {isNewChatModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg'>
            <ChatQuestionnaire 
              onComplete={(answers) => {
                handleNewChat(answers);
              }} 
            />
            <button 
              onClick={() => setIsNewChatModalOpen(false)}
              className='mt-4 w-full bg-gray-200 p-2 rounded'
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}

      <main className='flex-1 p-4 md:p-6 ml-0 '>
      {selectedChat && selectedChatData ? (
        <ChatWindow
          messages={selectedChatData.messages}
          onSendMessage={handleSendMessage}
          chatName={selectedChatData.name}
          chatData={{
            relation: selectedChatData.data?.relation,
            mood: selectedChatData.data?.mood
          }}
        />
      ) : (
        <div className='h-full flex items-center justify-center text-gray-500'>
          Select a chat or create a new one to get started
        </div>
      )}
    </main>
    </div>
  );
};

export default Page;