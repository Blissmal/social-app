"use client";

import { Download, Maximize, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ImgElementProps {
  post: {
    image?: string | null;
  };
}

const PostCardImageContainer = ({ post }: ImgElementProps) => {
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
      link.download = `post-image-${Date.now()}.jpg`;
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
      {post.image && (
        <div className="relative group rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt="Post content"
            className="w-full h-auto object-cover cursor-pointer transition-transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          />

          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => handleDownload(post.image!)}
              className="bg-gray-800 text-white p-2 rounded shadow-md hover:bg-gray-700 transition"
              title="Download"
              role="button"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-800 text-white p-2 rounded shadow-md hover:bg-gray-700 transition"
              title="Expand"
              role="button"
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed backdrop-blur inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 px-4"
            onClick={() => setIsModalOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative flex flex-col items-center p-4 bg-white rounded-lg shadow-lg max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-4 -right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-500 transition z-50"
                title="Close"
                role="button"
              >
                <X size={24} />
              </button>

              <img
                src={post.image || ""}
                alt="Enlarged Post Image"
                className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
              />

              <button
                onClick={() => handleDownload(post.image!)}
                className="mt-4 bg-gray-800 text-white p-3 rounded-lg flex items-center gap-2 shadow-md hover:bg-gray-700 transition"
                title="Download Image"
                role="button"
              >
                <Download size={22} />
                <span>Download</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostCardImageContainer;
