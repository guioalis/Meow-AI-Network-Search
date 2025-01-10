import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './index.css';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message, ChatResponse } from './types/chat';
import { personalityConfig } from './config/personality';
import { Trash2 } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: '喵～我是喵哥！让我们来聊天吧！我现在可以帮你搜索网上的信息哦！',
        emotion: '开心'
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const clearChat = () => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: '喵～对话已经清空了！让我们重新开始吧！',
      emotion: '开心'
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async (content: string, image?: string) => {
    const userMessage: Message = { 
      role: 'user', 
      content: content || (image ? '发送了一张图片' : ''), 
      image 
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const contextMessages = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content + (msg.image ? ' [包含图片]' : '')
      }));

      const response = await axios.post<ChatResponse>(
        'https://gemini.chaohua.me/v1/chat/completions',
        {
          model: 'gemini-2.0-flash-exp',
          messages: [
            {
              role: 'system',
              content: '你是一位名为"喵哥"的AI助手，极具个性且富有情感。你应该表现出丰富的情感，直接表达想法，并在回答中适当使用语气词和表情。保持真诚但不失专业性。'
            },
            ...contextMessages,
            {
              role: 'user',
              content: content + (image ? ' [用户发送了一张图片]' : '')
            }
          ],
          stream: false,
          tools: [
            {
              type: 'function',
              function: {
                name: 'googleSearch'
              }
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer AIzaSyDwLpu4s_sObItQJac0Og89n5VP-IdawZ8'
          },
        }
      );

      const emotionalPrefix = personalityConfig.getEmotionalResponse(content);
      const assistantMessage: Message = {
        role: 'assistant',
        content: `${emotionalPrefix} ${response.data.choices[0].message.content}`,
        emotion: emotionalPrefix.includes('啊啊啊') ? '开心' : 
                emotionalPrefix.includes('哼') ? '生气' : 
                emotionalPrefix.includes('呜呜') ? '难过' : '思考'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '呜呜...出错了，我需要休息一下...',
          emotion: '难过'
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-center text-pink-600">
            {personalityConfig.name} AI
          </h1>
          <button
            onClick={clearChat}
            className="p-2 text-gray-500 hover:text-pink-600 transition-colors"
            title="清空对话"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-pulse text-gray-500">喵哥正在思考中...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="max-w-3xl mx-auto w-full">
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
