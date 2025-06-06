// utils/chat.ts
export function getChatId(userA: string, userB: string) {
  return [userA, userB].sort().join("-");
}