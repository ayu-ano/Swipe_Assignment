import React from 'react';
import { User, Bot, AlertCircle, CheckCircle2 } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const getMessageIcon = () => {
    switch (message.type) {
      case 'answer':
        return <User size={16} className="flex-shrink-0" />;
      case 'question':
        return <Bot size={16} className="flex-shrink-0" />;
      case 'evaluation':
        return <CheckCircle2 size={16} className="flex-shrink-0" />;
      case 'error':
        return <AlertCircle size={16} className="flex-shrink-0" />;
      default:
        return <Bot size={16} className="flex-shrink-0" />;
    }
  };

  const getMessageStyles = () => {
    const baseStyles = "rounded-lg p-3 max-w-[80%]";
    
    switch (message.type) {
      case 'answer':
        return `${baseStyles} bg-blue-600 text-white ml-auto`;
      case 'question':
        return `${baseStyles} bg-gray-100 text-gray-900 mr-auto`;
      case 'evaluation':
        return `${baseStyles} bg-green-100 text-green-900 border border-green-200 mr-auto`;
      case 'error':
        return `${baseStyles} bg-red-100 text-red-900 border border-red-200 mr-auto`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-900 mr-auto`;
    }
  };

  const getIconContainerStyles = () => {
    switch (message.type) {
      case 'answer':
        return "bg-blue-600 text-white";
      case 'question':
        return "bg-gray-600 text-white";
      case 'evaluation':
        return "bg-green-600 text-white";
      case 'error':
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getTimeDisplay = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${message.type === 'answer' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${message.type === 'answer' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 max-w-full`}>
        {/* Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getIconContainerStyles()}`}>
          {getMessageIcon()}
        </div>

        {/* Message Content */}
        <div className={getMessageStyles()}>
          {/* Message Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium opacity-90">
              {message.type === 'answer' ? 'You' : 
               message.type === 'question' ? 'Interviewer' :
               message.type === 'evaluation' ? 'Evaluation' : 'System'}
            </span>
            {message.score !== undefined && (
              <span className="text-xs px-2 py-1 bg-white bg-opacity-20 rounded-full">
                Score: {message.score}/100
              </span>
            )}
          </div>

          {/* Message Text */}
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Message Footer */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs opacity-75">
              {getTimeDisplay(message.timestamp)}
            </span>
            
            {/* Difficulty badge for questions */}
            {message.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                message.difficulty === 'easy' 
                  ? 'bg-green-100 text-green-800' 
                  : message.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {message.difficulty.charAt(0).toUpperCase() + message.difficulty.slice(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;