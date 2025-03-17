"use client";
import { Download } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

interface ImgElementProps {
  message: {
    image?: string | null;
  };
}

const ImageContainer = ({ message }: ImgElementProps) => {
  const handleDownload = async (imageUrl: string) => {
    if (!imageUrl) return;

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
      toast.success("Image download success !")
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Error downloading image ! Try again")
    }
  };

  return (
    <>
      {message.image && (
        <div className="relative group mt-2 w-40">
          <img
            src={message.image}
            alt="Attachment"
            className="rounded-lg w-full h-auto object-cover"
          />
          <button
            onClick={() => handleDownload(message.image!)}
            className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
          >
            <Download size={16} />
          </button>
        </div>
      )}
    </>
  );
};

export default ImageContainer;
