"use client";

import { useRef, useState, useEffect } from "react";
import {
  RiFileImageLine,
  RiFilePdfLine,
  RiFileTextLine,
  RiCloseLine,
  RiFile2Line,
} from "react-icons/ri";
import axios from "axios";

type FileType = "image" | "document" | "custom";

type UploadFile = {
  id: string;
  file: File;
  preview: string;
  progress: number;
  url?: string;
  error?: string;
};

type Props = {
  label?: string;
  name: string;
  multiple?: boolean;
  fileType?: FileType;
  accept?: string;
  maxSizeMB?: number;
  onFilesChange: (files: UploadedFile[]) => void;
  initialUrls?: string[];
};

const fileTypeMap: Record<FileType, string> = {
  image: "image/*",
  document: ".pdf,.doc,.docx,.txt",
  custom: "",
};

type UploadedFile = { url: string; file: File };

const FileUpload = ({
  label,
  name,
  multiple = true,
  fileType = "image",
  accept,
  maxSizeMB = 5,
  onFilesChange,
  initialUrls = [],
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>(() =>
    initialUrls.map((url) => ({
      id: crypto.randomUUID(),
      file: new File([], url.split("/").pop() || "file"), // dummy file
      preview: url,
      progress: 100,
      url,
    })),
  );
  const [dragging, setDragging] = useState(false);

  const acceptedTypes = accept || fileTypeMap[fileType];

  // Cleanup URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  useEffect(() => {
    const uploaded = files
      .filter((f) => f.progress === 100 && f.url)
      .map((f) => ({ url: f.url as string, file: f.file }));

    onFilesChange(uploaded);
  }, [files]);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const selected: UploadFile[] = [];

    Array.from(fileList).forEach((file) => {
      if (file.size > maxSizeBytes) {
        // File too large → add with error (or skip entirely)
        selected.push({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          error: `Max size is ${maxSizeMB}MB`,
        });
      } else {
        // Valid file
        selected.push({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
        });
      }
    });

    setFiles((prev) => {
      const updated = multiple ? [...prev, ...selected] : selected;

      // only upload valid files
      selected.forEach((f) => {
        if (!f.error) {
          uploadFile(f.id, f.file);
        }
      });

      return updated;
    });
  };

  const uploadImage = async (
    file: File,
    onProgress: (progress: number) => void,
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_IMAGE_URL}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (!event.total) return;

          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        },
      },
    );
    return res.data.filename;
  };

  const uploadFile = async (id: string, file: File) => {
    try {
      const url = await uploadImage(file, (progress) => {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f)),
        );
      });

      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress: 100, url } : f)),
      );
    } catch (err) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, error: "Upload failed", progress: 0 } : f,
        ),
      );
    }
  };

  const retryUpload = (id: string) => {
    const fileToRetry = files.find((f) => f.id === id);
    if (!fileToRetry) return;

    // reset state before retry
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, progress: 0, error: undefined } : f,
      ),
    );

    uploadFile(id, fileToRetry.file);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const fileToRemove = prev[index];
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image")) return <RiFileImageLine />;
    if (file.type.includes("pdf")) return <RiFilePdfLine />;
    return <RiFileTextLine />;
  };

  const uploadedFiles = files.filter((f) => f.progress === 100);

  const truncateText = (str: string, words: number) => {
    return str.slice(0, words) + "...";
  };

  return (
    <div className="space-y-3">
      {label && <label className="font-semibold block mb-1">{label}</label>}

      {/* DROP ZONE */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-slate-500 text-center cursor-pointer flex flex-col gap-1 justify-center items-center
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-(--primary) mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 16l3.586-3.586a2 2 0 012.828 0L12 16m0 0l3.586-3.586a2 2 0 012.828 0L21 16m-9-5V4m0 7v7"
          />
        </svg>
        <p className="text-sm">
          <span className="font-semibold text-(--primary)">
            Click to upload
          </span>{" "}
          or drag and drop
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {fileType == 'image' ? 'PNG, JPG' : 'PDF, docx'} up to {maxSizeMB}MB each
        </p>
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
      {files.map((f) => (
        <div
          key={f.id}
          className="border border-(--border-default) rounded-lg p-2"
        >
          <p className="text-xs">{truncateText(f.file.name, 30)}</p>

          {f.error ? (
            <div className="flex justify-between items-center">
              <span className="text-red-500 text-sm">{f.error}</span>
              <button
                type="button"
                onClick={() => retryUpload(f.id)}
                className="text-xs underline"
              >
                Retry
              </button>
            </div>
          ) : f.progress < 100 ? (
            // ONLY show progress if still uploading
            <div className="h-2 bg-gray-200 rounded mt-1">
              <div
                className="h-full bg-black rounded"
                style={{ width: `${f.progress}%` }}
              />
            </div>
          ) : (
            // Uploaded state
            <span className="text-green-600 text-xs">Uploaded</span>
          )}
        </div>
      ))}

      {/* ICON PREVIEW (BOTTOM) */}
      {uploadedFiles.length > 0 && (
        <div className="flex gap-3 flex-wrap pt-2">
          {uploadedFiles.map((item, index) => (
            <div
              key={index}
              className="relative w-14 h-14 border border-(--border-default) rounded-lg flex items-center justify-center"
            >
              {item.file.type.startsWith("image") || item.url ? (
                <img
                  src={item.url || URL.createObjectURL(item.file)}
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