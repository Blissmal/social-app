"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";
import React from "react";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

const imageUpload = ({ onChange, value, endpoint }: ImageUploadProps) => {

    if (value) {
    return (
      <div className="relative size-40">
        <img
          src={value}
          alt="Upload"
          className="size-40 object-cover rounded-md"
        />
        <button
          className="absolute top-0 right-0 bg-red-500 p-1 rounded-full shadow-sm"
          onClick={() => onChange("")}
        >
          <XIcon className="size-4 text-white" />
        </button>
      </div>
    );
    }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.error(error);
      }}
    />
  );
};

export default imageUpload;
