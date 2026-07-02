"use client";
import { useDashboard } from "@/context/DashboardContext";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, CheckCircle } from "lucide-react";
import axios from "axios";

export default function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const { refreshDashboard } = useDashboard();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      await axios.post(
        "http://127.0.0.1:8000/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      refreshDashboard();
      setMessage("✅ Document uploaded successfully.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed.");
    }

    setUploading(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-6">
        Upload Industrial Documents
      </h1>

      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-xl p-20 cursor-pointer hover:bg-gray-50 transition"
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center">

          <UploadCloud className="w-16 h-16 text-blue-600 mb-4" />

          <h2 className="text-2xl font-semibold">
            Drag & Drop PDF or DOCX
          </h2>

          <p className="text-gray-500 mt-2">
            or click to browse
          </p>

        </div>
      </div>

      {uploading && (
        <div className="mt-6 text-blue-600">
          Uploading...
        </div>
      )}

      {message && (
        <div className="mt-6 flex items-center gap-2 text-green-700">
          <CheckCircle />
          {message}
        </div>
      )}
    </div>
  );
}