import React from 'react'
import { PiPlusCircleDuotone } from 'react-icons/pi'
import { MessageCircle } from 'lucide-react'
import { FaRegTrashAlt } from 'react-icons/fa'
interface Chat {
    name: string,
    id: number
}
interface SideNavProps {
    chats: Chat[],
    onChatSelect: (index: number) => void
    onNewChat: () => void
    onDeleteChat: (chatId: number) => void
}
const SideNav: React.FC<SideNavProps> = ({ chats, onChatSelect, onNewChat, onDeleteChat }) => {
    const handleDelete = (e: React.MouseEvent, chatId: number) => {
        e.stopPropagation();  
        onDeleteChat(chatId);
    };

    return (
        <div className='h-screen w-64 bg-gray-900 flex flex-col border-r border-gray-800'>
            <div className='p-6 border-b border-gray-800'>
                <h1 className='text-white text-xl lg:text-3xl font-bold flex items-center justify-center gap-2'>
                    <MessageCircle className="text-green-500" />
                    <span>Smart Reply</span>
                </h1>
            </div>
            <div className='flex-grow overflow-y-auto'>
                <div className='py-4'>
                    <div className='text-sm text-gray-400 font-semibold px-4 mb-2 uppercase tracking-wider'>
                        Recent Chats
                    </div>

                    <div className='space-y-1 px-2'>
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => onChatSelect(chat.id)}
                                className='w-full text-left text-gray-300 hover:text-white hover:bg-gray-800 
                                         px-4 py-3 rounded-lg transition-all duration-200 
                                         flex items-center space-x-3 focus:outline-none focus:ring-2 
                                         focus:ring-green-500 focus:ring-opacity-50 cursor-pointer'
                            >
                                <div className='flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center'>
                                    <span className='text-sm font-medium text-gray-300'>
                                        {chat.name.charAt(0)}
                                    </span>
                                </div>
                                <span className='text-sm font-medium truncate flex-grow'>{chat.name}</span>
                                <button
                                    onClick={(e) => handleDelete(e, chat.id)}
                                    className='ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700 
                                             rounded-full transition-all duration-200'
                                    title="Delete chat"
                                >
                                    <FaRegTrashAlt size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='p-4 border-t border-gray-800'>
                <button
                    onClick={onNewChat}
                    className='w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 
                             rounded-lg flex items-center justify-center gap-2 transition-all 
                             duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 
                             focus:ring-opacity-50 font-medium'
                >
                    <PiPlusCircleDuotone size={20} />
                    <span>New Chat</span>
                </button>
            </div>
        </div>
    )
}

export default SideNav