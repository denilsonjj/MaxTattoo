import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E60000] to-[#FF4444] flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[85%] ${isUser && 'flex flex-col items-end'}`}>
        <div className={`rounded-2xl px-4 py-2 ${
          isUser 
            ? 'bg-[#E60000] text-white' 
            : 'bg-[#1a1a1a] border border-[#E60000]/20 text-[#FAFAFA]'
        }`}>
          {isUser ? (
            <p className="text-sm md:text-base">{message.content}</p>
          ) : (
            <ReactMarkdown className="text-sm md:text-base prose prose-invert">
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[#E60000]/20 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-5 h-5 text-[#E60000]" />
        </div>
      )}
    </div>
  );
}