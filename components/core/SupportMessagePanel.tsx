"use client";

import { Button } from "@/components/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { RiCloseLine, RiImageAddLine, RiSendPlaneFill } from "react-icons/ri";
import { toast } from "react-toastify";

type AttachedImage = { id: string; file: File; url: string };

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SupportMessagePanel({ open, onClose }: Props) {
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<AttachedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const revokeAll = useCallback((list: AttachedImage[]) => {
    list.forEach((i) => URL.revokeObjectURL(i.url));
  }, []);

  useEffect(() => {
    if (open) return;
    setMessage("");
    setImages((prev) => {
      prev.forEach((i) => URL.revokeObjectURL(i.url));
      return [];
    });
  }, [open]);

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

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const next: AttachedImage[] = [];
    const remaining = Math.max(0, 6 - images.length);
    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        next.push({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
          file,
          url: URL.createObjectURL(file),
        });
      });
    if (!next.length && files.length) {
      toast.error("Please choose image files only.");
      return;
    }
    setImages((prev) => [...prev, ...next]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed && images.length === 0) {
      toast.error("Add a message or attach an image.");
      return;
    }
    toast.success("Message sent. Our team will get back to you soon.");
    revokeAll(images);
    setImages([]);
    setMessage("");
    onClose();
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
            className="fixed z-[61] inset-x-0 bottom-0 max-h-[min(92vh,640px)] md:inset-auto md:bottom-6 md:right-6 md:left-auto md:top-auto md:max-h-[min(85vh,560px)] w-full md:w-[min(100vw-3rem,26rem)] flex flex-col rounded-t-2xl md:rounded-2xl border border-(--border-default) bg-(--bg-surface) shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-(--border-default) bg-(--bg-page)">
              <h2
                id="support-panel-title"
                className="text-base font-semibold text-(--text)"
              >
                Message support
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-(--text-muted) hover:bg-(--primary-soft) hover:text-(--primary) transition-colors"
                aria-label="Close"
              >
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
              <p className="text-xs text-(--text-muted)">
                Describe your issue below. You can attach screenshots directly.
              </p>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={5}
                className="w-full resize-none rounded-xl border border-(--border-default) bg-(--bg-surface) px-3 py-2 text-sm text-(--text) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--primary)"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />

              {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-(--border-default) shrink-0"
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 6}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-(--border-default) py-3 text-sm text-(--text-muted) hover:border-(--primary) hover:text-(--primary) hover:bg-(--primary-soft)/40 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <RiImageAddLine className="text-lg" />
                Add images
              </button>
            </div>

            <div className="p-4 border-t border-(--border-default) bg-(--bg-page)">
              <Button
                type="button"
                primary
                className="w-full uppercase"
                onClick={handleSend}
              >
                <RiSendPlaneFill />
                Send
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
