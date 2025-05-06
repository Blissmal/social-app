"use client";

import { useEffect, useState } from "react";

interface PreviewData {
  title?: string;
  description?: string;
  image?: string;
}

const LinkPreview = ({ url }: { url: string }) => {
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch("/api/link-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const preview = await res.json();
        setData(preview);
      } catch (err) {
        console.error("Preview fetch failed", err);
      }
    };

    if (url) {
      fetchPreview();
    }
  }, [url]);

  if (!data || !data.title || typeof data.title !== "string") return null;

  const isValidImage = typeof data.image === "string" && data.image.startsWith("http");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg overflow-hidden shadow hover:shadow-md transition bg-white dark:bg-gray-900 max-w-md"
    >
      {isValidImage && (
        <img
          src={data.image}
          alt="preview"
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <p className="font-semibold text-sm">
          {data.title}
        </p>
        {typeof data.description === "string" && (
          <p className="text-xs text-gray-600">{data.description}</p>
        )}
        <p className="text-xs text-blue-500 mt-1">{url}</p>
      </div>
    </a>
  );
};

export default LinkPreview;
