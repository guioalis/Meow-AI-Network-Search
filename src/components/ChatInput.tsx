import { FormEvent, useState, useRef, DragEvent } from 'react';
import { Send, Image, X, Search } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, image?: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((input.trim() || imagePreview) && !isLoading) {
      const message = isSearchMode ? `/search ${input}` : input;
      onSendMessage(message, imagePreview || undefined);
      setInput('');
      setImagePreview(null);
      setUploadError(null);
      setIsSearchMode(false);
    }
  };

  const validateAndProcessImage = (file: File) => {
    setIsImageLoading(true);
    setUploadError(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('请上传 JPG、PNG、GIF 或 WebP 格式的图片');
      setIsImageLoading(false);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('图片大小不能超过 5MB');
      setIsImageLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setIsImageLoading(false);
    };
    reader.onerror = () => {
      setUploadError('图片处理失败，请重试');
      setIsImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessImage(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndProcessImage(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
  };

  return (
    <div 
      className="p-4 border-t bg-white"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {uploadError && (
        <div className="mb-2 text-red-500 text-sm">{uploadError}</div>
      )}
      
      {imagePreview && (
        <div className="mb-4 relative inline-block">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-h-32 rounded-lg"
          />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isDragging && (
        <div className="absolute inset-0 bg-pink-100 bg-opacity-50 flex items-center justify-center border-2 border-dashed border-pink-300 rounded-lg">
          <p className="text-pink-500">放开以上传图片</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`px-3 py-2 text-gray-500 hover:text-pink-500 transition-colors ${
            isImageLoading ? 'animate-pulse' : ''
          }`}
          disabled={isLoading || isImageLoading}
          title="上传图片 (最大 5MB)"
        >
          <Image className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={toggleSearchMode}
          className={`px-3 py-2 transition-colors ${
            isSearchMode 
              ? 'text-pink-500 bg-pink-50 rounded-lg' 
              : 'text-gray-500 hover:text-pink-500'
          }`}
          disabled={isLoading}
          title={isSearchMode ? "取消搜索模式" : "启用搜索模式"}
        >
          <Search className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isSearchMode ? "输入搜索内容..." : "和喵哥聊天吧..."}
          className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            isSearchMode ? 'bg-pink-50' : ''
          }`}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || isImageLoading || (!input.trim() && !imagePreview)}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
