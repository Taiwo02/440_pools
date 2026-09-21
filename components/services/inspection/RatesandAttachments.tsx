"use client";
import React from "react";
import {
  AttachmentKind,
  InspectionRates,
  InspectionRequestType,
} from "@/types/types";
import { useGetInspectionRates } from "@/api/services";
import { Button, FileUpload, Input } from "@/components/ui";

type Props = {
  formValues: InspectionRequestType;
  setFormValues: React.Dispatch<React.SetStateAction<InspectionRequestType>>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
      Element
    >,
  ) => void;
};

const RatesandAttachments = ({
  formValues,
  setFormValues,
  handleChange,
}: Props) => {
  const { data: rates, isPending, error } = useGetInspectionRates();

  const radioOptions =
    rates?.map((rate: InspectionRates) => ({
      value: rate.tier,
      node: (
        <div className="flex flex-col items-center gap-1">
          <span className="capitalize text-sm font-medium">
            {rate.tier.toLowerCase()}
          </span>
          <span className="font-semibold text-sm">
            ₦{(rate.feeKobo / 100).toLocaleString()}
          </span>
        </div>
      ),
    })) ?? [];

  const benefits = () => {
    switch (formValues.depth) {
      case "BASIC":
        return (
          <ul className="list-disc list-inside">
            <li className="text-xs text-(--text-muted)">Quantity count</li>
            <li className="text-xs text-(--text-muted)">Packaging condition</li>
            <li className="text-xs text-(--text-muted)">
              Photos (multiple angles)
            </li>
            <li className="text-xs text-(--text-muted)">Videos (overview)</li>
          </ul>
        );
      case "STANDARD":
        return (
          <ul className="list-disc list-inside">
            <li className="text-xs text-(--text-muted)">
              All Basic Inspection items
            </li>
            <li className="text-xs text-(--text-muted)">
              Power-on test (electronics)
            </li>
            <li className="text-xs text-(--text-muted)">Size measurement</li>
            <li className="text-xs text-(--text-muted)">
              Material feel (subjective)
            </li>
          </ul>
        );
      case "COMPREHENSIVE":
        return (
          <ul className="list-disc list-inside">
            <li className="text-xs text-(--text-muted)">
              All Standard Inspection items
            </li>
            <li className="text-xs text-(--text-muted)">
              Full functional testing
            </li>
            <li className="text-xs text-(--text-muted)">
              Material/quality lab check (where applicable)
            </li>
            <li className="text-xs text-(--text-muted)">
              Barcode/label verification
            </li>
            <li className="text-xs text-(--text-muted)">
              Detailed report with defect breakdown
            </li>
          </ul>
        );

      default:
        return null;
    }
  };

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
    <>
      {isPending ? (
        <p className="text-sm text-(--muted)">Loading inspection rates...</p>
      ) : error ? (
        <p className="text-sm text-red-500">
          Couldn't load inspection rates. Please try again.
        </p>
      ) : (
        <>
          <Input
            element="input"
            input_type="radio"
            name="depth"
            value={formValues.depth}
            handler={handleChange}
            radioOptions={radioOptions}
            tag="Inspection Depth"
          />
          <div className="mt-2">
            <h3 className="font-bold">Benefits</h3>
            {benefits()}
          </div>
        </>
      )}
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
    </>
  );
};

export default RatesandAttachments;
