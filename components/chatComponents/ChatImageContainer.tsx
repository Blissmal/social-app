"use client";
import { Download, Maximize, X } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface ImgElementProps {
  message: {
    image?: string | null;
  };
}

const ImageContainer = ({ message }: ImgElementProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = async (imageUrl: string) => {
    if (!imageUrl?.trim()) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      window.open(imageUrl, "_blank");
      return;
    }

    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `chat-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Download failed. Please try again.");
    }
  };

  // Close modal on Escape key press
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleKeyDown]);

  return (
    <>
      {message.image && (
        <div className="relative group mt-2 w-40">
          {/* Thumbnail Image */}
          <img
            src={message.image || ""}
            alt="Chat Attachment"
            loading="lazy"
            className="rounded-lg w-full h-auto object-cover cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => handleDownload(message.image!)}
              className="bg-gray-800 text-white p-1 rounded"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-800 text-white p-1 rounded"
            >
              <Maximize size={16} />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={() => setIsModalOpen(false)} // Click outside to close
        >
          <div className="relative flex flex-col items-center p-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 bg-red-600 text-white p-2 rounded-full shadow-lg z-50"
            >
              <X size={22} />
            </button>

            <img
              src={message.image || ""}
              alt="Enlarged Chat Image"
              className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
            />

            <button
              onClick={() => handleDownload(message.image!)}
              className="mt-4 bg-gray-800 text-white p-2 rounded flex items-center gap-2 shadow-lg"
            >
              <Download size={20} />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageContainer;
