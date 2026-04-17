import axios from "axios";
import { getCrossSubdomainCookie } from "@/lib/utils";
import type {
  SendSupportMessagePayload,
  StartBuyerSupportConversationPayload,
  StartGuestSupportConversationPayload,
  SupportConversation,
  SupportMessage,
  SupportUploadResponse,
} from "@/types/support";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const supportHttp = axios.create({
  baseURL,
});

function authHeaders(chatToken?: string | null): Record<string, string> {
  // If a chat token is explicitly provided, use it (anonymous flow).
  // Otherwise, use buyer JWT (registered customer flow).
  const token = chatToken?.trim() || getCrossSubdomainCookie("440_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function startGuestSupportConversation(
  body: StartGuestSupportConversationPayload
): Promise<{ conversation: SupportConversation; token: string }> {
  const res = await supportHttp.post("/support/conversations/guest", body);
  const token = res?.data?.data?.token as string | undefined;
  if (!token?.trim()) {
    throw new Error("Guest support conversation did not return a chat token");
  }
  return {
    conversation: res?.data?.data?.conversation,
    token: token.trim(),
  };
}

export async function startBuyerSupportConversation(
  body: StartBuyerSupportConversationPayload
): Promise<{ conversation: SupportConversation }> {
  const res = await supportHttp.post("/support/conversations", body, {
    headers: authHeaders(null),
  });
  return {
    conversation: res?.data?.data?.conversation,
  };
}

export async function getSupportConversation(
  conversationId: number,
  chatToken?: string | null
): Promise<SupportConversation> {
  const res = await supportHttp.get(`/support/conversations/${conversationId}`, {
    headers: authHeaders(chatToken),
  });
  return res?.data?.data?.conversation;
}

export async function getSupportMessages(
  conversationId: number,
  options?: { page?: number; limit?: number; since?: string },
  chatToken?: string | null
): Promise<{ messages: SupportMessage[]; page: number; limit: number; total: number }> {
  const res = await supportHttp.get(
    `/support/conversations/${conversationId}/messages`,
    {
      params: options,
      headers: authHeaders(chatToken),
    }
  );

  const data = res?.data?.data ?? {};
  const rows = Array.isArray(data.rows) ? data.rows : undefined;
  const messages = Array.isArray(data.messages) ? data.messages : undefined;

  const resolvedMessages = rows ?? messages ?? [];
  const resolvedPage = Number(data.page ?? options?.page ?? 1);
  const limitFallback = resolvedMessages.length > 0 ? resolvedMessages.length : 20;
  const resolvedLimit = Number(data.limit ?? options?.limit ?? limitFallback);
  const resolvedTotal = Number(data.total ?? data.count ?? resolvedMessages.length);

  return {
    messages: resolvedMessages,
    page: Number.isFinite(resolvedPage) ? resolvedPage : 1,
    limit: Number.isFinite(resolvedLimit) ? resolvedLimit : 20,
    total: Number.isFinite(resolvedTotal) ? resolvedTotal : 0,
  };
}

export async function sendSupportMessage(
  conversationId: number,
  body: SendSupportMessagePayload,
  chatToken?: string | null
): Promise<SupportMessage> {
  const res = await supportHttp.post(
    `/support/conversations/${conversationId}/messages`,
    body,
    {
      headers: authHeaders(chatToken),
    }
  );
  return res?.data?.data?.message;
}

export async function markSupportMessageAsRead(
  conversationId: number,
  messageId: number,
  chatToken?: string | null
): Promise<{ id: number; readAt: string }> {
  const res = await supportHttp.put(
    `/support/conversations/${conversationId}/messages/${messageId}/read`,
    {},
    {
      headers: authHeaders(chatToken),
    }
  );
  return res?.data?.data;
}

export async function uploadSupportAttachment(
  file: File,
  chatToken?: string | null
): Promise<SupportUploadResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await supportHttp.post("/support/upload", form, {
    headers: {
      ...authHeaders(chatToken),
      "Content-Type": "multipart/form-data",
    },
  });

  return res?.data?.data;
}
