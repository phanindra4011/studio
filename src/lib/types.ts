
export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
  isError?: boolean;
};
