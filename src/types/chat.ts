export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  emotion?: '开心' | '生气' | '难过' | '思考';
  image?: string; // Base64 image string
}

export interface ChatResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
