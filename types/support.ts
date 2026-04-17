export type SupportContentType = "text" | "image" | "file";

export type SupportConversationStatus = "open" | "waiting" | "resolved" | "closed";

export interface SupportConversation {
  id: number;
  referenceCode: string;
  customerType: "anonymous" | "registered" | "buyer";
  chatCustomerId: number | null;
  buyerId: number | null;
  assignedAgentId: number | null;
  status: SupportConversationStatus;
  subject: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: number;
  conversationId: number;
  senderType: "customer" | "agent";
  senderId: number | null;
  content: string | null;
  contentType: SupportContentType;
  attachmentUrl: string | null;
  attachmentKey?: string | null;
  attachmentMimeType: string | null;
  attachmentSize: number | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** POST /support/conversations/guest */
export interface StartGuestSupportConversationPayload {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
}

/** POST /support/conversations (buyer JWT) */
export interface StartBuyerSupportConversationPayload {
  subject?: string;
  message: string;
}

export interface SendSupportMessagePayload {
  content?: string;
  contentType?: SupportContentType;
  attachmentUrl?: string | null;
  attachmentKey?: string | null;
  attachmentMimeType?: string | null;
  attachmentSize?: number | null;
}

export interface SupportUploadResponse {
  url: string;
  key: string;
  mimeType: string;
  sizeBytes: number;
}
