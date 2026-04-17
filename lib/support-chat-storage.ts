const CHAT_TOKEN_KEY = "support_chat_token";
const CONVERSATION_ID_KEY = "support_conversation_id";

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

export function getSupportChatToken(): string | null {
  if (!hasWindow()) return null;
  return sessionStorage.getItem(CHAT_TOKEN_KEY);
}

export function setSupportChatToken(token: string): void {
  if (!hasWindow()) return;
  sessionStorage.setItem(CHAT_TOKEN_KEY, token);
}

export function clearSupportChatToken(): void {
  if (!hasWindow()) return;
  sessionStorage.removeItem(CHAT_TOKEN_KEY);
}

export function getSupportConversationId(): number | null {
  if (!hasWindow()) return null;
  const raw = sessionStorage.getItem(CONVERSATION_ID_KEY);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function setSupportConversationId(id: number): void {
  if (!hasWindow()) return;
  sessionStorage.setItem(CONVERSATION_ID_KEY, String(id));
}

export function clearSupportConversationId(): void {
  if (!hasWindow()) return;
  sessionStorage.removeItem(CONVERSATION_ID_KEY);
}

export function clearSupportChatStorage(): void {
  clearSupportChatToken();
  clearSupportConversationId();
}
