"use client";

import {
  getSupportConversation,
  getSupportMessages,
  markSupportMessageAsRead,
  sendSupportMessage,
  startBuyerSupportConversation,
  startGuestSupportConversation,
  uploadSupportAttachment,
} from "@/api/support";
import { useGetUserProfile } from "@/api/auth";
import { Button } from "@/components/ui";
import {
  clearSupportChatStorage,
  clearSupportChatToken,
  getSupportConversationId,
  getSupportChatToken,
  setSupportChatToken,
  setSupportConversationId,
} from "@/lib/support-chat-storage";
import { getCrossSubdomainCookie } from "@/lib/utils";
import type { SupportConversation, SupportMessage } from "@/types/support";
import { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  RiAttachment2,
  RiChatSmile3Line,
  RiCloseLine,
  RiLoader4Line,
  RiRefreshLine,
  RiSendPlaneFill,
} from "react-icons/ri";
import { toast } from "react-toastify";

type AttachedFile = { id: string; file: File; url: string };

type SocketLike = {
  connected: boolean;
  on: (event: string, callback: (payload: any) => void) => void;
  off: (event: string, callback?: (payload: any) => void) => void;
  emit: (event: string, payload: any) => void;
  disconnect: () => void;
};

declare global {
  interface Window {
    io?: (url: string, options?: { auth?: { token?: string } }) => SocketLike;
  }
}

const SOCKET_SCRIPT = "https://cdn.socket.io/4.7.5/socket.io.min.js";
let socketScriptPromise: Promise<void> | null = null;

function loadSocketScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.io) return Promise.resolve();
  if (socketScriptPromise) return socketScriptPromise;

  socketScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SOCKET_SCRIPT}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load socket client")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = SOCKET_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load socket client"));
    document.head.appendChild(script);
  });

  return socketScriptPromise;
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDay(value: string): string {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mergeMessages(base: SupportMessage[], incoming: SupportMessage[]): SupportMessage[] {
  const byId = new Map<number, SupportMessage>();
  base.forEach((msg) => byId.set(msg.id, msg));
  incoming.forEach((msg) => byId.set(msg.id, msg));
  return Array.from(byId.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

function splitDisplayName(name: string | undefined): { first: string; last: string } {
  const t = name?.trim() ?? "";
  if (!t) return { first: "", last: "" };
  const i = t.indexOf(" ");
  if (i === -1) return { first: t, last: "" };
  return { first: t.slice(0, i), last: t.slice(i + 1).trim() };
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SupportMessagePanel({ open, onClose }: Props) {
  const { data: profile } = useGetUserProfile();
  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [chatToken, setChatToken] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPolledAt, setLastPolledAt] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [hasBuyerJwt, setHasBuyerJwt] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<SocketLike | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const revokeAll = useCallback((list: AttachedFile[]) => {
    list.forEach((i) => URL.revokeObjectURL(i.url));
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const hydrateConversation = useCallback(async () => {
    const storedToken = getSupportChatToken();
    const storedId = getSupportConversationId();
    if (!storedId) return;
    try {
      setIsBooting(true);
      setChatToken(storedToken);
      const [conv, msgRes] = await Promise.all([
        getSupportConversation(storedId, storedToken),
        getSupportMessages(storedId, { page: 1, limit: 50 }, storedToken),
      ]);
      setConversation(conv);
      if (conv.customerType !== "anonymous") {
        clearSupportChatToken();
        setChatToken(null);
      }
      setMessages(msgRes.messages ?? []);
      if (msgRes.messages?.length) {
        setLastPolledAt(msgRes.messages[msgRes.messages.length - 1].createdAt);
      }
    } catch {
      // stale token/conversation pairing; reset persisted support session
      clearSupportChatStorage();
      setConversation(null);
      setChatToken(null);
      setMessages([]);
      setLastPolledAt(null);
    } finally {
      setIsBooting(false);
    }
  }, []);

  useEffect(() => {
    void hydrateConversation();
  }, [hydrateConversation]);

  useEffect(() => {
    if (!open || conversation || isBooting) return;
    void hydrateConversation();
  }, [open, conversation, isBooting, hydrateConversation]);

  useEffect(() => {
    if (!open) return;
    setHasBuyerJwt(Boolean(getCrossSubdomainCookie("440_token")));
  }, [open]);

  useEffect(() => {
    if (!open || hasBuyerJwt) return;
    const { first, last } = splitDisplayName(profile?.name);
    setContactFirstName((prev) => prev || first);
    setContactLastName((prev) => prev || last);
    setContactEmail((prev) => prev || profile?.email || "");
    setContactPhone((prev) => prev || profile?.phone || "");
  }, [open, profile, hasBuyerJwt]);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const authTokenForConversation = useCallback(
    (conv?: SupportConversation | null): string | null => {
      if (!conv) return null;
      return conv.customerType === "anonymous" ? chatToken : null;
    },
    [chatToken]
  );

  const refreshMessages = useCallback(
    async (since?: string) => {
      if (!conversation) return;
      try {
        setIsLoadingMessages(true);
        const res = await getSupportMessages(
          conversation.id,
          { page: 1, limit: 50, since },
          authTokenForConversation(conversation)
        );
        setMessages((prev) => mergeMessages(prev, res.messages ?? []));
        if (res.messages?.length) {
          setLastPolledAt(res.messages[res.messages.length - 1].createdAt);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [conversation, authTokenForConversation]
  );

  const markUnreadFromAgentAsRead = useCallback(async () => {
    if (!conversation) return;
    const unread = messages.filter(
      (m) => m.senderType === "agent" && m.readAt == null
    );
    if (!unread.length) return;

    try {
      if (socketRef.current?.connected) {
        unread.forEach((msg) => {
          socketRef.current?.emit("support:read", { messageId: msg.id });
        });
      } else {
        await Promise.all(
          unread.map((msg) =>
            markSupportMessageAsRead(
              conversation.id,
              msg.id,
              authTokenForConversation(conversation)
            ).catch(() => null)
          )
        );
      }
    } catch {
      // fail silently to avoid blocking chat
    }
  }, [conversation, messages, authTokenForConversation]);

  useEffect(() => {
    if (!open || !conversation) return;
    void markUnreadFromAgentAsRead();
  }, [conversation, messages, open, markUnreadFromAgentAsRead]);

  useEffect(() => {
    if (!open || !conversation) return;

    const token =
      conversation.customerType === "anonymous"
        ? chatToken
        : getCrossSubdomainCookie("440_token");
    if (!token) return;
    let isMounted = true;
    let localSocket: SocketLike | null = null;

    const bootSocket = async () => {
      try {
        await loadSocketScript();
        if (!window.io || !isMounted) return;
        const base = process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin;
        const socketUrl = new URL(base, window.location.origin).origin;
        localSocket = window.io(socketUrl, { auth: { token } });
        socketRef.current = localSocket;

        let didEmitJoin = false;
        const onConnect = () => {
          setIsConnected(true);
          if (conversation.customerType === "anonymous") return;
          if (didEmitJoin) return;
          didEmitJoin = true;
          localSocket?.emit("support:join", { conversationId: conversation.id });
          // Sync immediately after joining in case events were missed while reconnecting.
          void refreshMessages(lastPolledAt ?? undefined);
        };
        const onDisconnect = () => {
          setIsConnected(false);
          didEmitJoin = false;
        };
        const onMessage = (payload: { message?: SupportMessage }) => {
          if (!payload?.message) return;
          setMessages((prev) => mergeMessages(prev, [payload.message!]));
          setLastPolledAt(payload.message.createdAt);
        };
        const onReadReceipt = (payload: { messageId: number; readAt: string }) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.messageId ? { ...msg, readAt: payload.readAt } : msg
            )
          );
        };
        const onConversationUpdated = (payload: {
          conversationId: number;
          status?: SupportConversation["status"];
        }) => {
          if (payload.conversationId !== conversation.id) return;
          setConversation((prev) =>
            prev ? { ...prev, status: payload.status ?? prev.status } : prev
          );
        };
        const onSocketError = (payload: { message?: string }) => {
          if (payload?.message) toast.error(payload.message);
        };
        const onConnectError = () => {
          setIsConnected(false);
        };

        localSocket.on("connect", onConnect);
        localSocket.on("disconnect", onDisconnect);
        localSocket.on("connect_error", onConnectError);
        localSocket.on("support:message", onMessage);
        localSocket.on("support:read-receipt", onReadReceipt);
        localSocket.on("support:conversation-updated", onConversationUpdated);
        localSocket.on("support:error", onSocketError);

        // If the handshake finished before listeners were attached, sync connected state.
        if (localSocket.connected) {
          onConnect();
        }
      } catch {
        setIsConnected(false);
      }
    };

    void bootSocket();

    return () => {
      isMounted = false;
      setIsConnected(false);
      if (localSocket) {
        localSocket.off("connect");
        localSocket.off("disconnect");
        localSocket.off("connect_error");
        localSocket.off("support:message");
        localSocket.off("support:read-receipt");
        localSocket.off("support:conversation-updated");
        localSocket.off("support:error");
        localSocket.disconnect();
      }
      socketRef.current = null;
    };
  }, [open, conversation, chatToken, refreshMessages, lastPolledAt]);

  useEffect(() => {
    if (!open || !conversation) return;
    const timer = window.setInterval(() => {
      void refreshMessages(lastPolledAt ?? undefined);
    }, isConnected ? 20000 : 12000);
    return () => window.clearInterval(timer);
  }, [open, conversation, isConnected, refreshMessages, lastPolledAt]);

  const addFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles?.length) return;
    const next: AttachedFile[] = [];
    const remaining = Math.max(0, 6 - files.length);
    Array.from(incomingFiles)
      .slice(0, remaining)
      .forEach((file) => {
        next.push({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
          file,
          url: URL.createObjectURL(file),
        });
      });
    if (!next.length && incomingFiles.length) {
      toast.error("Select valid attachments.");
      return;
    }
    setFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const startConversationIfNeeded = async (
    firstMessage: string
  ): Promise<{ conversation: SupportConversation; token: string | null; created: boolean } | null> => {
    if (conversation) {
      return {
        conversation,
        token: authTokenForConversation(conversation),
        created: false,
      };
    }
    const buyerJwt = getCrossSubdomainCookie("440_token")?.trim();

    let resConversation: SupportConversation;
    let effectiveToken: string | null;

    if (buyerJwt) {
      clearSupportChatToken();
      setChatToken(null);
      const res = await startBuyerSupportConversation({
        subject: subject.trim() || undefined,
        message: firstMessage,
      });
      resConversation = res.conversation;
      effectiveToken = null;
    } else {
      const firstName = contactFirstName.trim();
      const lastName = contactLastName.trim();
      const email = contactEmail.trim() || undefined;
      const phone = contactPhone.trim() || undefined;
      if (!firstName || !lastName) {
        toast.error("Enter your first and last name before starting chat.");
        return null;
      }
      if (firstName.length > 50 || lastName.length > 50) {
        toast.error("First and last name must be 50 characters or fewer.");
        return null;
      }
      if (!email && !phone) {
        toast.error("Add email or phone before starting chat.");
        return null;
      }
      const res = await startGuestSupportConversation({
        firstName,
        lastName,
        email,
        phone,
        subject: subject.trim() || undefined,
        message: firstMessage,
      });
      resConversation = res.conversation;
      effectiveToken = res.token;
      setChatToken(res.token);
      setSupportChatToken(res.token);
    }

    setConversation(resConversation);
    setSupportConversationId(resConversation.id);
    const initial = await getSupportMessages(
      resConversation.id,
      { page: 1, limit: 50 },
      effectiveToken
    );
    setMessages(initial.messages ?? []);
    if (initial.messages?.length) {
      setLastPolledAt(initial.messages[initial.messages.length - 1].createdAt);
    }
    return {
      conversation: resConversation,
      token: effectiveToken,
      created: true,
    };
  };

  /** Always persist via REST so the message is stored, shown in UI from the response, and visible to agents. Socket is receive-only for customer sends (avoids relying on broadcast echo or room timing). */
  const persistCustomerMessage = async (
    targetConversationId: number,
    payload: Parameters<typeof sendSupportMessage>[1],
    authToken?: string | null
  ) => {
    const created = await sendSupportMessage(
      targetConversationId,
      payload,
      authToken ?? authTokenForConversation(conversation)
    );
    if (!created?.id) {
      throw new Error("Send message response missing message");
    }
    setMessages((prev) => mergeMessages(prev, [created]));
    setLastPolledAt(created.createdAt);
  };

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed && files.length === 0) {
      toast.error("Write a message or attach a file.");
      return;
    }
    if (conversation?.status === "closed") {
      toast.error("This conversation is closed. Start a new one.");
      return;
    }

    try {
      setIsSending(true);
      const started = await startConversationIfNeeded(
        trimmed || "Attachment uploaded"
      );
      if (!started) return;

      // POST /support/conversations (or /guest) already persists the first message when starting.
      if (trimmed && !started.created) {
        await persistCustomerMessage(
          started.conversation.id,
          { content: trimmed, contentType: "text" },
          started.token
        );
      }

      if (files.length > 0) {
        for (const item of files) {
          const upload = await uploadSupportAttachment(item.file, started.token);
          await persistCustomerMessage(
            started.conversation.id,
            {
              content: item.file.name,
              contentType: upload.mimeType.startsWith("image/") ? "image" : "file",
              attachmentUrl: upload.url,
              attachmentKey: upload.key,
              attachmentMimeType: upload.mimeType,
              attachmentSize: upload.sizeBytes,
            },
            started.token
          );
        }
      }

      revokeAll(files);
      setFiles([]);
      setMessage("");
    } catch (error) {
      console.error(error);
      const err = error as AxiosError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearSupportChatStorage();
        setConversation(null);
        setChatToken(null);
        setMessages([]);
        setLastPolledAt(null);
        toast.error("Your support chat session expired. Please start again.");
        return;
      }
      toast.error("Unable to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close support"
            className="fixed inset-0 z-[60] bg-black/40 cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-panel-title"
            className="fixed z-[61] inset-x-0 bottom-0 max-h-[min(96vh,820px)] md:inset-auto md:bottom-6 md:right-6 md:left-auto md:top-auto md:max-h-[min(92vh,760px)] w-full md:w-[min(100vw-3rem,26rem)] flex flex-col rounded-t-2xl md:rounded-2xl border border-(--border-default) bg-(--bg-surface) shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-(--border-default) bg-(--bg-page)">
              <div>
                <h2
                  id="support-panel-title"
                  className="text-base font-semibold text-(--text)"
                >
                  Support chat
                </h2>
                <p className="mt-0.5 text-[11px] text-(--text-muted)">
                  {isConnected ? "Live" : "Offline sync"}{" "}
                  {conversation?.referenceCode
                    ? `• ${conversation.referenceCode}`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-(--text-muted) hover:bg-(--primary-soft) hover:text-(--primary) transition-colors"
                aria-label="Close"
              >
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            <div className="px-4 py-2 border-b border-(--border-default) bg-(--bg-surface)">
              {conversation?.status ? (
                <p className="text-[11px] text-(--text-muted)">
                  Status:{" "}
                  <span className="font-semibold uppercase tracking-wide text-(--text)">
                    {conversation.status}
                  </span>
                </p>
              ) : (
                <p className="text-[11px] text-(--text-muted)">
                  Start a conversation with support. We typically reply within minutes.
                </p>
              )}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0 bg-[#f7f8fa]">
              {!conversation && hasBuyerJwt && (
                <div className="rounded-xl border border-(--border-default) bg-white p-3 space-y-2">
                  <div className="flex items-center gap-2 text-(--text)">
                    <RiChatSmile3Line className="text-lg text-(--primary)" />
                    <p className="text-sm font-semibold">How can we help?</p>
                  </div>
                  <p className="text-xs text-(--text-muted)">
                    You are signed in — send a message to open a support thread. Optional topic below.
                  </p>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject (optional)"
                    className="w-full rounded-lg border border-(--border-default) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                  />
                </div>
              )}

              {!conversation && !hasBuyerJwt && (
                <div className="rounded-xl border border-(--border-default) bg-white p-3 space-y-2">
                  <div className="flex items-center gap-2 text-(--text)">
                    <RiChatSmile3Line className="text-lg text-(--primary)" />
                    <p className="text-sm font-semibold">Your details</p>
                  </div>
                  <p className="text-xs text-(--text-muted)">
                    We need this once so our team can reach you. Then send your first message below.
                  </p>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject (optional)"
                    className="w-full rounded-lg border border-(--border-default) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                  />
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      value={contactFirstName}
                      onChange={(e) => setContactFirstName(e.target.value)}
                      placeholder="First name *"
                      className="w-full rounded-lg border border-(--border-default) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                    <input
                      value={contactLastName}
                      onChange={(e) => setContactLastName(e.target.value)}
                      placeholder="Last name *"
                      className="w-full rounded-lg border border-(--border-default) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Phone"
                      className="w-full rounded-lg border border-(--border-default) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                    <input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Email"
                      type="email"
                      className="w-full rounded-lg border border-(--border-default) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
                    />
                  </div>
                  <p className="text-[11px] text-(--text-muted)">* At least one of email or phone is required.</p>
                </div>
              )}

              {isBooting ? (
                <div className="flex items-center justify-center py-8 text-(--text-muted)">
                  <RiLoader4Line className="mr-2 animate-spin" />
                  Loading conversation...
                </div>
              ) : messages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-(--border-default) bg-white p-4 text-center text-sm text-(--text-muted)">
                  No messages yet. Send a message to begin.
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const prev = messages[idx - 1];
                  const showDay = !prev || formatDay(prev.createdAt) !== formatDay(msg.createdAt);
                  const mine = msg.senderType === "customer";
                  return (
                    <div key={msg.id} className="space-y-1">
                      {showDay && (
                        <p className="my-2 text-center text-[11px] text-(--text-muted)">
                          {formatDay(msg.createdAt)}
                        </p>
                      )}
                      <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                            mine
                              ? "bg-(--primary) text-white rounded-br-md"
                              : "bg-white text-(--text) rounded-bl-md border border-(--border-default)"
                          }`}
                        >
                          {msg.content && <p className="whitespace-pre-wrap break-words">{msg.content}</p>}
                          {msg.attachmentUrl && (
                            <a
                              href={msg.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`mt-1 block text-xs underline ${mine ? "text-white/90" : "text-(--primary)"}`}
                            >
                              {msg.contentType === "image" ? "View image" : "Open attachment"}
                            </a>
                          )}
                          <p className={`mt-1 text-[10px] ${mine ? "text-white/80" : "text-(--text-muted)"}`}>
                            {formatTime(msg.createdAt)}
                            {mine && msg.readAt ? " • Read" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {isLoadingMessages && (
                <p className="text-center text-xs text-(--text-muted)">Refreshing messages...</p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,application/pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="p-4 border-t border-(--border-default) bg-(--bg-page)">
              {files.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {files.map((item) => (
                    <div
                      key={item.id}
                      className="inline-flex items-center gap-2 rounded-full border border-(--border-default) bg-white px-3 py-1 text-xs text-(--text)"
                    >
                      <RiAttachment2 className="text-sm" />
                      <span className="max-w-28 truncate">{item.file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        className="text-(--text-muted) hover:text-red-500"
                        aria-label="Remove attachment"
                      >
                        <RiCloseLine />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={files.length >= 6 || isSending}
                  className="shrink-0 rounded-xl border border-(--border-default) bg-white p-2.5 text-(--text-muted) hover:text-(--primary) hover:border-(--primary) disabled:opacity-50"
                  aria-label="Attach file"
                >
                  <RiAttachment2 className="text-lg" />
                </button>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    conversation
                      ? "Type your message..."
                      : hasBuyerJwt
                        ? "Write your first message..."
                        : "Write your first message (required)..."
                  }
                  rows={2}
                  disabled={isSending}
                  className="min-h-12 max-h-28 w-full resize-y rounded-xl border border-(--border-default) bg-white px-3 py-2 text-sm text-(--text) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                />
                <button
                  type="button"
                  onClick={() => void refreshMessages(lastPolledAt ?? undefined)}
                  className="shrink-0 rounded-xl border border-(--border-default) bg-white p-2.5 text-(--text-muted) hover:text-(--primary) hover:border-(--primary)"
                  aria-label="Refresh messages"
                >
                  <RiRefreshLine className="text-lg" />
                </button>
              </div>

              <Button
                type="button"
                primary
                className="mt-3 w-full uppercase"
                onClick={() => void handleSend()}
                isLoading={isSending}
                disabled={isBooting || (conversation?.status === "closed" && !!conversation)}
              >
                <RiSendPlaneFill />
                {conversation ? "Send" : "Start chat"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
