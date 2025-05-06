// hooks/useReply.ts
import { create } from 'zustand';

type Message = {
  id: string;
  text?: string;
  image?: string;
  // ... any other fields
};

type ReplyState = {
  replyTo: Message | null;
  setReply: (message: Message) => void;
  clearReply: () => void;
};

export const useReply = create<ReplyState>((set) => ({
  replyTo: null,
  setReply: (message) => set({ replyTo: message }),
  clearReply: () => set({ replyTo: null }),
}));
