import { create } from "zustand";

type OnlineUsersState = {
  onlineUsers: Record<string, boolean>;      // userId -> isOnline
  lastSeenMap: Record<string, Date | null>;  // userId -> lastSeen timestamp

  setOnline: (userId: string, isOnline: boolean) => void;
  setLastSeen: (userId: string, date: Date) => void;
};

export const useOnlineUsers = create<OnlineUsersState>((set) => ({
  onlineUsers: {},
  lastSeenMap: {},

  setOnline: (userId, isOnline) =>
    set((state) => ({
      onlineUsers: {
        ...state.onlineUsers,
        [userId]: isOnline,
      },
    })),

  setLastSeen: (userId, date) =>
    set((state) => ({
      lastSeenMap: {
        ...state.lastSeenMap,
        [userId]: date,
      },
    })),
}));
