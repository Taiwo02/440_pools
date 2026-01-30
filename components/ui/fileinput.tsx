"use client";

import { useRef, useState, useEffect } from "react";
import {
  RiFileImageLine,
  RiFilePdfLine,
  RiFileTextLine,
  RiCloseLine,
  RiFile2Line,
} from "react-icons/ri";

type FileType = "image" | "document" | "custom";

type UploadFile = {
  file: File;
  progress: number;
  error?: string;
};

type Props = {
  label?: string;
  name: string;
  multiple?: boolean;
  fileType?: FileType;
  accept?: string;
  maxSizeMB?: number;
  onFilesChange: (files: File[]) => void;
};

const fileTypeMap: Record<FileType, string> = {
  image: "image/*",
  document: ".pdf,.doc,.docx,.txt",
  custom: "",
};

const FileUpload = ({
  label,
  name,
  multiple = true,
  fileType = "image",
  accept,
  maxSizeMB = 5,
  onFilesChange,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragging, setDragging] = useState(false);

  const acceptedTypes = accept || fileTypeMap[fileType];

  // Cleanup URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.file.name));
    };
  }, [files]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const selected: UploadFile[] = Array.from(fileList)
      .filter((file) => {
        if (file.size / 1024 / 1024 > maxSizeMB) {
          console.warn(`File ${file.name} exceeds max size of ${maxSizeMB}MB`);
          return false;
        }
        return true;
      })
      .map((file) => ({ file, progress: 0 }));

    if (!multiple) setFiles([]); // clear existing if not multiple
    setFiles((prev) => {
      const updated = multiple ? [...prev, ...selected] : selected;
      selected.forEach((_, idx) => simulateUpload(multiple ? prev.length + idx : idx));
      return updated;
    });
  };

  const simulateUpload = (index: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prev) => {
        const updated = prev.map((f, i) =>
          i === index ? { ...f, progress } : f
        );

        // Call onFilesChange with fully uploaded files
        onFilesChange(updated.filter((f) => f.progress === 100).map((f) => f.file));

        return updated;
      });

      if (progress >= 100) clearInterval(interval);
    }, 250);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onFilesChange(updated.filter((f) => f.progress === 100).map((f) => f.file));
      return updated;
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image")) return <RiFileImageLine />;
    if (file.type.includes("pdf")) return <RiFilePdfLine />;
    return <RiFileTextLine />;
  };

  const uploadedFiles = files.filter((f) => f.progress === 100);

  return (
    <div className="space-y-3">
      {label && <label className="font-semibold block mb-1">{label}</label>}

      {/* DROP ZONE */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-slate-500 text-center cursor-pointer
          ${dragging ? "border-black bg-gray-100" : "border-gray-300"} hover:border-(--primary) hover:text-(--primary)`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <RiFile2Line size={36} className="mx-auto mb-2" />
        Drag & drop files or <span className="underline">click to upload</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        multiple={multiple}
        accept={acceptedTypes}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* UPLOADING LIST */}
      {files.some((f) => f.progress < 100) && (
        <div className="space-y-2">
          {files
            .filter((f) => f.progress < 100)
            .map((f, i) => (
              <div key={i} className="border rounded p-2">
                <p className="text-sm truncate">{f.file.name}</p>
                <div className="h-2 bg-gray-200 rounded mt-1">
                  <div
                    className="h-full bg-black rounded"
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ICON PREVIEW (BOTTOM) */}
      {uploadedFiles.length > 0 && (
        <div className="flex gap-3 flex-wrap pt-2">
          {uploadedFiles.map((item, index) => (
            <div
              key={index}
              className="relative w-14 h-14 border rounded-lg flex items-center justify-center"
            >
              {item.file.type.startsWith("image") ? (
                <img
                  src={URL.createObjectURL(item.file)}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-2xl">{getFileIcon(item.file)}</span>
              )}

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
              >
                <RiCloseLine size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;