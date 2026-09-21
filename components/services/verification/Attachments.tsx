"use client";
import { FileUpload, Input } from "@/components/ui";
import { AttachmentKind, VerifySupplierRequest } from "@/types/types";
import React from "react";

type Props = {
  formValues: VerifySupplierRequest;
  setFormValues: React.Dispatch<React.SetStateAction<VerifySupplierRequest>>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
      Element
    >,
  ) => void;
};

const Attachments = ({ formValues, setFormValues, handleChange }: Props) => {
  const ATTACHMENT_KINDS = [
    { label: "Invoice", value: "INVOICE" },
    { label: "Quotation", value: "QUOTATION" },
    { label: "Receipt", value: "RECEIPT" },
    { label: "Screenshot", value: "SCREENSHOT" },
    { label: "Photo", value: "PHOTO" },
    { label: "Video", value: "VIDEO" },
    { label: "Report", value: "REPORT" },
    { label: "Other", value: "OTHER" },
  ];

  const handleAttachmentKindChange =
    (index: number) => (e: React.ChangeEvent<any>) => {
      const { value } = e.target;
      setFormValues((prev) => ({
        ...prev,
        attachments: prev.attachments?.map((a, i) =>
          i === index ? { ...a, kind: value } : a,
        ),
      }));
    };

  const inferAttachmentKind = (file: File): AttachmentKind => {
    const type = file.type;
    const name = file.name.toLowerCase();

    if (type.startsWith("image/")) return "PHOTO";
    if (type.startsWith("video/")) return "VIDEO";
    if (
      type === "application/pdf" ||
      name.endsWith(".pdf") ||
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    ) {
      return "QUOTATION";
    }
    return "OTHER";
  };

  return (
    <div className="my-2">
      <FileUpload
        label="Attachments (Invoice/PO/Receipt/Photo)"
        name="attachments"
        fileType="custom"
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        multiple
        initialUrls={formValues.attachments?.map((a) => a.url)}
        onFilesChange={(uploaded) => {
          setFormValues((prev) => ({
            ...prev,
            attachments: uploaded.map(({ url, file }) => ({
              url,
              kind: inferAttachmentKind(file),
              note: "",
            })),
          }));
        }}
      />
      {formValues.attachments && formValues.attachments.length > 0 && (
        <div className="space-y-2 mt-3">
          {formValues.attachments.map((att, index) => (
            <div key={att.url} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 truncate flex-1">
                {att.url.split("/").pop()}
              </span>
              <Input
                element="select"
                name={`attachments.${index}.kind`}
                value={att.kind}
                handler={handleAttachmentKindChange(index)}
                selectOptions={ATTACHMENT_KINDS}
                placeholder="Select type"
                genStyle="my-0 w-40"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attachments;
