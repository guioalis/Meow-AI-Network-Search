import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  const getEmotionColor = (emotion?: string) => {
    switch(emotion) {
      case '开心': return 'bg-pink-500';
      case '生气': return 'bg-red-500';
      case '难过': return 'bg-blue-500';
      case '思考': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : `${getEmotionColor(message.emotion)} text-white rounded-bl-none`
        }`}
      >
        {message.image && (
          <img 
            src={message.image} 
            alt="Uploaded content"
            className="max-w-full rounded-lg mb-2"
          />
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
